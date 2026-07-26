import React from 'react';
import {
  Wind,
  Droplets,
  Gauge,
  Thermometer,
  ArrowUp,
  ArrowDown,
  Sun,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  OpenMeteoForecastResponse,
  TemperatureUnit,
  SpeedUnit,
  GeocodingLocation,
} from '../types/weather';
import {
  getWeatherConditionInfo,
  formatTemp,
  formatSpeed,
  getWindDirectionLabel,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  location: GeocodingLocation | null;
  forecast: OpenMeteoForecastResponse;
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  location,
  forecast,
  tempUnit,
  speedUnit,
}) => {
  const current = forecast.current_weather;
  if (!current) {
    return null;
  }

  const cond = getWeatherConditionInfo(current.weathercode, current.is_day);

  // Derive extra details from hourly or daily if available
  const todayMax = forecast.daily?.temperature_2m_max?.[0] ?? current.temperature;
  const todayMin = forecast.daily?.temperature_2m_min?.[0] ?? current.temperature;
  const currentHumidity = forecast.hourly?.relative_humidity_2m?.[0] ?? 60;
  const currentApparentTemp = forecast.hourly?.apparent_temperature?.[0] ?? current.temperature;
  const currentPressure = forecast.hourly?.surface_pressure?.[0] ?? 1013;
  const currentUV = forecast.hourly?.uv_index?.[0] ?? forecast.daily?.uv_index_max?.[0] ?? 3;

  const cityName = location?.name || 'Current Location';
  const locationSubtitle = [location?.admin1, location?.country].filter(Boolean).join(', ');

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      id="current-weather-card"
      className="relative w-full rounded-[32px] bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-900 text-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(8,145,178,0.25)] overflow-hidden border border-sky-400/30"
    >
      {/* Background Subtle Atmosphere Glow */}
      <div className="absolute -right-16 -top-16 w-72 h-72 bg-white/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2 text-sky-200 font-bold text-sm mb-1">
            <MapPin className="w-4 h-4 shrink-0 text-sky-300" />
            <span id="current-city-name" className="text-lg sm:text-xl text-white font-extrabold tracking-tight">
              {cityName}
            </span>
            {locationSubtitle && (
              <span className="text-sky-100 font-medium text-sm">({locationSubtitle})</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-sky-200/80">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Condition Badge */}
        <div className="self-start sm:self-auto flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-md">
          <WeatherIcon iconName={cond.iconName} className="w-4 h-4 text-sky-300" />
          <span>{cond.label}</span>
        </div>
      </div>

      {/* Primary Weather Display */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center">
        {/* Left Column: Huge Temperature & Weather Icon */}
        <div className="md:col-span-7 flex items-center gap-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-950/30 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center shrink-0">
            <WeatherIcon
              iconName={cond.iconName}
              className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-lg"
            />
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span
                id="current-temperature-display"
                className="text-5xl sm:text-7xl font-black tracking-tight text-white drop-shadow-sm"
              >
                {formatTemp(current.temperature, tempUnit)}
              </span>
            </div>

            <p id="current-weather-condition" className="text-base font-semibold text-sky-100 mt-1">
              {cond.description}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-sky-100 mt-3">
              <span className="flex items-center gap-1.5 bg-slate-950/30 border border-white/10 px-3 py-1 rounded-xl">
                <Thermometer className="w-3.5 h-3.5 text-sky-300" />
                Feels {formatTemp(currentApparentTemp, tempUnit)}
              </span>

              <span className="flex items-center gap-1.5 bg-slate-950/30 border border-white/10 px-3 py-1 rounded-xl">
                <ArrowUp className="w-3.5 h-3.5 text-rose-300" />
                {formatTemp(todayMax, tempUnit)}
                <ArrowDown className="w-3.5 h-3.5 text-sky-300 ml-0.5" />
                {formatTemp(todayMin, tempUnit)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Key Metrics Grid */}
        <div className="md:col-span-5 grid grid-cols-2 gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/15 md:pl-6">
          {/* Wind Speed */}
          <div className="bg-slate-950/40 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 flex items-center gap-3 shadow-md">
            <div className="p-2.5 rounded-xl bg-sky-500/25 text-sky-200 shrink-0 border border-sky-400/30">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-sky-200 font-semibold uppercase tracking-wider">Wind Speed</div>
              <div id="current-wind-speed" className="text-sm font-black text-white">
                {formatSpeed(current.windspeed, speedUnit)}
              </div>
              <div className="text-[11px] text-sky-200/80 font-medium">
                {getWindDirectionLabel(current.winddirection)} ({current.winddirection}°)
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-slate-950/40 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 flex items-center gap-3 shadow-md">
            <div className="p-2.5 rounded-xl bg-blue-500/25 text-blue-200 shrink-0 border border-blue-400/30">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-sky-200 font-semibold uppercase tracking-wider">Humidity</div>
              <div className="text-sm font-black text-white">{Math.round(currentHumidity)}%</div>
              <div className="text-[11px] text-sky-200/80 font-medium">
                {currentHumidity > 70 ? 'High' : currentHumidity < 30 ? 'Dry' : 'Optimal'}
              </div>
            </div>
          </div>

          {/* Air Pressure */}
          <div className="bg-slate-950/40 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 flex items-center gap-3 shadow-md">
            <div className="p-2.5 rounded-xl bg-indigo-500/25 text-indigo-200 shrink-0 border border-indigo-400/30">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-sky-200 font-semibold uppercase tracking-wider">Pressure</div>
              <div className="text-sm font-black text-white">
                {Math.round(currentPressure)} hPa
              </div>
              <div className="text-[11px] text-sky-200/80 font-medium">Barometric</div>
            </div>
          </div>

          {/* UV Index */}
          <div className="bg-slate-950/40 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 flex items-center gap-3 shadow-md">
            <div className="p-2.5 rounded-xl bg-amber-500/25 text-amber-200 shrink-0 border border-amber-400/30">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-sky-200 font-semibold uppercase tracking-wider">UV Index</div>
              <div className="text-sm font-black text-white">{currentUV.toFixed(1)}</div>
              <div className="text-[11px] text-sky-200/80 font-medium">
                {currentUV >= 8
                  ? 'Very High'
                  : currentUV >= 6
                  ? 'High'
                  : currentUV >= 3
                  ? 'Moderate'
                  : 'Low'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
