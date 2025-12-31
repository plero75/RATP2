import React from 'react';
import { useData } from '../hooks/useData';
import { fetchTrafficEvents } from '../services/api';
import { REFRESH_INTERVALS } from '../constants';
import type { TrafficEvent } from '../types';
import { WarningIcon } from './icons';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

const TrafficEventItem: React.FC<{ event: TrafficEvent }> = ({ event }) => {
  const timeAgo = formatDistanceToNow(new Date(event.datedebut), { addSuffix: true, locale: fr });
  const type_color = event.type === 'Manifestation' ? 'text-orange-300' :
                     event.type === 'Travaux' ? 'text-yellow-300' : 'text-sky-300';
  
  return (
    <div className="p-2 bg-black/20 rounded-md">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-grow">
          <p className={`font-bold text-xs uppercase tracking-wider ${type_color}`}>{event.type}</p>
          <p className="font-semibold text-sm text-gray-200">{event.lieu}</p>
        </div>
        <p className="text-xs text-gray-400 flex-shrink-0">{timeAgo}</p>
      </div>
      <p className="text-xs text-gray-300 mt-1">{event.intitule}</p>
    </div>
  );
};


export const TrafficWidget: React.FC = () => {
    const { data, error, isLoading } = useData(fetchTrafficEvents, REFRESH_INTERVALS.TRAFFIC_INFO);

    const renderContent = () => {
        if (isLoading && !data) {
            return <p className="text-gray-400 text-center text-sm py-2">Chargement des infos trafic...</p>;
        }
        if (error) {
            return <p className="text-red-400 text-center text-sm py-2">Service d'info trafic indisponible.</p>;
        }
        if (!data || data.results.length === 0) {
            return <p className="text-gray-400 text-center text-sm py-2">Trafic fluide, aucun incident signalé.</p>;
        }

        return (
            <div className="space-y-2 overflow-y-auto max-h-[200px] pr-1">
                {data.results.map((event, index) => (
                    <TrafficEventItem key={index} event={event} />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-[#1b263b]/60 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 flex flex-col">
            <div className="flex items-center mb-2">
                <WarningIcon className="w-5 h-5 text-yellow-300" />
                <h2 className="text-lg font-bold ml-2 text-[#e0e1dd]">Infos Trafic — Paris</h2>
            </div>
            {renderContent()}
        </div>
    );
};
