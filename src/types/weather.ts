export type TemperatureUnit = 'C' | 'F';
export type SpeedUnit = 'kmh' | 'mph';

export interface GeocodingLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingLocation[];
  generationtime_ms?: number;
}

export interface CurrentWeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export interface DailyForecastData {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  uv_index_max?: number[];
  windspeed_10m_max?: number[];
  precipitation_probability_max?: number[];
}

export interface HourlyForecastData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  weathercode: number[];
  surface_pressure: number[];
  windspeed_10m: number[];
  uv_index: number[];
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather?: CurrentWeatherData;
  hourly?: HourlyForecastData;
  daily?: DailyForecastData;
}

export interface WeatherConditionInfo {
  code: number;
  label: string;
  description: string;
  iconName: string;
  bgGradient: string;
  cardTheme: string;
  textColor: string;
}

export interface ActivityInsight {
  name: string;
  score: number; // 0 to 100
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  icon: string;
  advice: string;
}

export interface WeatherIntelligenceSummary {
  summaryText: string;
  clothingAdvice: string;
  commuteTip: string;
  activities: ActivityInsight[];
}
