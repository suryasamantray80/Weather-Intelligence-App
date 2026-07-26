import React from 'react';
import { OpenMeteoForecastResponse } from '../types/weather';
import {
  Umbrella,
  Sun,
  Wind,
  Smile,
  CheckCircle2,
  AlertCircle,
  Compass,
  Lightbulb,
} from 'lucide-react';

interface SmartPlanningCardProps {
  forecast: OpenMeteoForecastResponse;
}

export interface RecommendationItem {
  id: string;
  type: 'rain' | 'heat' | 'wind' | 'pleasant';
  title: string;
  message: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  valueText: string;
}

export const SmartPlanningCard: React.FC<SmartPlanningCardProps> = ({ forecast }) => {
  const current = forecast.current_weather;
  const daily = forecast.daily;

  const currentTempC = current?.temperature ?? 0;
  const currentWindKmh = current?.windspeed ?? 0;

  // Max values across today / forecast
  const todayRainMm = daily?.precipitation_sum?.[0] ?? 0;
  const maxRainMm = daily?.precipitation_sum ? Math.max(...daily.precipitation_sum) : 0;
  const maxTempC = daily?.temperature_2m_max ? Math.max(...daily.temperature_2m_max) : currentTempC;
  const maxWindKmh = daily?.windspeed_10m_max ? Math.max(...daily.windspeed_10m_max) : currentWindKmh;

  const recommendations: RecommendationItem[] = [];

  // Rule 1: High rain expected (> 2mm)
  if (todayRainMm > 2 || maxRainMm > 2) {
    recommendations.push({
      id: 'high-rain',
      type: 'rain',
      title: 'Rain & Wet Weather Alert',
      message: 'Carry an umbrella and wear waterproof shoes.',
      icon: <Umbrella className="w-5 h-5 text-blue-400" />,
      bgGradient: 'from-blue-950/60 to-slate-900/90',
      borderColor: 'border-blue-500/40',
      textColor: 'text-blue-200',
      badgeBg: 'bg-blue-500/20 border-blue-400/30 text-blue-300',
      valueText: `Precipitation: ${Math.max(todayRainMm, maxRainMm).toFixed(1)} mm`,
    });
  }

  // Rule 2: High temperature (> 30°C)
  if (currentTempC > 30 || maxTempC > 30) {
    recommendations.push({
      id: 'high-temp',
      type: 'heat',
      title: 'High Heat Warning',
      message: 'Stay hydrated and wear sunscreen.',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      bgGradient: 'from-amber-950/60 to-slate-900/90',
      borderColor: 'border-amber-500/40',
      textColor: 'text-amber-200',
      badgeBg: 'bg-amber-500/20 border-amber-400/30 text-amber-300',
      valueText: `High Temp: ${Math.round(Math.max(currentTempC, maxTempC))}°C`,
    });
  }

  // Rule 3: High wind speed (> 20 km/h)
  if (currentWindKmh > 20 || maxWindKmh > 20) {
    recommendations.push({
      id: 'high-wind',
      type: 'wind',
      title: 'High Wind Caution',
      message: 'Caution: Gusty conditions expected outside.',
      icon: <Wind className="w-5 h-5 text-sky-400" />,
      bgGradient: 'from-sky-950/60 to-slate-900/90',
      borderColor: 'border-sky-500/40',
      textColor: 'text-sky-200',
      badgeBg: 'bg-sky-500/20 border-sky-400/30 text-sky-300',
      valueText: `Wind: ${Math.round(Math.max(currentWindKmh, maxWindKmh))} km/h`,
    });
  }

  // Rule 4: Cool / Pleasant weather
  // Defined as mild temperatures (between 15°C and 28°C), low rain (<= 2mm), and moderate wind (<= 20 km/h)
  const isTemperaturePleasant = currentTempC >= 15 && currentTempC <= 28;
  const isRainLow = todayRainMm <= 2;
  const isWindModerate = currentWindKmh <= 20;

  if (isTemperaturePleasant && isRainLow && isWindModerate) {
    recommendations.push({
      id: 'pleasant-weather',
      type: 'pleasant',
      title: 'Pleasant Atmospheric Conditions',
      message: 'Great weather for outdoor activities!',
      icon: <Smile className="w-5 h-5 text-emerald-400" />,
      bgGradient: 'from-emerald-950/60 to-slate-900/90',
      borderColor: 'border-emerald-500/40',
      textColor: 'text-emerald-200',
      badgeBg: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300',
      valueText: `Ideal ${Math.round(currentTempC)}°C & clear winds`,
    });
  }

  // If no specific alert triggered, provide default smart advice
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'default-pleasant',
      type: 'pleasant',
      title: 'Mild Weather Conditions',
      message: 'Great weather for outdoor activities!',
      icon: <Smile className="w-5 h-5 text-emerald-400" />,
      bgGradient: 'from-emerald-950/60 to-slate-900/90',
      borderColor: 'border-emerald-500/40',
      textColor: 'text-emerald-200',
      badgeBg: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300',
      valueText: `Temperature ${Math.round(currentTempC)}°C`,
    });
  }

  return (
    <div className="w-full bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl mb-8 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Smart Planning Recommendations</h2>
            <p className="text-xs text-slate-400">Dynamic client-side advisory based on live weather threshold triggers</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {recommendations.length} {recommendations.length === 1 ? 'Rule Active' : 'Rules Active'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-4 rounded-2xl bg-gradient-to-br ${rec.bgGradient} border ${rec.borderColor} shadow-lg transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
                  {rec.icon}
                </div>
                <h3 className="text-sm font-bold text-white">{rec.title}</h3>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${rec.badgeBg}`}>
                {rec.valueText}
              </span>
            </div>

            <p className={`text-sm font-semibold mt-2 ${rec.textColor} flex items-center gap-2`}>
              <CheckCircle2 className="w-4 h-4 shrink-0 opacity-80" />
              <span>{rec.message}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
