import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
  Wind,
} from 'lucide-react';

interface WeatherIconProps {
  iconName: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ iconName, className = 'w-6 h-6' }) => {
  switch (iconName) {
    case 'Sun':
      return <Sun className={className} />;
    case 'Moon':
      return <Moon className={className} />;
    case 'CloudSun':
      return <CloudSun className={className} />;
    case 'CloudMoon':
      return <CloudMoon className={className} />;
    case 'Cloud':
      return <Cloud className={className} />;
    case 'CloudFog':
      return <CloudFog className={className} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} />;
    case 'CloudRain':
      return <CloudRain className={className} />;
    case 'CloudSnow':
      return <CloudSnow className={className} />;
    case 'CloudLightning':
      return <CloudLightning className={className} />;
    case 'Snowflake':
      return <Snowflake className={className} />;
    case 'Wind':
    default:
      return <Wind className={className} />;
  }
};
