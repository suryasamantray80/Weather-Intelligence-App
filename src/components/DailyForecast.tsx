import React, { useState } from 'react';
import { Calendar, Droplets, LayoutGrid, ListFilter, ArrowUp, ArrowDown } from 'lucide-react';
import { DailyForecastData, TemperatureUnit } from '../types/weather';
import {
  getWeatherConditionInfo,
  formatTemp,
  formatDayLabel,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  dailyData?: DailyForecastData;
  tempUnit: TemperatureUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ dailyData, tempUnit }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (!dailyData || !dailyData.time || dailyData.time.length === 0) {
    return null;
  }

  // Calculate global max and min for proportional progress bar rendering
  const allMaxs = dailyData.temperature_2m_max || [];
  const allMins = dailyData.temperature_2m_min || [];
  const minTempLimit = Math.min(...allMins, -10);
  const maxTempLimit = Math.max(...allMaxs, 40);
  const totalSpan = Math.max(1, maxTempLimit - minTempLimit);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl mb-8 hover:border-slate-700 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">7-Day Forecast Cards</h2>
            <p className="text-xs text-slate-400">7-day atmospheric outlook & expected rainfall</p>
          </div>
        </div>

        {/* View mode toggle button */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>List Row</span>
          </button>
        </div>
      </div>

      {/* Grid View of 7-Day Cards */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {dailyData.time.map((timeIso, index) => {
            const maxTemp = dailyData.temperature_2m_max?.[index] ?? 0;
            const minTemp = dailyData.temperature_2m_min?.[index] ?? 0;
            const code = dailyData.weathercode?.[index] ?? 0;
            const precip = dailyData.precipitation_sum?.[index] ?? 0;
            const cond = getWeatherConditionInfo(code);

            const isToday = index === 0;

            return (
              <div
                key={timeIso}
                className={`p-4 rounded-2xl border flex flex-col justify-between transition-all hover:scale-[1.02] ${
                  isToday
                    ? 'bg-gradient-to-b from-sky-950/80 to-slate-900 border-sky-500/50 shadow-lg shadow-sky-500/10'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800'
                }`}
              >
                <div>
                  {/* Header Day */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-extrabold ${isToday ? 'text-sky-400' : 'text-slate-300'}`}>
                      {formatDayLabel(timeIso, isToday)}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Weather Icon & Condition */}
                  <div className="my-3 flex flex-col items-center text-center">
                    <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 mb-2 shadow-sm">
                      <WeatherIcon iconName={cond.iconName} className="w-8 h-8 text-sky-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {cond.label}
                    </span>
                  </div>
                </div>

                <div>
                  {/* Rain Info */}
                  <div className="my-2 text-center">
                    {precip > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-md">
                        <Droplets className="w-3 h-3" />
                        {precip.toFixed(1)} mm
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium">0.0 mm rain</span>
                    )}
                  </div>

                  {/* Temperatures */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-0.5 text-rose-400 font-extrabold">
                      <ArrowUp className="w-3 h-3" />
                      <span>{formatTemp(maxTemp, tempUnit)}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-sky-400 font-bold">
                      <ArrowDown className="w-3 h-3" />
                      <span>{formatTemp(minTemp, tempUnit)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {dailyData.time.map((timeIso, index) => {
            const maxTemp = dailyData.temperature_2m_max?.[index] ?? 0;
            const minTemp = dailyData.temperature_2m_min?.[index] ?? 0;
            const code = dailyData.weathercode?.[index] ?? 0;
            const precip = dailyData.precipitation_sum?.[index] ?? 0;
            const cond = getWeatherConditionInfo(code);

            const isToday = index === 0;

            const leftPercent = Math.max(0, ((minTemp - minTempLimit) / totalSpan) * 100);
            const widthPercent = Math.max(8, ((maxTemp - minTemp) / totalSpan) * 100);

            return (
              <div
                key={timeIso}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isToday
                    ? 'bg-sky-500/10 border-sky-500/40 shadow-md'
                    : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/90'
                }`}
              >
                {/* Day & Condition Label */}
                <div className="flex items-center justify-between sm:justify-start gap-4 sm:w-1/3">
                  <div className="w-24 shrink-0">
                    <div className="text-sm font-extrabold text-white">
                      {formatDayLabel(timeIso, isToday)}
                    </div>
                    <div className="text-xs text-slate-400 hidden sm:block font-medium">
                      {cond.label}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80 shadow-xs">
                      <WeatherIcon iconName={cond.iconName} className="w-5 h-5 text-sky-400" />
                    </div>
                    <span className="text-xs text-slate-300 sm:hidden font-medium">
                      {cond.label}
                    </span>
                  </div>
                </div>

                {/* Rain amount if any */}
                <div className="my-2 sm:my-0 flex items-center gap-1.5 text-xs text-slate-400 sm:w-28 justify-start sm:justify-center">
                  {precip > 0 ? (
                    <span className="inline-flex items-center gap-1 text-blue-400 font-bold bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-md">
                      <Droplets className="w-3.5 h-3.5" />
                      {precip.toFixed(1)} mm
                    </span>
                  ) : (
                    <span className="text-slate-500 text-xs">No precipitation</span>
                  )}
                </div>

                {/* Temperature Bar */}
                <div className="flex items-center gap-3 sm:w-1/2">
                  <span className="text-xs font-bold text-slate-400 w-10 text-right">
                    {formatTemp(minTemp, tempUnit)}
                  </span>

                  <div className="relative flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-500"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-extrabold text-white w-10">
                    {formatTemp(maxTemp, tempUnit)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
