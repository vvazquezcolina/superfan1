// src/components/layout/weather-display.tsx
"use client";

import { useState, useEffect } from 'react';
import { Sun, Cloud, Zap, Snowflake, Umbrella, ThermometerSun, ThermometerSnowflake } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext'; // For potential localization

// Placeholder for actual API call
const fetchWeatherData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // !! IMPORTANT !!
  // Replace this with your actual weather API call
  // Example using OpenWeatherMap:
  // const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
  // const lat = 21.1619; // Cancun latitude
  // const lon = -86.8515; // Cancun longitude
  // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
  // if (!response.ok) {
  //   console.error('Failed to fetch weather data', response);
  //   throw new Error('Failed to fetch weather data');
  // }
  // const data = await response.json();
  // return {
  //   temperature: Math.round(data.main.temp),
  //   condition: data.weather[0].main.toLowerCase(), // e.g., 'clear', 'clouds', 'rain'
  //   icon: data.weather[0].icon, // API specific icon code like '01d', '10n'
  // };

  // Placeholder data:
  return {
    temperature: 28,
    condition: 'clear', // Example conditions: 'clear', 'clouds', 'rain', 'thunderstorm', 'snow'
    icon: '01d', // Example OpenWeatherMap icon code for clear sky day
  };
};

const WeatherIcon = ({ condition, iconCode }: { condition: string; iconCode?: string }) => {
  // Mapping OpenWeatherMap icon codes or general conditions to Lucide icons
  // For a more robust solution, consider a dedicated mapping function or library
  if (iconCode) {
    if (iconCode.startsWith('01')) return <Sun className="w-4 h-4 sm:w-5 sm:h-5" />; // Clear
    if (iconCode.startsWith('02') || iconCode.startsWith('03') || iconCode.startsWith('04')) return <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />; // Clouds
    if (iconCode.startsWith('09') || iconCode.startsWith('10')) return <Umbrella className="w-4 h-4 sm:w-5 sm:h-5" />; // Rain
    if (iconCode.startsWith('11')) return <Zap className="w-4 h-4 sm:w-5 sm:h-5" />; // Thunderstorm
    if (iconCode.startsWith('13')) return <Snowflake className="w-4 h-4 sm:w-5 sm:h-5" />; // Snow
    if (iconCode.startsWith('50')) return <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />; // Mist/Fog (using Cloud as generic)
  }

  // Fallback based on condition string if iconCode is not specific enough
  switch (condition.toLowerCase()) {
    case 'clear':
      return <Sun className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 'clouds':
      return <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 'rain':
    case 'drizzle':
      return <Umbrella className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 'thunderstorm':
      return <Zap className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 'snow':
      return <Snowflake className="w-4 h-4 sm:w-5 sm:h-5" />;
    case 'mist':
    case 'fog':
    case 'haze':
      return <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />; // Using Cloud as generic
    default:
      return <ThermometerSun className="w-4 h-4 sm:w-5 sm:h-5" />; // Default icon
  }
};

interface WeatherDisplayProps {
  classNameCn?: string;
}

export default function WeatherDisplay({ classNameCn }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<{ temperature: number; condition: string; icon?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage(); // For potential future localization of units or text

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWeatherData();
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching weather');
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (loading) {
    return (
      <div className={cn("flex items-center space-x-1", classNameCn)}>
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-8" />
      </div>
    );
  }

  if (error || !weather) {
    // Do not display anything if there's an error or no weather data
    // This prevents showing a broken UI element
    // You could optionally return a small error icon or message here
    return null;
  }

  return (
    <div className={cn("flex items-center space-x-1 cursor-default", classNameCn)} title={`${weather.temperature}°C, ${weather.condition}`}>
      <WeatherIcon condition={weather.condition} iconCode={weather.icon} />
      <span>{weather.temperature}°C</span>
    </div>
  );
}
