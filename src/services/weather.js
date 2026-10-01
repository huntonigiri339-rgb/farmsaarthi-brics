export const DEFAULT_LOCATION = {
  lat: 15.3647,
  lon: 75.124,
  name: "Dharwad, Karnataka, India"
};

export const WEATHER_CODES = {
  0: { label: "Clear Sky", icon: "Sun" },
  1: { label: "Mainly Clear", icon: "Sun" },
  2: { label: "Partly Cloudy", icon: "CloudSun" },
  3: { label: "Overcast", icon: "Cloud" },
  45: { label: "Fog", icon: "CloudFog" },
  48: { label: "Depositing Rime Fog", icon: "CloudFog" },
  51: { label: "Light Drizzle", icon: "CloudDrizzle" },
  53: { label: "Moderate Drizzle", icon: "CloudDrizzle" },
  55: { label: "Dense Drizzle", icon: "CloudDrizzle" },
  61: { label: "Slight Rain", icon: "CloudRain" },
  63: { label: "Moderate Rain", icon: "CloudRain" },
  65: { label: "Heavy Rain", icon: "CloudRain" },
  71: { label: "Slight Snow", icon: "Snowflake" },
  73: { label: "Moderate Snow", icon: "Snowflake" },
  75: { label: "Heavy Snow", icon: "Snowflake" },
  80: { label: "Rain Showers", icon: "CloudRain" },
  81: { label: "Moderate Rain Showers", icon: "CloudRain" },
  82: { label: "Violent Rain Showers", icon: "CloudRain" },
  95: { label: "Thunderstorm", icon: "CloudLightning" },
  96: { label: "Thunderstorm with Hail", icon: "CloudLightning" }
};

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { label: "Cloudy", icon: "Cloud" };
}

export async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather fetch failed: ${response.statusText}`);
  }

  const data = await response.json();

  const current = {
    temp: Math.round(data.current?.temperature_2m ?? 24),
    apparentTemp: Math.round(data.current?.apparent_temperature ?? 25),
    humidity: Math.round(data.current?.relative_humidity_2m ?? 65),
    windSpeed: Math.round(data.current?.wind_speed_10m ?? 12),
    precipitation: data.current?.precipitation ?? 0,
    weatherCode: data.current?.weather_code ?? 0,
    info: getWeatherInfo(data.current?.weather_code ?? 0)
  };

  const daily = (data.daily?.time || []).map((dateStr, idx) => ({
    date: dateStr,
    dayName: new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" }),
    tempMax: Math.round(data.daily.temperature_2m_max[idx]),
    tempMin: Math.round(data.daily.temperature_2m_min[idx]),
    precipitation: data.daily.precipitation_sum[idx],
    weatherCode: data.daily.weather_code[idx],
    info: getWeatherInfo(data.daily.weather_code[idx])
  }));

  const nowHour = new Date().getHours();
  const rawHourlyTime = data.hourly?.time || [];
  const startIdx = Math.max(0, rawHourlyTime.findIndex(t => new Date(t).getHours() === nowHour));
  const hourlySliceCount = 24;

  const hourly = {
    times: rawHourlyTime.slice(startIdx, startIdx + hourlySliceCount).map(t =>
      new Date(t).toLocaleTimeString("en-US", { hour: "numeric", hour12: true })
    ),
    temperatures: (data.hourly?.temperature_2m || []).slice(startIdx, startIdx + hourlySliceCount),
    humidities: (data.hourly?.relative_humidity_2m || []).slice(startIdx, startIdx + hourlySliceCount),
    precipitations: (data.hourly?.precipitation || []).slice(startIdx, startIdx + hourlySliceCount),
    windSpeeds: (data.hourly?.wind_speed_10m || []).slice(startIdx, startIdx + hourlySliceCount)
  };

  return {
    timezone: data.timezone,
    current,
    daily,
    hourly,
    latitude: lat,
    longitude: lon
  };
}

export function getCurrentUserCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported by browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          isRealLocation: true
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}
