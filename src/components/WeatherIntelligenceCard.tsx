import React from 'react';
import {
  Sparkles,
  Shirt,
  Car,
  Activity,
  Bike,
  Utensils,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { OpenMeteoForecastResponse, WeatherIntelligenceSummary } from '../types/weather';
import { generateWeatherIntelligence } from '../utils/weatherUtils';

interface WeatherIntelligenceCardProps {
  forecast: OpenMeteoForecastResponse;
}

export const WeatherIntelligenceCard: React.FC<WeatherIntelligenceCardProps> = ({ forecast }) => {
  const current = forecast.current_weather;
  if (!current) return null;

  const humidity = forecast.hourly?.relative_humidity_2m?.[0] ?? 50;
  const uv = forecast.hourly?.uv_index?.[0] ?? 3;

  const intelligence: WeatherIntelligenceSummary = generateWeatherIntelligence(
    current.temperature,
    current.weathercode,
    current.windspeed,
    humidity,
    uv
  );

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-4 h-4 text-emerald-600" />;
      case 'Bike':
        return <Bike className="w-4 h-4 text-sky-600" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'Utensils':
      default:
        return <Utensils className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 hover:border-slate-700 transition-colors">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-md">
          <Sparkles className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">Weather Intelligence & Insights</h2>
          <p className="text-xs text-slate-400 font-medium">
            Real-time algorithmic clothing, travel, and outdoor activity radar
          </p>
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6 text-sm text-slate-200 leading-relaxed font-medium">
        {intelligence.summaryText}
      </div>

      {/* Advice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Clothing Advice */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl shrink-0">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
              What to Wear
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {intelligence.clothingAdvice}
            </p>
          </div>
        </div>

        {/* Commute Advice */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
          <div className="p-2.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-1">
              Commute & Travel Tip
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {intelligence.commuteTip}
            </p>
          </div>
        </div>
      </div>

      {/* Activity Suitability Radar */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
          Outdoor Activity Suitability Radar
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {intelligence.activities.map((act) => (
            <div
              key={act.name}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800/80">{getActivityIcon(act.icon)}</div>
                    <span className="text-xs font-bold text-white">{act.name}</span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      act.score >= 80
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : act.score >= 60
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {act.rating} ({act.score}%)
                  </span>
                </div>

                {/* Score Bar */}
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      act.score >= 80
                        ? 'bg-emerald-400'
                        : act.score >= 60
                        ? 'bg-sky-400'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${act.score}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug">{act.advice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
