import React from 'react';
import { useData } from '../hooks/useData';
import { fetchWeatherData } from '../services/api';
import { REFRESH_INTERVALS } from '../constants';
import { getWeatherInfo } from './icons';

export const WeatherWidget: React.FC = () => {
  const { data, error, isLoading } = useData(fetchWeatherData, REFRESH_INTERVALS.WEATHER);

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-gray-400 text-center text-sm">Chargement...</p>;
    }
    if (error || !data) {
      return <p className="text-red-400 text-center text-sm">Erreur météo.</p>;
    }

    const { temperature, weathercode } = data.current_weather;
    const { description, Icon } = getWeatherInfo(weathercode);
    const todayMax = data.daily?.temperature_2m_max?.[0];
    const todayMin = data.daily?.temperature_2m_min?.[0];
    const tomorrowMax = data.daily?.temperature_2m_max?.[1];
    const tomorrowMin = data.daily?.temperature_2m_min?.[1];

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Icon className="w-12 h-12 text-yellow-300 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-3xl font-bold tabular-nums">{Math.round(temperature)}°C</span>
            <span className="text-gray-300 capitalize text-sm">{description}</span>
          </div>
        </div>
        {(todayMax != null || tomorrowMax != null) && (
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
            <div className="bg-black/20 rounded-md p-2">
              <p className="uppercase text-[10px] text-sky-200">Aujourd'hui</p>
              <p className="font-semibold tabular-nums">
                {todayMin != null && todayMax != null
                  ? `${Math.round(todayMin)}° / ${Math.round(todayMax)}°`
                  : '--'}
              </p>
            </div>
            <div className="bg-black/20 rounded-md p-2">
              <p className="uppercase text-[10px] text-sky-200">Demain</p>
              <p className="font-semibold tabular-nums">
                {tomorrowMin != null && tomorrowMax != null
                  ? `${Math.round(tomorrowMin)}° / ${Math.round(tomorrowMax)}°`
                  : '--'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#1b263b]/60 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/10">
      <h2 className="text-lg font-bold mb-2 text-[#e0e1dd]">Météo détaillée</h2>
      <div className="min-h-[56px] flex items-center">{renderContent()}</div>
    </div>
  );
};
