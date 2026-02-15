import React, { useCallback } from 'react';
import { useData } from '../hooks/useData';
import { fetchVehicleJourney } from '../services/api';
import { format } from 'date-fns';

interface JourneyDetailsModalProps {
  vehicleJourneyRef: string;
  destination: string;
  lineLabel: string;
  onClose: () => void;
}

export const JourneyDetailsModal: React.FC<JourneyDetailsModalProps> = ({
  vehicleJourneyRef,
  destination,
  lineLabel,
  onClose,
}) => {
  const fetchJourney = useCallback(() => fetchVehicleJourney(vehicleJourneyRef), [vehicleJourneyRef]);

  const { data, error, isLoading } = useData(
    fetchJourney,
    60000 // Refresh every minute
  );

  const journeyDetails = data?.Siri.ServiceDelivery.VehicleJourneyDelivery[0]?.DatedVehicleJourney[0];
  const stops = journeyDetails?.Calls.Call || [];

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-gray-400 text-center p-8">Chargement de la desserte...</p>;
    }
    if (error) {
      return <p className="text-red-400 text-center p-8">Erreur de chargement de la desserte.</p>;
    }
    if (!journeyDetails || stops.length === 0) {
      return <p className="text-gray-400 text-center p-8">Aucune information de desserte disponible.</p>;
    }
    return (
      <ol className="space-y-2">
        {stops.map((stop, index) => {
          const arrivalTime = stop.ExpectedArrivalTime || stop.AimedArrivalTime;
          const time = arrivalTime ? format(new Date(arrivalTime), 'HH:mm') : '--:--';
          return (
            <li key={index} className="flex items-center gap-4 text-sm">
              <span className="font-bold text-gray-300 tabular-nums bg-black/20 px-2 py-1 rounded-md">{time}</span>
              <span className="text-gray-200">{stop.StopPointName.value}</span>
            </li>
          );
        })}
      </ol>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="journey-details-title"
    >
      <div 
        className="bg-[#0d1b2a] border border-white/20 rounded-lg shadow-2xl w-full max-w-md m-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 id="journey-details-title" className="text-lg font-bold text-white">
              {lineLabel} vers {destination}
            </h2>
            <p className="text-xs text-gray-400">Détail des arrêts</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
