import {
  GeocodingLocation,
  GeocodingResponse,
  OpenMeteoForecastResponse,
} from '../types/weather';

/**
 * Searches locations using Open-Meteo Geocoding API
 * https://geocoding-api.open-meteo.com/v1/search?name={cityName}&count={count}&language=en&format=json
 */
export async function searchLocations(cityName: string, count: number = 5): Promise<GeocodingLocation[]> {
  const trimmed = cityName.trim();
  if (!trimmed) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding API server error (${response.status}). Please try again later.`);
    }

    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Network error while searching location. Please check your connection.');
  }
}

/**
 * Fetches forecast data from Open-Meteo Forecast API
 * https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto
 */
export async function getForecast(latitude: number, longitude: number): Promise<OpenMeteoForecastResponse> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,windspeed_10m_max,precipitation_probability_max&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weathercode,surface_pressure,windspeed_10m,uv_index&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Forecast service error (${response.status}). Please try again later.`);
    }

    const data: OpenMeteoForecastResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Network error while fetching weather forecast. Please check your internet connection.');
  }
}

/**
 * Reverse geocodes latitude/longitude to a readable location name
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision;
      const country = data.countryName;
      if (city && country) return `${city}, ${country}`;
      if (city) return city;
    }
  } catch {
    // Fallback if reverse geocode service is unavailable
  }
  return `Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`;
}
