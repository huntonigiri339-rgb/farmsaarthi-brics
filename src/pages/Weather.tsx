import { useEffect, useState, FormEvent } from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  MapPin,
  Search,
  Loader2,
  Sunrise,
  Sunset,
  Navigation,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getWeather, getWeatherInfo, geocodeLocation, WeatherData } from "../services/weather";
import { LiveBadge, DemoBadge, PageHeader } from "../components/Badges";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.209;

export default function Weather() {
  const { user } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ latitude: number; longitude: number; name: string; country: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [locationName, setLocationName] = useState("New Delhi, India");
  const [coords, setCoords] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON });
  const [showResults, setShowResults] = useState(false);

  const fetchWeather = async (lat: number, lon: number, name: string) => {
    setLoading(true);
    setError(false);
    try {
      const w = await getWeather(lat, lon);
      setWeather(w);
      setLocationName(name);
      setCoords({ lat, lon });
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const { data: prof } = await supabase
        .from("user_profiles")
        .select("field_latitude, field_longitude, field_location_name")
        .eq("id", user?.id)
        .maybeSingle();

      if (prof?.field_latitude && prof?.field_longitude) {
        fetchWeather(prof.field_latitude, prof.field_longitude, prof.field_location_name || "Your Field");
      } else {
        fetchWeather(DEFAULT_LAT, DEFAULT_LON, "New Delhi, India");
      }
    })();
  }, [user?.id]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await geocodeLocation(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  const useGeolocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude, "Current Location");
      },
      () => {
        setLoading(false);
      }
    );
  };

  const hourlyData = weather
    ? weather.hourly.time.map((t, i) => ({
        time: new Date(t).toLocaleTimeString("en", { hour: "numeric" }),
        temp: weather.hourly.temperature[i],
        humidity: weather.hourly.humidity[i],
        precipitation: weather.hourly.precipitation[i],
        precipProb: weather.hourly.precipitationProbability[i],
      }))
    : [];

  const currentInfo = weather ? getWeatherInfo(weather.current.weatherCode) : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Weather" subtitle="Live 7-day forecast and hourly data from Open-Meteo">
        {weather && !error ? <LiveBadge /> : error ? <DemoBadge text="Unavailable" /> : null}
      </PageHeader>

      {/* Location Search */}
      <div className="ios-card p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(false)}
              placeholder="Search city or location…"
              className="ios-input pl-11"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="ios-button bg-sky-500 px-4 text-white hover:bg-sky-600"
          >
            {searching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={useGeolocation}
            className="ios-button border border-gray-200 bg-white px-4 text-gray-600 hover:bg-gray-50"
          >
            <Navigation className="h-5 w-5" />
          </button>
        </form>

        {showResults && searchResults.length > 0 && (
          <div className="mt-2 space-y-1">
            {searchResults.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  fetchWeather(r.latitude, r.longitude, `${r.name}, ${r.country}`);
                  setShowResults(false);
                  setSearchQuery("");
                }}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm text-gray-700 transition-all hover:bg-gray-50"
              >
                <MapPin className="h-4 w-4 text-gray-400" />
                {r.name}, {r.country}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 py-16">
          <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
          <p className="text-sm text-gray-500">Loading live weather data…</p>
        </div>
      ) : error ? (
        <div className="ios-card flex flex-col items-center py-16 text-gray-400">
          <CloudSun className="h-10 w-10 mb-2" />
          <p className="text-sm">Weather data unavailable. Please try again.</p>
        </div>
      ) : weather && currentInfo ? (
        <>
          {/* Current Weather Hero */}
          <div className="glass-card overflow-hidden p-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <MapPin className="h-4 w-4" />
              {locationName}
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-6xl font-bold text-gray-900">{Math.round(weather.current.temperature)}°</span>
                <span className="mt-1 text-lg text-gray-600">{currentInfo.label}</span>
                <span className="mt-1 text-sm text-gray-400">Feels like {Math.round(weather.current.apparentTemperature)}°C</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-0">
                <div className="flex items-center gap-2 rounded-2xl bg-sky-50 px-4 py-3">
                  <Droplets className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{weather.current.humidity}%</p>
                    <p className="text-[11px] text-gray-500">Humidity</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-4 py-3">
                  <Wind className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{Math.round(weather.current.windSpeed)}</p>
                    <p className="text-[11px] text-gray-500">km/h wind</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3">
                  <Thermometer className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{weather.current.precipitation}</p>
                    <p className="text-[11px] text-gray-500">mm rain</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-purple-50 px-4 py-3">
                  <CloudSun className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{weather.timezone.split("/").pop()}</p>
                    <p className="text-[11px] text-gray-500">Timezone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="ios-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">7-Day Forecast</h3>
            <div className="space-y-2">
              {weather.daily.map((day, i) => {
                const info = getWeatherInfo(day.weatherCode);
                return (
                  <div
                    key={day.date}
                    className="flex items-center gap-4 rounded-2xl px-3 py-3 transition-all hover:bg-gray-50"
                  >
                    <span className="w-12 text-sm font-medium text-gray-600">
                      {i === 0 ? "Today" : new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                    </span>
                    <span className="text-2xl">
                      {info.icon === "sun" ? "☀️" : info.icon === "cloud-sun" ? "⛅" : info.icon === "cloud" ? "☁️" : info.icon === "cloud-rain" ? "🌧️" : info.icon === "cloud-snow" ? "🌨️" : info.icon === "cloud-lightning" ? "⛈️" : "🌫️"}
                    </span>
                    <span className="hidden flex-1 text-xs text-gray-500 sm:block">{info.label}</span>
                    <div className="flex items-center gap-1 text-xs text-sky-600">
                      <Droplets className="h-3 w-3" />
                      {day.precipitationProbability}%
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">{Math.round(day.tempMin)}°</span>
                      <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-sky-300 to-amber-400" />
                      <span className="text-sm font-semibold text-gray-900">{Math.round(day.tempMax)}°</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sun & UV info for today */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center rounded-2xl bg-amber-50 py-3">
                <Sunrise className="h-5 w-5 text-amber-600" />
                <span className="mt-1 text-sm font-semibold text-gray-900">
                  {new Date(weather.daily[0].sunrise).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="text-[11px] text-gray-500">Sunrise</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-orange-50 py-3">
                <Sunset className="h-5 w-5 text-orange-600" />
                <span className="mt-1 text-sm font-semibold text-gray-900">
                  {new Date(weather.daily[0].sunset).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="text-[11px] text-gray-500">Sunset</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-red-50 py-3">
                <span className="text-sm font-bold text-red-600">UV {weather.daily[0].uvIndexMax}</span>
                <span className="mt-0.5 text-[11px] text-gray-500">UV Index</span>
              </div>
            </div>
          </div>

          {/* Hourly Temperature Chart */}
          <div className="ios-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Hourly Temperature (24h)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#999" }} interval={2} />
                <YAxis tick={{ fontSize: 11, fill: "#999" }} unit="°" />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(v: number) => [`${v}°C`, "Temperature"]}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#0ea5e9" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Precipitation Chart */}
          <div className="ios-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Hourly Precipitation (24h)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#999" }} interval={2} />
                <YAxis tick={{ fontSize: 11, fill: "#999" }} unit="mm" />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(v: number) => [`${v} mm`, "Precipitation"]}
                />
                <Bar dataKey="precipitation" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Humidity Chart */}
          <div className="ios-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Hourly Humidity (24h)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#999" }} interval={2} />
                <YAxis tick={{ fontSize: 11, fill: "#999" }} unit="%" />
                <Tooltip
                  contentStyle={{ borderRadius: 16, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(v: number) => [`${v}%`, "Humidity"]}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#22c55e" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : null}
    </div>
  );
}
