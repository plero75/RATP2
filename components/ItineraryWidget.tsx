import React, { useMemo, useCallback } from 'react';
import { useData } from '../hooks/useData';
import { fetchTransportData } from '../services/api';
import { TRANSPORT_CONFIG, ITINERARY_CONSTANTS, REFRESH_INTERVALS } from '../constants';
// Fix: Replaced `parseISO` with `new Date()` for compatibility as `parseISO` is not available.
import { differenceInSeconds, isValid } from 'date-fns';
import { RerAIcon, BusIcon, WalkIcon, BikeIcon } from './icons';

const getMinutesUntil = (to: string): number => {
    // Fix: Replaced `parseISO` with `new Date()` for compatibility.
    const date = new Date(to);
    if (!isValid(date)) return Infinity;
    return Math.max(0, Math.round(differenceInSeconds(date, new Date()) / 60));
};

const getNextDeparture = (data: any, lineId: string, destinationFilter?: (dest: string) => boolean) => {
    const visits = data?.Siri?.ServiceDelivery?.StopMonitoringDelivery?.[0]?.MonitoredStopVisit || [];
    const relevantVisits = visits.filter((v: any) => {
        const journey = v.MonitoredVehicleJourney;
        const matchesLine = journey?.LineRef?.value === lineId;
        if (!matchesLine) return false;
        
        const dest = journey.DestinationName?.[0]?.value || '';
        const matchesDest = destinationFilter ? destinationFilter(dest) : true;

        const isCancelled = /supprim|cancel/i.test(journey.MonitoredCall.DepartureStatus || '') || /supprim|cancel/i.test(journey.JourneyNote?.map((n: any) => n.value).join(' ') || '');
        
        return matchesDest && !isCancelled;
    });

    if (relevantVisits.length === 0) return null;
    
    const nextVisit = relevantVisits[0];
    const expectedTime = nextVisit.MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime || nextVisit.MonitoredVehicleJourney.MonitoredCall.AimedDepartureTime;
    return {
        waitTime: getMinutesUntil(expectedTime)
    };
};

const RouteOption: React.FC<{ icon: React.ReactNode, time: number, description: string, isBest?: boolean }> = ({ icon, time, description, isBest }) => (
    <div className={`flex items-center gap-3 p-2 rounded-lg ${isBest ? 'bg-green-500/20 border border-green-400' : 'bg-black/20'}`}>
        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${isBest ? 'bg-green-400 text-black' : 'bg-gray-600 text-white'}`}>
            {icon}
        </div>
        <div className="flex-grow">
            <div className={`font-bold text-lg ${isBest ? 'text-green-300' : 'text-white'}`}>
                ~ {time} min
            </div>
            <p className="text-xs text-gray-400">{description}</p>
        </div>
    </div>
);


export const ItineraryWidget: React.FC = () => {
    const fetchRerA = useCallback(() => fetchTransportData(TRANSPORT_CONFIG.RER_A.stopAreaId, TRANSPORT_CONFIG.RER_A.lineId), []);
    const { data: rerAData } = useData(fetchRerA, REFRESH_INTERVALS.TRANSPORT);

    const fetchBus77 = useCallback(() => fetchTransportData(TRANSPORT_CONFIG.BUS_77_HIPPODROME.stopAreaId, TRANSPORT_CONFIG.BUS_77_HIPPODROME.lineId), []);
    const { data: bus77Data } = useData(fetchBus77, REFRESH_INTERVALS.TRANSPORT);

    const routes = useMemo(() => {
        const nextBusToJoinville = getNextDeparture(bus77Data, TRANSPORT_CONFIG.BUS_77_HIPPODROME.lineId, dest => /Joinville/i.test(dest));
        const nextBusToGareDeLyon = getNextDeparture(bus77Data, TRANSPORT_CONFIG.BUS_77_HIPPODROME.lineId, dest => /Gare de Lyon/i.test(dest));
        const nextRerToParis = getNextDeparture(rerAData, TRANSPORT_CONFIG.RER_A.lineId, dest => !/Boissy|Marne/i.test(dest));

        // Destination: Joinville RER
        const busToJoinvilleTime = nextBusToJoinville ? nextBusToJoinville.waitTime + ITINERARY_CONSTANTS.BUS_TIME_HIPPODROME_TO_JOINVILLE_MIN : Infinity;
        const walkToJoinvilleTime = ITINERARY_CONSTANTS.WALK_TIME_TO_JOINVILLE_MIN;
        const joinvilleRoutes = [
            { type: 'Bus', time: busToJoinvilleTime, icon: <BusIcon />, desc: 'Bus 77 (vers Joinville)' },
            { type: 'Walk', time: walkToJoinvilleTime, icon: <WalkIcon className="w-5 h-5"/>, desc: 'À pied' },
        ].sort((a,b) => a.time - b.time);

        // Destination: Gare de Lyon
        const busDirectGareDeLyonTime = nextBusToGareDeLyon ? nextBusToGareDeLyon.waitTime + ITINERARY_CONSTANTS.BUS_TIME_HIPPODROME_TO_GARE_DE_LYON_MIN : Infinity;
        const busRerGareDeLyonTime = (nextBusToJoinville && nextRerToParis) ? 
            nextBusToJoinville.waitTime + ITINERARY_CONSTANTS.BUS_TIME_HIPPODROME_TO_JOINVILLE_MIN + ITINERARY_CONSTANTS.TRANSFER_TIME_MIN + nextRerToParis.waitTime + ITINERARY_CONSTANTS.RER_TIME_JOINVILLE_TO_GARE_DE_LYON_MIN 
            : Infinity;
        const velibGareDeLyonTime = ITINERARY_CONSTANTS.VELIB_TIME_TO_GARE_DE_LYON_MIN;
        const gareDeLyonRoutes = [
            { type: 'Bus', time: busDirectGareDeLyonTime, icon: <BusIcon />, desc: 'Bus 77 (Direct)' },
            { type: 'BusRer', time: busRerGareDeLyonTime, icon: <div className="flex items-center"><BusIcon /><RerAIcon /></div>, desc: 'Bus 77 + RER A' },
            { type: 'Velib', time: velibGareDeLyonTime, icon: <BikeIcon className="w-5 h-5"/>, desc: 'Vélib\'' },
        ].sort((a,b) => a.time - b.time);
        
        // Destination: Châtelet
        const busRerChateletTime = (nextBusToJoinville && nextRerToParis) ?
             nextBusToJoinville.waitTime + ITINERARY_CONSTANTS.BUS_TIME_HIPPODROME_TO_JOINVILLE_MIN + ITINERARY_CONSTANTS.TRANSFER_TIME_MIN + nextRerToParis.waitTime + ITINERARY_CONSTANTS.RER_TIME_JOINVILLE_TO_CHATELET_MIN
             : Infinity;
        const velibChateletTime = ITINERARY_CONSTANTS.VELIB_TIME_TO_CHATELET_MIN;
         const chateletRoutes = [
            { type: 'BusRer', time: busRerChateletTime, icon: <div className="flex items-center"><BusIcon /><RerAIcon /></div>, desc: 'Bus 77 + RER A' },
            { type: 'Velib', time: velibChateletTime, icon: <BikeIcon className="w-5 h-5"/>, desc: 'Vélib\'' },
        ].sort((a,b) => a.time - b.time);

        return { joinvilleRoutes, gareDeLyonRoutes, chateletRoutes };

    }, [rerAData, bus77Data]);

    const renderRouteSet = (title: string, routeSet: any[]) => (
        <div>
            <h3 className="font-bold text-base text-sky-300 mb-1.5">{title}</h3>
            <div className="space-y-1.5">
                {routeSet.map((route, index) => (
                    route.time !== Infinity && <RouteOption key={route.type} icon={route.icon} time={Math.round(route.time)} description={route.desc} isBest={index === 0} />
                ))}
            </div>
        </div>
    );
    
    return (
        <div className="bg-[#1b263b]/60 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 flex flex-col">
            <h2 className="text-lg font-bold mb-2 text-[#e0e1dd]">Planificateur d'itinéraires</h2>
            <div className="space-y-3">
                {renderRouteSet("Rejoindre Joinville RER", routes.joinvilleRoutes)}
                {renderRouteSet("Aller à Gare de Lyon", routes.gareDeLyonRoutes)}
                {renderRouteSet("Aller à Châtelet", routes.chateletRoutes)}
            </div>
        </div>
    );
};
