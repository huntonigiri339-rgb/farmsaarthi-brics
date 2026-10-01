import React, { useEffect, useState } from "react";
import {
  CloudSun,
  MapPin,
  RefreshCw,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  Loader2,
  Navigation
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import Card from "../components/Card";
import Button from "../components/Button";
import { useToast } from "../components/Toast";
import { getWeather, DEFAULT_LOCATION, getCurrentUserCoordinates } from "../services/weather";

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Dharwad, Karnataka");
  const [isLiveGps, setIsLiveGps] = useState(false);
  const { showToast } = useToast();

  const fetchWeatherData = async (lat, lon, name = null) => {
    setLoading(true);
    try {
      const data = await getWeather(lat, lon);
      setWeatherData(data);
      if (name) {
        setLocationName(name);
      }
    } catch (err) {
      showToast(`Weather error: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = async () => {
    try {
      showToast("Fetching real-time GPS location...", "info");
      const coords = await getCurrentUserCoordinates();
      setIsLiveGps(true);
      await fetchWeatherData(coords.lat, coords.lon, "Current GPS Location");
      showToast("Weather updated for your live location!", "success");
    } catch (err) {
      setIsLiveGps(false);
      showToast("Location access denied. Showing weather for Dharwad, Karnataka.", "amber");
      await fetchWeatherData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.name);
    }
  };

  useEffect(() => {
    handleUseLocation();
  }, []);

  const chartData = weatherData?.hourly?.times?.map((time, idx) => ({
    time,
    temp: weatherData.hourly.temperatures[idx],
    humidity: weatherData.hourly.humidities[idx]
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header & Location Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
            <CloudSun className="w-3.5 h-3.5" />
            <span>Open-Meteo High Resolution Forecast</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Weather Intelligence
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hyperlocal meteorological metrics tailored for irrigation and spray planning.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            icon={Navigation}
            onClick={handleUseLocation}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-sky-500/25"
          >
            Use My Location
          </Button>

          <Button
            variant="secondary"
            icon={RefreshCw}
            loading={loading}
            onClick={() => weatherData && fetchWeatherData(weatherData.latitude, weatherData.longitude)}
            title="Refresh weather data"
          />
        </div>
      </div>

      {loading ? (
        <Card glass className="p-12 text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-sky-500 mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Fetching latest satellite and weather metrics...
          </p>
        </Card>
      ) : (
        <>
          {/* Current Weather Hero Card */}
          <Card glass className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-900 text-white shadow-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-200 mb-2">
                  <MapPin className="w-4 h-4 text-sky-300" />
                  <span>{locationName}</span>
                  {isLiveGps && (
                    <span className="px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-100 text-[10px] font-bold">
                      GPS Active
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-4 mt-2">
                  <span className="text-6xl md:text-7xl font-black tracking-tight">
                    {weatherData?.current?.temp}°C
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-sky-100">
                      {weatherData?.current?.info?.label}
                    </h3>
                    <p className="text-xs text-sky-200/90 mt-0.5">
                      Feels like {weatherData?.current?.apparentTemp}°C
                    </p>
                  </div>
                </div>
              </div>

              {/* Weather Stats Cards inside Hero */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 border-t md:border-t-0 md:border-l border-white/15 pt-4 md:pt-0 md:pl-8">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md text-center">
                  <Droplets className="w-5 h-5 mx-auto text-sky-300 mb-1" />
                  <span className="text-xs text-sky-200 block">Humidity</span>
                  <span className="text-base font-bold text-white">{weatherData?.current?.humidity}%</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md text-center">
                  <Wind className="w-5 h-5 mx-auto text-sky-300 mb-1" />
                  <span className="text-xs text-sky-200 block">Wind Speed</span>
                  <span className="text-base font-bold text-white">{weatherData?.current?.windSpeed} km/h</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md text-center">
                  <CloudRain className="w-5 h-5 mx-auto text-sky-300 mb-1" />
                  <span className="text-xs text-sky-200 block">Precipitation</span>
                  <span className="text-base font-bold text-white">{weatherData?.current?.precipitation} mm</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-white/15 text-xs text-sky-200 flex items-center justify-between">
              <span>Live data from Open-Meteo</span>
              <span>Timezone: {weatherData?.timezone}</span>
            </div>
          </Card>

          {/* 7-Day Forecast */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">7-Day Forecast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weatherData?.daily?.map((day, idx) => (
                <Card key={idx} glass hover className="p-3.5 text-center flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {idx === 0 ? "Today" : day.dayName}
                  </span>
                  <span className="text-[10px] text-slate-400 block mb-2">{day.date}</span>

                  <div className="my-2">
                    <Sun className="w-7 h-7 mx-auto text-amber-500 dark:text-amber-400 mb-1" />
                    <span className="text-xs text-slate-600 dark:text-slate-300 block line-clamp-1">
                      {day.info.label}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <span className="text-slate-900 dark:text-white">{day.tempMax}°</span>
                    <span className="text-slate-400 font-normal">{day.tempMin}°</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Hourly Temperature & Humidity Chart (Recharts) */}
          <Card glass className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">24-Hour Trend</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Hourly Temperature & Relative Humidity progression</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-sky-500" />
                  <span className="text-slate-700 dark:text-slate-300">Temp (°C)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-300">Humidity (%)</span>
                </div>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "16px",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                  />
                  <Area type="monotone" dataKey="temp" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" />
                  <Area type="monotone" dataKey="humidity" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#humidityGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
