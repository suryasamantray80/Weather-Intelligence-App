import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { DailyForecastData, TemperatureUnit } from '../types/weather';
import { formatShortDay, celsiusToFahrenheit } from '../utils/weatherUtils';
import { TrendingUp, Thermometer } from 'lucide-react';

interface TemperatureTrendChartProps {
  dailyData?: DailyForecastData;
  tempUnit: TemperatureUnit;
}

export const TemperatureTrendChart: React.FC<TemperatureTrendChartProps> = ({
  dailyData,
  tempUnit,
}) => {
  if (!dailyData || !dailyData.time || dailyData.time.length === 0) {
    return null;
  }

  // Format data for Recharts
  const chartData = dailyData.time.map((timeIso, index) => {
    const rawMax = dailyData.temperature_2m_max?.[index] ?? 0;
    const rawMin = dailyData.temperature_2m_min?.[index] ?? 0;

    const maxTemp =
      tempUnit === 'F' ? Math.round(celsiusToFahrenheit(rawMax)) : Math.round(rawMax);
    const minTemp =
      tempUnit === 'F' ? Math.round(celsiusToFahrenheit(rawMin)) : Math.round(rawMin);

    return {
      day: index === 0 ? 'Today' : formatShortDay(timeIso),
      fullDate: new Date(timeIso).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      MaxTemp: maxTemp,
      MinTemp: minTemp,
      precip: dailyData.precipitation_sum?.[index] ?? 0,
    };
  });

  return (
    <div className="w-full bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-2xl mb-8 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">7-Day Temperature Trend</h2>
            <p className="text-xs text-slate-400">Comparing daily high & low temperatures ({`°${tempUnit}`})</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Max Temp</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>Min Temp</span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              unit={`°`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-2xl shadow-xl text-xs space-y-1 backdrop-blur-md">
                      <p className="font-bold text-white mb-1 border-b border-slate-800 pb-1">
                        {data.fullDate}
                      </p>
                      <div className="flex items-center gap-2 text-rose-400 font-semibold">
                        <Thermometer className="w-3.5 h-3.5" />
                        <span>Max Temp: {data.MaxTemp}°{tempUnit}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sky-400 font-semibold">
                        <Thermometer className="w-3.5 h-3.5" />
                        <span>Min Temp: {data.MinTemp}°{tempUnit}</span>
                      </div>
                      {data.precip > 0 && (
                        <p className="text-blue-400 font-medium pt-1">
                          Precipitation: {data.precip.toFixed(1)} mm
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend display="none" />
            <Line
              type="monotone"
              dataKey="MaxTemp"
              name="Max Temp"
              stroke="#f43f5e"
              strokeWidth={3}
              dot={{ fill: '#f43f5e', r: 4, strokeWidth: 2, stroke: '#881337' }}
              activeDot={{ r: 6, fill: '#fda4af' }}
            />
            <Line
              type="monotone"
              dataKey="MinTemp"
              name="Min Temp"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ fill: '#38bdf8', r: 4, strokeWidth: 2, stroke: '#0369a1' }}
              activeDot={{ r: 6, fill: '#bae6fd' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
