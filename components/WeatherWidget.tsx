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

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-12 h-12 text-yellow-300 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-3xl font-bold tabular-nums">{Math.round(temperature)}°C</span>
            <span className="text-gray-300 capitalize text-sm">{description}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1b263b]/60 p-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/10">
      <h2 className="text-lg font-bold mb-2 text-[#e0e1dd]">Météo</h2>
      <div className="min-h-[56px] flex items-center">{renderContent()}</div>
    </div>
  );
};