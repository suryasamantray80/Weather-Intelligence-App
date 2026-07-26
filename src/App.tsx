import React, { useState, useEffect, useCallback } from 'react';
import {
  GeocodingLocation,
  OpenMeteoForecastResponse,
  TemperatureUnit,
  SpeedUnit,
} from './types/weather';
import { getForecast, searchLocations, reverseGeocode } from './services/openMeteo';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherIntelligenceCard } from './components/WeatherIntelligenceCard';
import { TemperatureTrendChart } from './components/TemperatureTrendChart';
import { SmartPlanningCard } from './components/SmartPlanningCard';
import { AlertTriangle, RefreshCw, Loader2, Sparkles } from 'lucide-react';

// Default initial location if none selected (Chennai, India)
const DEFAULT_INITIAL_LOCATION: GeocodingLocation = {
  id: 1264527,
  name: 'Chennai',
  country: 'India',
  admin1: 'Tamil Nadu',
  latitude: 13.0827,
  longitude: 80.2707,
};

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<GeocodingLocation | null>(
    DEFAULT_INITIAL_LOCATION
  );
  const [forecast, setForecast] = useState<OpenMeteoForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [tempUnit, setTempUnit] = useState<TemperatureUnit>('C');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('kmh');

  // Load weather for location
  const loadWeather = useCallback(async (location: GeocodingLocation) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getForecast(location.latitude, location.longitude);
      setForecast(data);
      setSelectedLocation(location);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch weather data.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(DEFAULT_INITIAL_LOCATION);
  }, [loadWeather]);

  // Handle location selection from search bar
  const handleSelectLocation = (location: GeocodingLocation) => {
    loadWeather(location);
  };

  // Handle geolocation auto-detect
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const locationName = await reverseGeocode(latitude, longitude);
          const customLoc: GeocodingLocation = {
            id: Date.now(),
            name: locationName,
            latitude,
            longitude,
          };
          await loadWeather(customLoc);
        } catch {
          // Fallback to coordinates location name
          const fallbackLoc: GeocodingLocation = {
            id: Date.now(),
            name: 'Your Location',
            latitude,
            longitude,
          };
          await loadWeather(fallbackLoc);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please search for your city manually.';
        }
        setErrorMessage(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleRefresh = () => {
    if (selectedLocation) {
      loadWeather(selectedLocation);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <Header
          tempUnit={tempUnit}
          speedUnit={speedUnit}
          onToggleTempUnit={setTempUnit}
          onToggleSpeedUnit={setSpeedUnit}
        />

        {/* Search Bar Component */}
        <SearchBar
          onSelectLocation={handleSelectLocation}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLoading={isLoading}
          isLocating={isLocating}
          onError={(msg) => setErrorMessage(msg)}
        />

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 flex items-center justify-between gap-3 text-sm shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Spinner Skeleton state */}
        {isLoading && !forecast && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-sky-400" />
            <p className="text-sm font-medium">Fetching real-time atmospheric data from Open-Meteo...</p>
          </div>
        )}

        {/* Main Content Area */}
        {forecast && (
          <main className="space-y-8 animate-fade-in">
            {/* Quick Refresh bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300">Live Open-Meteo Feed</span>
              </div>
              <button
                id="refresh-data-button"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-1.5 hover:text-sky-400 text-slate-400 transition-colors font-medium cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Weather</span>
              </button>
            </div>

            {/* Current Weather Main Card */}
            <CurrentWeatherCard
              location={selectedLocation}
              forecast={forecast}
              tempUnit={tempUnit}
              speedUnit={speedUnit}
            />

            {/* Weather Intelligence & Insights */}
            <WeatherIntelligenceCard forecast={forecast} />

            {/* Smart Planning Recommendations */}
            <SmartPlanningCard forecast={forecast} />

            {/* Temperature Trend Chart */}
            <TemperatureTrendChart dailyData={forecast.daily} tempUnit={tempUnit} />

            {/* 24-Hour Forecast Timeline */}
            <HourlyForecast hourlyData={forecast.hourly} tempUnit={tempUnit} />

            {/* 7-Day Forecast Cards */}
            <DailyForecast dailyData={forecast.daily} tempUnit={tempUnit} />
          </main>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-slate-500 py-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Data provided by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-sky-400 hover:underline"
            >
              Open-Meteo Public Weather API
            </a>{' '}
            (No API keys required)
          </p>
          <p className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Weather Intelligence App</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
