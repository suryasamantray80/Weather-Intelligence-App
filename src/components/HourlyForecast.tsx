import React from 'react';
import { Clock, Umbrella } from 'lucide-react';
import { HourlyForecastData, TemperatureUnit } from '../types/weather';
import { getWeatherConditionInfo, formatTemp, formatHourTime } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourlyData?: HourlyForecastData;
  tempUnit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData, tempUnit }) => {
  if (!hourlyData || !hourlyData.time || hourlyData.time.length === 0) {
    return null;
  }

  // Filter next 24 hours starting from current time
  const now = new Date();
  const currentHourIndex = hourlyData.time.findIndex((iso) => {
    const t = new Date(iso);
    return t >= new Date(now.getTime() - 30 * 60 * 1000); // within last 30 min
  });

  const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0;
  const next24Hours = hourlyData.time.slice(startIndex, startIndex + 24).map((isoTime, idx) => {
    const originalIdx = startIndex + idx;
    return {
      time: isoTime,
      temp: hourlyData.temperature_2m?.[originalIdx] ?? 0,
      code: hourlyData.weathercode?.[originalIdx] ?? 0,
      pop: hourlyData.precipitation_probability?.[originalIdx] ?? 0,
    };
  });

  return (
    <div className="w-full bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl mb-8 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl">
            <Clock className="w-4 h-4" />
          </div>
          <h2 className="text-base font-extrabold text-white">24-Hour Hourly Timeline</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">Scroll horizontally →</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-800">
        {next24Hours.map((item, idx) => {
          const cond = getWeatherConditionInfo(item.code);
          const isNow = idx === 0;

          return (
            <div
              key={item.time}
              className={`flex flex-col items-center justify-between p-3.5 rounded-2xl min-w-[85px] border transition-all ${
                isNow
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/20 font-bold scale-105'
                  : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-200'
              }`}
            >
              <span className={`text-xs font-bold ${isNow ? 'text-slate-950' : 'text-slate-400'}`}>
                {isNow ? 'NOW' : formatHourTime(item.time)}
              </span>

              <div className="my-3">
                <WeatherIcon
                  iconName={cond.iconName}
                  className={`w-7 h-7 ${isNow ? 'text-slate-950' : 'text-sky-400'}`}
                />
              </div>

              <span className={`text-base font-black mb-1 ${isNow ? 'text-slate-950' : 'text-white'}`}>
                {formatTemp(item.temp, tempUnit)}
              </span>

              {item.pop > 0 ? (
                <div
                  className={`flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    isNow ? 'bg-slate-950 text-sky-400' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  <Umbrella className="w-2.5 h-2.5" />
                  <span>{item.pop}%</span>
                </div>
              ) : (
                <span className="text-[10px] text-transparent select-none">0%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
