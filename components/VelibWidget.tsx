import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { fetchVelibStatus } from '../services/api';
import { REFRESH_INTERVALS, VELIB_STATION_NAMES } from '../constants';
import type { VelibStation } from '../types';
import { BikeIcon, BoltIcon, ParkingIcon } from './icons';

interface VelibWidgetProps {
  stationIds: string[];
}

const VelibStationInfo: React.FC<{ station: VelibStation }> = ({ station }) => {
  const stationName =
    VELIB_STATION_NAMES[station.stationcode.toString()] || station.name || `Station ${station.stationcode}`;
  const isRenting = station.is_renting === 'OUI' && station.is_installed === 'OUI';
  const mechanicalBikes = station.mechanical || 0;
  const eBikes = station.ebike || 0;
  const availableDocks = station.numdocksavailable;

  return (
    <div className="flex flex-col gap-2 p-2 bg-black/20 rounded-md border border-white/10">
      <div className="flex justify-between items-center">
        <h3
          className="font-semibold text-sm text-gray-200 truncate pr-2"
          title={stationName}
        >
          {stationName}
        </h3>
        <span
          className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
            isRenting
              ? 'bg-green-300 text-green-900'
              : 'bg-red-300 text-red-900'
          }`}
        >
          {isRenting ? 'OUVERT' : 'FERMÉ'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center justify-center p-1 bg-black/20 rounded">
          <BikeIcon className="w-5 h-5 text-sky-300" />
          <span className="text-lg font-bold tabular-nums">
            {mechanicalBikes}
          </span>
          <span className="text-[10px] text-gray-400">Méca.</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1 bg-black/20 rounded">
          <div className="relative">
            <BikeIcon className="w-5 h-5 text-lime-300" />
            <BoltIcon className="w-3 h-3 text-lime-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <span className="text-lg font-bold tabular-nums">{eBikes}</span>
          <span className="text-[10px] text-gray-400">Élec.</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1 bg-black/20 rounded">
          <ParkingIcon className="w-5 h-5 text-gray-400" />
          <span className="text-lg font-bold tabular-nums">{availableDocks}</span>
          <span className="text-[10px] text-gray-400">Places</span>
        </div>
      </div>
    </div>
  );
};

export const VelibWidget: React.FC<VelibWidgetProps> = ({ stationIds }) => {
  const { data, error, isLoading } = useData(
    fetchVelibStatus,
    REFRESH_INTERVALS.VELIB
  );

  const relevantStations = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    const stationMap = new Map(
      data
        .filter((s) => s && s.stationcode != null)
        .map((s) => [s.stationcode.toString(), s])
    );
    return stationIds
      .map((id) => stationMap.get(id))
      .filter((s): s is VelibStation => !!s);
  }, [data, stationIds]);

  const renderContent = () => {
    if (isLoading && relevantStations.length === 0) {
      return <p className="text-gray-400 text-sm">Chargement des données Vélib'...</p>;
    }
    if (error) {
      return (
        <p className="text-red-400 text-sm">Erreur de chargement des données Vélib'.</p>
      );
    }
    if (relevantStations.length === 0) {
      return <p className="text-gray-400 text-sm">Aucune station Vélib' trouvée.</p>;
    }
    return (
      <div className="space-y-2">
        {relevantStations.map((station) => (
          <VelibStationInfo key={station.stationcode.toString()} station={station} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#1b263b]/60 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/10">
      <h2 className="text-lg font-bold mb-2 text-[#e0e1dd]">Vélib'</h2>
      {renderContent()}
    </div>
  );
};
