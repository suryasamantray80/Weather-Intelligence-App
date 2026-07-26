import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Navigation, Clock, X } from 'lucide-react';
import { GeocodingLocation } from '../types/weather';
import { searchLocations } from '../services/openMeteo';

interface SearchBarProps {
  onSelectLocation: (location: GeocodingLocation) => void;
  onUseCurrentLocation: () => void;
  isLoading: boolean;
  isLocating: boolean;
  onError?: (msg: string) => void;
}

const POPULAR_CITIES = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectLocation,
  onUseCurrentLocation,
  isLoading,
  isLocating,
  onError,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingLocation[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<GeocodingLocation[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recent_weather_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsSearchingSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const results = await searchLocations(query, 6);
        setSuggestions(results);
        setIsOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (loc: GeocodingLocation) => {
    const updated = [loc, ...recentSearches.filter((item) => item.id !== loc.id)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('recent_weather_searches', JSON.stringify(updated));
    } catch {
      // Ignore storage error
    }
  };

  const handleSelect = (location: GeocodingLocation) => {
    saveRecentSearch(location);
    onSelectLocation(location);
    setQuery(`${location.name}${location.country ? `, ${location.country}` : ''}`);
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      onError?.('Please enter a city name to search.');
      return;
    }

    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else {
      setIsSearchingSuggestions(true);
      try {
        const results = await searchLocations(trimmed, 5);
        if (results.length > 0) {
          handleSelect(results[0]);
        } else {
          onError?.(`City "${trimmed}" not found. Please check spelling.`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Network error while searching location. Please check your connection.';
        onError?.(msg);
      } finally {
        setIsSearchingSuggestions(false);
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8" ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            {isSearchingSuggestions ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search city name (e.g. London, Tokyo, San Francisco)..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          id="search-city-button"
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-6 py-3.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Search</span>
            </>
          )}
        </button>

        {/* Current Location Button */}
        <button
          id="geolocation-button"
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating || isLoading}
          title="Use current device location"
          className="p-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-sky-400 rounded-2xl shadow-md transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
          ) : (
            <Navigation className="w-5 h-5 text-sky-400" />
          )}
        </button>
      </form>

      {/* Dropdown Suggestions */}
      {isOpen && (
        <div className="absolute z-30 mt-2 w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-800/80">
          {suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Matching Cities
              </div>
              {suggestions.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-sky-500/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white text-sm">{loc.name}</span>
                      <span className="text-xs text-slate-400 ml-1.5">
                        {loc.admin1 ? `${loc.admin1}, ` : ''}
                        {loc.country || ''}
                      </span>
                    </div>
                  </div>
                  {loc.population ? (
                    <span className="text-xs text-slate-500">
                      Pop. {(loc.population / 1000).toFixed(0)}k
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {suggestions.length === 0 && recentSearches.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Recent Searches
              </div>
              {recentSearches.map((loc) => (
                <button
                  key={`recent-${loc.id}`}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-slate-800/60 transition-colors cursor-pointer text-sm"
                >
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {loc.name}, {loc.country}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && suggestions.length === 0 && !isSearchingSuggestions && (
            <div className="p-4 text-center text-sm text-slate-400">
              No matching cities found for &quot;{query}&quot;. Press Search to try exact lookup.
            </div>
          )}
        </div>
      )}

      {/* Quick City Pills */}
      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Popular:</span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.name}
            type="button"
            onClick={() =>
              handleSelect({
                id: Math.random(),
                name: city.name,
                country: city.country,
                latitude: city.lat,
                longitude: city.lon,
              })
            }
            className="text-xs px-3 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 text-slate-300 hover:text-sky-400 rounded-full transition-all cursor-pointer"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
};
