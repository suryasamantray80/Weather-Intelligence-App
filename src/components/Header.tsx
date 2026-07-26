import React from 'react';
import { Sparkles, Thermometer, Wind } from 'lucide-react';
import { TemperatureUnit, SpeedUnit } from '../types/weather';

interface HeaderProps {
  tempUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  onToggleTempUnit: (unit: TemperatureUnit) => void;
  onToggleSpeedUnit: (unit: SpeedUnit) => void;
}

export const Header: React.FC<HeaderProps> = ({
  tempUnit,
  speedUnit,
  onToggleTempUnit,
  onToggleSpeedUnit,
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 sm:px-0 border-b border-slate-800/80 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Weather Intelligence
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold tracking-wide">
              Open-Meteo
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time global atmospheric forecasting & high density metrics
          </p>
        </div>
      </div>

      {/* Unit Settings Toggles */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs font-semibold text-slate-300 shadow-md">
        <div className="flex items-center gap-1 px-1">
          <Thermometer className="w-3.5 h-3.5 text-slate-400" />
          <button
            id="unit-toggle-celsius"
            onClick={() => onToggleTempUnit('C')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              tempUnit === 'C'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-xs font-bold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            °C
          </button>
          <button
            id="unit-toggle-fahrenheit"
            onClick={() => onToggleTempUnit('F')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              tempUnit === 'F'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-xs font-bold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            °F
          </button>
        </div>

        <div className="h-4 w-[1px] bg-slate-800 my-auto" />

        <div className="flex items-center gap-1 px-1">
          <Wind className="w-3.5 h-3.5 text-slate-400" />
          <button
            id="unit-toggle-kmh"
            onClick={() => onToggleSpeedUnit('kmh')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              speedUnit === 'kmh'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-xs font-bold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            km/h
          </button>
          <button
            id="unit-toggle-mph"
            onClick={() => onToggleSpeedUnit('mph')}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              speedUnit === 'mph'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-xs font-bold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            mph
          </button>
        </div>
      </div>
    </header>
  );
};
