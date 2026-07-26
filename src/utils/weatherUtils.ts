import {
  WeatherConditionInfo,
  TemperatureUnit,
  SpeedUnit,
  WeatherIntelligenceSummary,
  ActivityInsight,
} from '../types/weather';

/**
 * WMO Weather Interpretation Codes (WWMO)
 * https://open-meteo.com/en/docs
 */
export function getWeatherConditionInfo(code: number, isDay: number = 1): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: 'Clear Sky',
        description: isDay ? 'Sunny and clear conditions' : 'Clear starry night',
        iconName: isDay ? 'Sun' : 'Moon',
        bgGradient: isDay
          ? 'from-amber-400 via-orange-400 to-amber-600'
          : 'from-slate-900 via-indigo-950 to-blue-950',
        cardTheme: isDay ? 'bg-amber-50/80 border-amber-200' : 'bg-indigo-950/40 border-indigo-800/40',
        textColor: isDay ? 'text-amber-950' : 'text-slate-100',
      };
    case 1:
      return {
        code,
        label: 'Mainly Clear',
        description: 'Mostly sunny with faint high clouds',
        iconName: isDay ? 'Sun' : 'Moon',
        bgGradient: isDay
          ? 'from-amber-300 via-sky-400 to-blue-500'
          : 'from-slate-900 via-slate-800 to-indigo-950',
        cardTheme: isDay ? 'bg-sky-50/80 border-sky-200' : 'bg-slate-900/60 border-slate-700/50',
        textColor: isDay ? 'text-sky-950' : 'text-slate-100',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Scattered clouds with intermittent sunshine',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        bgGradient: 'from-sky-400 via-slate-400 to-indigo-500',
        cardTheme: 'bg-sky-50/80 border-sky-200/80',
        textColor: 'text-slate-900',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Dense cloud cover blocking direct sunlight',
        iconName: 'Cloud',
        bgGradient: 'from-slate-400 via-slate-500 to-zinc-600',
        cardTheme: 'bg-slate-100/90 border-slate-300',
        textColor: 'text-slate-900',
      };
    case 45:
    case 48:
      return {
        code,
        label: 'Foggy',
        description: code === 48 ? 'Depositing rime fog with low visibility' : 'Low visibility fog',
        iconName: 'CloudFog',
        bgGradient: 'from-slate-300 via-slate-400 to-slate-600',
        cardTheme: 'bg-slate-100/90 border-slate-300',
        textColor: 'text-slate-900',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: 'Drizzle',
        description: code === 55 ? 'Heavy dense drizzle' : 'Light mist and soft drizzle',
        iconName: 'CloudDrizzle',
        bgGradient: 'from-blue-400 via-slate-500 to-sky-600',
        cardTheme: 'bg-blue-50/80 border-blue-200',
        textColor: 'text-blue-950',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Icy drizzle with potential road freezing',
        iconName: 'CloudSnow',
        bgGradient: 'from-cyan-400 via-blue-600 to-slate-700',
        cardTheme: 'bg-cyan-50/80 border-cyan-200',
        textColor: 'text-cyan-950',
      };
    case 61:
    case 63:
    case 65:
      return {
        code,
        label: code === 65 ? 'Heavy Rain' : code === 63 ? 'Moderate Rain' : 'Light Rain',
        description: 'Continuous rainfall',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-600 via-slate-700 to-indigo-900',
        cardTheme: 'bg-blue-950/20 border-blue-300/40',
        textColor: 'text-blue-950',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Rain freezing instantly upon surface contact',
        iconName: 'CloudSnow',
        bgGradient: 'from-sky-600 via-indigo-700 to-slate-900',
        cardTheme: 'bg-sky-100/90 border-sky-300',
        textColor: 'text-sky-950',
      };
    case 71:
    case 73:
    case 75:
      return {
        code,
        label: code === 75 ? 'Heavy Snowfall' : 'Snowfall',
        description: 'Falling snow and icy conditions',
        iconName: 'Snowflake',
        bgGradient: 'from-sky-200 via-blue-300 to-slate-400',
        cardTheme: 'bg-sky-50/90 border-sky-200',
        textColor: 'text-slate-900',
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        description: 'Fine frozen precipitation particles',
        iconName: 'Snowflake',
        bgGradient: 'from-slate-200 via-sky-300 to-indigo-300',
        cardTheme: 'bg-sky-50/90 border-sky-200',
        textColor: 'text-slate-900',
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: code === 82 ? 'Torrential Showers' : 'Rain Showers',
        description: 'Intermittent heavy rain bursts',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-500 via-indigo-600 to-slate-800',
        cardTheme: 'bg-blue-50/80 border-blue-200',
        textColor: 'text-blue-950',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        description: 'Periodic heavy snow showers',
        iconName: 'Snowflake',
        bgGradient: 'from-blue-200 via-indigo-300 to-slate-500',
        cardTheme: 'bg-blue-50/90 border-blue-200',
        textColor: 'text-blue-950',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Lightning activity with localized heavy gusts',
        iconName: 'CloudLightning',
        bgGradient: 'from-indigo-900 via-purple-950 to-slate-900',
        cardTheme: 'bg-purple-950/20 border-purple-300/40',
        textColor: 'text-purple-950',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Severe Thunderstorm & Hail',
        description: 'Severe storm with hail and intense lightning',
        iconName: 'CloudLightning',
        bgGradient: 'from-purple-900 via-slate-900 to-black',
        cardTheme: 'bg-purple-950/30 border-purple-400/50',
        textColor: 'text-purple-950',
      };
    default:
      return {
        code,
        label: 'Variable Conditions',
        description: 'Mixed atmospheric conditions',
        iconName: 'Cloud',
        bgGradient: 'from-sky-400 via-blue-500 to-indigo-600',
        cardTheme: 'bg-sky-50/80 border-sky-200',
        textColor: 'text-slate-900',
      };
  }
}

/** Unit Conversions */
export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function kmhToMph(kmh: number): number {
  return kmh * 0.621371;
}

export function formatTemp(c: number, unit: TemperatureUnit): string {
  if (isNaN(c)) return '--°';
  const val = unit === 'F' ? celsiusToFahrenheit(c) : c;
  return `${Math.round(val)}°${unit}`;
}

export function formatSpeed(kmh: number, unit: SpeedUnit): string {
  if (isNaN(kmh)) return '--';
  if (unit === 'mph') {
    return `${Math.round(kmhToMph(kmh))} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

/** Cardinal wind direction */
export function getWindDirectionLabel(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8;
  return directions[index];
}

/** Formats ISO string into day label */
export function formatDayLabel(isoString: string, isToday: boolean = false): string {
  if (isToday) return 'Today';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatShortDay(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatHourTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

/** Generate Weather Intelligence & Advice */
export function generateWeatherIntelligence(
  tempC: number,
  weatherCode: number,
  windKmh: number,
  humidity: number = 50,
  uvIndex: number = 3
): WeatherIntelligenceSummary {
  const cond = getWeatherConditionInfo(weatherCode);

  // Clothing advice
  let clothingAdvice = '';
  if (tempC < 5) {
    clothingAdvice = 'Wear a heavy insulated coat, thermal layers, scarf, and warm gloves.';
  } else if (tempC < 14) {
    clothingAdvice = 'A warm jacket, sweater, or fleece layer with trousers is recommended.';
  } else if (tempC < 22) {
    clothingAdvice = 'Comfortable mild weather: light jacket, hoodie, or long sleeves.';
  } else if (tempC < 29) {
    clothingAdvice = 'Warm and pleasant: breathable cotton T-shirt and shorts/light pants.';
  } else {
    clothingAdvice = 'Hot temperatures: lightweight, loose clothing, sunglasses, and sun protection.';
  }

  // Accessories / Rain
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(weatherCode)) {
    clothingAdvice += ' Carry a waterproof umbrella or raincoat.';
  }

  // Commute tip
  let commuteTip = 'Conditions are clear for safe commuting.';
  if (windKmh > 40) {
    commuteTip = 'High winds present: maintain extra steering control on highways.';
  } else if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    commuteTip = 'Wet roads: reduce speed and leave extra stopping distance.';
  } else if ([71, 73, 75, 77, 85, 86, 56, 57, 66, 67].includes(weatherCode)) {
    commuteTip = 'Icy or snowy roads: exercise high caution or delay non-essential travel.';
  } else if ([45, 48].includes(weatherCode)) {
    commuteTip = 'Foggy conditions: use low-beam headlights and keep safe spacing.';
  } else if ([95, 96, 99].includes(weatherCode)) {
    commuteTip = 'Thunderstorm active: seek shelter during intense rain and lightning.';
  }

  // Summary Text
  const summaryText = `${cond.label} with current temperature around ${Math.round(tempC)}°C and wind speed at ${Math.round(windKmh)} km/h. ${cond.description}.`;

  // Activity insights calculations
  const activities: ActivityInsight[] = [];

  // 1. Running / Jogging
  let runScore = 90;
  if (tempC < 0 || tempC > 30) runScore -= 30;
  if (windKmh > 25) runScore -= 20;
  if ([61, 63, 65, 80, 81, 82, 95].includes(weatherCode)) runScore -= 40;
  if ([71, 73, 75].includes(weatherCode)) runScore -= 35;
  runScore = Math.max(10, Math.min(100, runScore));

  activities.push({
    name: 'Running & Jogging',
    score: runScore,
    rating: runScore >= 80 ? 'Excellent' : runScore >= 60 ? 'Good' : runScore >= 40 ? 'Fair' : 'Poor',
    icon: 'Activity',
    advice: runScore >= 75 ? 'Optimal cool temperature for cardio.' : 'Consider indoor treadmill or lighter workout.',
  });

  // 2. Cycling / Outdoor Sports
  let cycleScore = 85;
  if (windKmh > 30) cycleScore -= 40;
  if ([61, 63, 65, 80, 81, 82, 95].includes(weatherCode)) cycleScore -= 50;
  if (tempC < 5 || tempC > 33) cycleScore -= 25;
  cycleScore = Math.max(10, Math.min(100, cycleScore));

  activities.push({
    name: 'Cycling & Biking',
    score: cycleScore,
    rating: cycleScore >= 80 ? 'Excellent' : cycleScore >= 60 ? 'Good' : cycleScore >= 40 ? 'Fair' : 'Poor',
    icon: 'Bike',
    advice: windKmh > 25 ? 'Strong headwinds expected.' : cycleScore >= 75 ? 'Smooth cycling conditions.' : 'Slippery paths possible.',
  });

  // 3. Stargazing / Night Astronomy
  let starScore = 90;
  if ([2, 3].includes(weatherCode)) starScore -= 50;
  if ([45, 48, 51, 61, 80, 95].includes(weatherCode)) starScore -= 80;
  starScore = Math.max(10, Math.min(100, starScore));

  activities.push({
    name: 'Stargazing',
    score: starScore,
    rating: starScore >= 80 ? 'Excellent' : starScore >= 60 ? 'Good' : starScore >= 40 ? 'Fair' : 'Poor',
    icon: 'Sparkles',
    advice: starScore >= 75 ? 'Clear night sky conditions ahead.' : 'Cloud cover may obscure astronomical view.',
  });

  // 4. Outdoor Dining & Walks
  let diningScore = 88;
  if (tempC < 15 || tempC > 30) diningScore -= 25;
  if ([51, 61, 63, 65, 80, 95].includes(weatherCode)) diningScore -= 60;
  if (windKmh > 25) diningScore -= 20;
  diningScore = Math.max(10, Math.min(100, diningScore));

  activities.push({
    name: 'Outdoor Dining',
    score: diningScore,
    rating: diningScore >= 80 ? 'Excellent' : diningScore >= 60 ? 'Good' : diningScore >= 40 ? 'Fair' : 'Poor',
    icon: 'Utensils',
    advice: diningScore >= 75 ? 'Delightful patio dining weather.' : 'Prefer cozy indoor seating.',
  });

  return {
    summaryText,
    clothingAdvice,
    commuteTip,
    activities,
  };
}
