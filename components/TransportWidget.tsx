import React, { useMemo, useState, useCallback } from 'react';
import { useData } from '../hooks/useData';
import { fetchTransportData, fetchTrafficAlerts } from '../services/api';
import { REFRESH_INTERVALS, REVERSE_LINE_REFS } from '../constants';
import type {
  TransportConfig,
  MonitoredStopVisit,
  GeneralMessageResponse,
} from '../types';
import { differenceInSeconds, isValid, format } from 'date-fns';
import { InfoIcon } from './icons';
import { JourneyDetailsModal } from './JourneyDetailsModal';

interface TransportWidgetProps {
  config: TransportConfig;
  icon: React.ReactNode;
  title?: string;
}

const IMMINENT_THRESHOLD = 2;
const DELAY_THRESHOLD = 2;
const MAX_DEPARTURES = 3;

const parseSafeISO = (dateString?: string): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isValid(date) ? date : null;
};

const getMinutesUntil = (from: Date, to: Date): number => {
  return Math.max(0, Math.round(differenceInSeconds(to, from) / 60));
};

const getLineLabelFromRef = (lineRef: string): string => {
  const key = REVERSE_LINE_REFS[lineRef];
  if (!key) return `Ligne ${lineRef.slice(-5, -1)}`;
  
  if (key.startsWith('BUS_')) return `Bus ${key.replace('BUS_', '')}`;
  if (key.startsWith('N')) return `Noctilien ${key}`;
  if (key === 'RERA') return 'RER A';
  
  return key;
};

interface DepartureData {
  key: string | number;
  journeyRef?: string;
  remainingMinutes: number;
  isCancelled: boolean;
  isDelayed: boolean;
  delayMinutes: number;
  expectedTimeFormatted: string;
}

const DeparturePill: React.FC<{ departure: DepartureData }> = ({ departure }) => {
  const isImminent = !departure.isCancelled && departure.remainingMinutes < IMMINENT_THRESHOLD;

  if (departure.isCancelled) {
    return (
      <div className="flex flex-col items-center justify-center px-2 py-0.5 rounded-md min-w-[65px] text-center bg-red-900/50 text-red-300/70 border border-red-700/50">
        <span className="font-bold text-xs leading-tight line-through">Supp.</span>
        <span className="font-normal text-[10px] leading-tight opacity-80 line-through">
          {departure.expectedTimeFormatted}
        </span>
      </div>
    );
  }
  
  let pillClass = 'bg-green-200 text-green-900';
  let topContent = `${departure.remainingMinutes} min`;

  if (isImminent) {
    pillClass = 'bg-orange-500 text-white animate-pulse';
    topContent = 'À quai';
  } else if (departure.isDelayed) {
    pillClass = 'bg-yellow-200 text-yellow-900';
    topContent = `${departure.remainingMinutes} min (+${departure.delayMinutes}')`;
  }

  return (
    <div className={`flex flex-col items-center justify-center px-2 py-0.5 rounded-md min-w-[65px] text-center transition-colors duration-300 ${pillClass}`}>
      <span className="font-bold text-xs leading-tight">{topContent}</span>
      <span className="font-normal text-[10px] leading-tight opacity-80">
        {departure.expectedTimeFormatted}
      </span>
    </div>
  );
};

const SingleLineView: React.FC<{ 
  visits: MonitoredStopVisit[];
  lineId: string;
  lineLabel: string;
}> = ({ visits, lineId, lineLabel }) => {
  const [selectedJourney, setSelectedJourney] = useState<{ref: string; destination: string} | null>(null);

  const visitsByDestination = useMemo(() => {
    const filteredVisits = lineId ? visits.filter(v => v?.MonitoredVehicleJourney?.LineRef?.value === lineId) : visits;
    const groups = new Map<string, MonitoredStopVisit[]>();
    
    for (const visit of filteredVisits) {
      const dest = visit.MonitoredVehicleJourney.DestinationName?.[0]?.value || 'Terminus';
      if (!groups.has(dest)) groups.set(dest, []);
      groups.get(dest)!.push(visit);
    }
    
    return Array.from(groups.entries());
  }, [visits, lineId]);

  if (visitsByDestination.length === 0) return null;

  return (
    <>
      <div className="space-y-2">
        {visitsByDestination.map(([destination, destVisits]) => {
          const now = new Date();
          const departures = destVisits.slice(0, MAX_DEPARTURES).map(v => {
            const journey = v.MonitoredVehicleJourney;
            const call = journey.MonitoredCall;
            const aimedTime = parseSafeISO(call.AimedDepartureTime);
            const expectedTime = parseSafeISO(call.ExpectedDepartureTime) || aimedTime;
            
            if (!aimedTime || !expectedTime) return null;
            
            const remainingMinutes = getMinutesUntil(now, expectedTime);
            const delayMinutes = getMinutesUntil(aimedTime, expectedTime);
            const journeyNotes = journey.JourneyNote?.map(note => note.value).join(' ') || '';
            const isCancelled = /supprim|cancel/i.test(call.DepartureStatus || '') || /supprim|cancel/i.test(journeyNotes);
            
            return {
              key: journey.DatedVehicleJourneyRef || Math.random(),
              journeyRef: journey.DatedVehicleJourneyRef,
              remainingMinutes,
              isCancelled,
              isDelayed: delayMinutes > DELAY_THRESHOLD,
              delayMinutes,
              expectedTimeFormatted: format(expectedTime, 'HH:mm'),
            };
          }).filter(Boolean) as DepartureData[];

          if (departures.length === 0) return null;

          return (
            <div key={destination} className="grid grid-cols-[1fr_auto] gap-2 items-center p-2 rounded-md bg-black/20">
              <div className="truncate text-gray-200 font-semibold text-sm" title={destination}>
                {destination}
              </div>
              <div className="flex gap-1.5 items-center justify-end">
                {departures.map((departure, index) => (
                  <div key={departure.key} className="flex items-center gap-1">
                    <DeparturePill departure={departure} />
                    {index === 0 && departure.journeyRef && (
                      <button 
                        onClick={() => setSelectedJourney({ ref: departure.journeyRef!, destination })}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Détails"
                        title="Détails"
                      >
                        <InfoIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {selectedJourney && (
        <JourneyDetailsModal
          vehicleJourneyRef={selectedJourney.ref}
          destination={selectedJourney.destination}
          lineLabel={lineLabel}
          onClose={() => setSelectedJourney(null)}
        />
      )}
    </>
  );
};

export const TransportWidget: React.FC<TransportWidgetProps> = ({ config, icon, title }) => {
  const fetchTransport = useCallback(() => {
    return fetchTransportData(config.stopAreaId, config.lineId, config.omitLineRef);
  }, [config.stopAreaId, config.lineId, config.omitLineRef]);
  
  const { data: transportData, error: transportError, isLoading } = useData(fetchTransport, REFRESH_INTERVALS.TRANSPORT);

  const fetchAlertsCb = useCallback(
    () => config.lineId ? fetchTrafficAlerts(config.lineId) : Promise.resolve(null),
    [config.lineId]
  );
  const { data: alertData } = useData(fetchAlertsCb, REFRESH_INTERVALS.TRAFFIC_ALERTS);

  const allVisits = useMemo(() => {
    const visits = transportData?.Siri?.ServiceDelivery?.StopMonitoringDelivery?.[0]?.MonitoredStopVisit || [];
    
    // Filtre les lignes à exclure si omitLineRef est défini
    if (config.omitLineRef && config.omitLineRef.length > 0) {
      return visits.filter(visit => {
        const lineRef = visit.MonitoredVehicleJourney.LineRef.value;
        return !config.omitLineRef!.includes(lineRef);
      });
    }
    
    return visits;
  }, [transportData, config.omitLineRef]);

  const visitsByLine = useMemo(() => {
    if (config.lineId) {
      return new Map([[config.lineId, allVisits]]);
    }
    
    const groups = new Map<string, MonitoredStopVisit[]>();
    for (const visit of allVisits) {
      const lineRef = visit.MonitoredVehicleJourney.LineRef.value;
      if (!groups.has(lineRef)) groups.set(lineRef, []);
      groups.get(lineRef)!.push(visit);
    }
    
    return groups;
  }, [allVisits, config.lineId]);
  
  const alertMessages = useMemo(() => {
    return (alertData as GeneralMessageResponse | null)?.Siri?.ServiceDelivery
      ?.GeneralMessageDelivery?.[0]?.InfoMessage
      ?.flatMap(info => info.Content?.Message ?? [])
      .flatMap(msg => msg.MessageText ?? [])
      .map(text => text.value)
      .filter(Boolean) || [];
  }, [alertData]);

  const renderContent = () => {
    if (isLoading && allVisits.length === 0) {
      return <p className="text-gray-400 text-center text-sm py-2">Chargement...</p>;
    }
    if (transportError) {
      return <p className="text-red-400 text-center text-sm py-2">Erreur de chargement.</p>;
    }
    if (allVisits.length === 0) {
      return <p className="text-gray-400 text-center text-sm py-2">Aucun passage prévu.</p>;
    }
    
    // Vue multi-lignes (Hub Bus)
    if (!config.lineId) {
      return (
        <div className="space-y-3">
          {Array.from(visitsByLine.entries()).map(([lineId, visits]) => {
            const lineLabel = getLineLabelFromRef(lineId);
            return (
              <div key={lineId}>
                <h3 className="font-bold text-base text-sky-300 mb-1.5">{lineLabel}</h3>
                <SingleLineView visits={visits} lineId={lineId} lineLabel={lineLabel} />
              </div>
            );
          })}
        </div>
      );
    }
    
    // Vue ligne unique
    return <SingleLineView visits={allVisits} lineId={config.lineId} lineLabel={config.label} />;
  };

  return (
    <div className="bg-[#1b263b]/60 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 flex flex-col">
      <div className="flex items-center mb-2">
        {icon}
        <h2 className="text-lg font-bold ml-2 text-[#e0e1dd]">{title || config.label}</h2>
      </div>

      {alertMessages.length > 0 && (
        <div className="flex flex-col gap-1 mb-2 p-2 bg-yellow-900/60 border border-yellow-700/80 rounded-lg">
          <div className="flex items-center gap-2 font-bold text-yellow-200 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.242-1.21 2.878 0l6.363 12.182A1.75 1.75 0 0115.99 18H4.009a1.75 1.75 0 01-1.508-2.719L8.257 3.099zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>Info Trafic</span>
          </div>
          <div className="pl-6 space-y-1 text-xs text-yellow-200">
            {alertMessages.map((msg, i) => <p key={i}>{msg}</p>)}
          </div>
        </div>
      )}
      
      <div className="flex-grow">
        {renderContent()}
      </div>
    </div>
  );
};