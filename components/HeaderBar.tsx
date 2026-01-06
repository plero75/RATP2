import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { useData } from '../hooks/useData';
import { fetchSaintOfDay, fetchWeatherData } from '../services/api';
import { REFRESH_INTERVALS } from '../constants';
import { getWeatherInfo } from './icons';
import { Clock } from './Clock';

const formatDate = (date: Date) => format(date, "EEEE d MMMM yyyy", { locale: fr });

const findNextHourIndex = (times: string[], target: Date) => {
  const targetTime = target.getTime();
  return times.findIndex((time) => new Date(time).getTime() >= targetTime);
};

export const HeaderBar: React.FC = () => {
  const { data: weather } = useData(fetchWeatherData, REFRESH_INTERVALS.WEATHER);
  const { data: saintData } = useData(fetchSaintOfDay, REFRESH_INTERVALS.SAINT);

  const saintName = saintData?.data?.nameday?.fr || 'Saint du jour';
  const todayLabel = useMemo(() => formatDate(new Date()), []);

  const forecastLater = useMemo(() => {
    if (!weather?.hourly) return null;
    const offsetTarget = new Date(Date.now() + 6 * 60 * 60 * 1000);
    const index = findNextHourIndex(weather.hourly.time, offsetTarget);
    if (index < 0) return null;
    return {
      temperature: weather.hourly.temperature_2m[index],
      code: weather.hourly.weathercode[index],
      time: weather.hourly.time[index],
    };
  }, [weather?.hourly]);

  const forecastTomorrow = useMemo(() => {
    if (!weather?.daily) return null;
    const index = weather.daily.time.length > 1 ? 1 : 0;
    return {
      min: weather.daily.temperature_2m_min[index],
      max: weather.daily.temperature_2m_max[index],
      code: weather.daily.weathercode[index],
      date: weather.daily.time[index],
    };
  }, [weather?.daily]);

  const currentWeather = weather?.current_weather
    ? getWeatherInfo(weather.current_weather.weathercode)
    : null;

  const laterWeather = forecastLater ? getWeatherInfo(forecastLater.code) : null;
  const tomorrowWeather = forecastTomorrow ? getWeatherInfo(forecastTomorrow.code) : null;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 p-3 border-b border-white/10 bg-[#0b1524]/80 backdrop-blur-sm">
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-white capitalize">{todayLabel}</span>
        <span className="text-sm text-sky-200">{saintName}</span>
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-wider text-sky-200">Heure</span>
          <Clock />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg border border-white/10">
            {currentWeather?.Icon && <currentWeather.Icon className="w-6 h-6 text-yellow-300" />}
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">Maintenant</span>
              <span className="text-sm font-semibold tabular-nums">
                {weather?.current_weather ? `${Math.round(weather.current_weather.temperature)}°C` : '--'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg border border-white/10">
            {laterWeather?.Icon && <laterWeather.Icon className="w-6 h-6 text-sky-300" />}
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">Dans 6h</span>
              <span className="text-sm font-semibold tabular-nums">
                {forecastLater ? `${Math.round(forecastLater.temperature)}°C` : '--'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg border border-white/10">
            {tomorrowWeather?.Icon && <tomorrowWeather.Icon className="w-6 h-6 text-sky-300" />}
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">Demain</span>
              <span className="text-sm font-semibold tabular-nums">
                {forecastTomorrow ? `${Math.round(forecastTomorrow.min)}° / ${Math.round(forecastTomorrow.max)}°` : '--'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
