export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  time: string;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  humidity: number[];
  precipitation: number[];
  precipitationProbability: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast;
  timezone: string;
}

const WEATHER_CODE_MAP: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear sky", icon: "sun" },
  1: { label: "Mainly clear", icon: "sun" },
  2: { label: "Partly cloudy", icon: "cloud-sun" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Fog", icon: "fog" },
  48: { label: "Depositing rime fog", icon: "fog" },
  51: { label: "Light drizzle", icon: "cloud-drizzle" },
  53: { label: "Moderate drizzle", icon: "cloud-drizzle" },
  55: { label: "Dense drizzle", icon: "cloud-drizzle" },
  56: { label: "Light freezing drizzle", icon: "cloud-drizzle" },
  57: { label: "Dense freezing drizzle", icon: "cloud-drizzle" },
  61: { label: "Slight rain", icon: "cloud-rain" },
  63: { label: "Moderate rain", icon: "cloud-rain" },
  65: { label: "Heavy rain", icon: "cloud-rain" },
  66: { label: "Light freezing rain", icon: "cloud-rain" },
  67: { label: "Heavy freezing rain", icon: "cloud-rain" },
  71: { label: "Slight snow fall", icon: "cloud-snow" },
  73: { label: "Moderate snow fall", icon: "cloud-snow" },
  75: { label: "Heavy snow fall", icon: "cloud-snow" },
  77: { label: "Snow grains", icon: "cloud-snow" },
  80: { label: "Slight rain showers", icon: "cloud-rain" },
  81: { label: "Moderate rain showers", icon: "cloud-rain" },
  82: { label: "Violent rain showers", icon: "cloud-rain" },
  85: { label: "Slight snow showers", icon: "cloud-snow" },
  86: { label: "Heavy snow showers", icon: "cloud-snow" },
  95: { label: "Thunderstorm", icon: "cloud-lightning" },
  96: { label: "Thunderstorm with slight hail", icon: "cloud-lightning" },
  99: { label: "Thunderstorm with heavy hail", icon: "cloud-lightning" },
};

export function getWeatherInfo(code: number): { label: string; icon: string } {
  return WEATHER_CODE_MAP[code] ?? { label: "Unknown", icon: "cloud" };
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "sunrise",
      "sunset",
      "uv_index_max",
    ].join(","),
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation",
      "precipitation_probability",
    ].join(","),
    timezone: "auto",
    forecast_days: "7",
    forecast_hours: "24",
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`);
  }
  const data = await res.json();

  const nowIdx = data.hourly.time.findIndex(
    (t: string) => new Date(t).getHours() === new Date().getHours()
  );
  const startIdx = nowIdx >= 0 ? nowIdx : 0;
  const slice = (arr: number[]) => arr.slice(startIdx, startIdx + 24);

  return {
    timezone: data.timezone,
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
      time: data.current.time,
    },
    daily: data.daily.time.map((date: string, i: number) => ({
      date,
      weatherCode: data.daily.weather_code[i],
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      precipitation: data.daily.precipitation_sum[i],
      precipitationProbability: data.daily.precipitation_probability_max[i],
      windSpeedMax: data.daily.wind_speed_10m_max[i],
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
      uvIndexMax: data.daily.uv_index_max[i],
    })),
    hourly: {
      time: data.hourly.time.slice(startIdx, startIdx + 24),
      temperature: slice(data.hourly.temperature_2m),
      humidity: slice(data.hourly.relative_humidity_2m),
      precipitation: slice(data.hourly.precipitation),
      precipitationProbability: slice(data.hourly.precipitation_probability),
    },
  };
}

export async function geocodeLocation(query: string): Promise<{ latitude: number; longitude: number; name: string; country: string }[]> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r: { latitude: number; longitude: number; name: string; country: string }) => ({
    latitude: r.latitude,
    longitude: r.longitude,
    name: r.name,
    country: r.country,
  }));
}
