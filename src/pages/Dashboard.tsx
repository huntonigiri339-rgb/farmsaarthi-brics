import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CloudSun,
  Leaf,
  TrendingUp,
  BookOpen,
  Droplets,
  Wind,
  Thermometer,
  Eye,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { getWeather, getWeatherInfo, WeatherData } from "../services/weather";
import { LiveBadge, DemoBadge } from "../components/Badges";

const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.209;

interface ActivityItem {
  id: string;
  event_type: string;
  title: string;
  description: string;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [profile, setProfile] = useState<{ display_name: string; field_location_name: string } | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    (async () => {
      const { data: prof } = await supabase
        .from("user_profiles")
        .select("display_name, field_location_name, field_latitude, field_longitude")
        .eq("id", user?.id)
        .maybeSingle();

      if (prof) {
        setProfile(prof);
        const lat = prof.field_latitude ?? DEFAULT_LAT;
        const lon = prof.field_longitude ?? DEFAULT_LON;
        try {
          const w = await getWeather(lat, lon);
          setWeather(w);
        } catch {
          setWeatherError(true);
        }
      } else {
        try {
          const w = await getWeather(DEFAULT_LAT, DEFAULT_LON);
          setWeather(w);
        } catch {
          setWeatherError(true);
        }
      }

      const { data: acts } = await supabase
        .from("field_memory")
        .select("id, event_type, title, description, created_at")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setActivities(acts ?? []);
    })();
  }, [user?.id]);

  const greetingName = profile?.display_name || user?.email?.split("@")[0] || "Farmer";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const quickActions = [
    { label: "Check Crop", icon: Leaf, path: "/crop-health", color: "from-brand-500 to-brand-600" },
    { label: "View Weather", icon: CloudSun, path: "/weather", color: "from-sky-500 to-sky-600" },
    { label: "Market Prices", icon: TrendingUp, path: "/market", color: "from-amber-500 to-amber-600" },
    { label: "Field Memory", icon: BookOpen, path: "/field-memory", color: "from-purple-500 to-purple-600" },
  ];

  const currentWeather = weather ? getWeatherInfo(weather.current.weatherCode) : null;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="animate-slide-up">
        <p className="text-sm text-gray-500">{greeting},</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">{greetingName}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {profile?.field_location_name ? `Field location: ${profile.field_location_name}` : "Set your field location in Profile"}
        </p>
      </div>

      {/* Weather Card */}
      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "50ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Current Weather</h2>
          {weather ? <LiveBadge /> : weatherError ? <DemoBadge text="Unavailable" /> : null}
        </div>

        {weather && currentWeather ? (
          <div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-5xl font-bold text-gray-900">{Math.round(weather.current.temperature)}°</span>
                <span className="text-sm text-gray-500 mt-1">{currentWeather.label}</span>
                <span className="text-xs text-gray-400 mt-0.5">Feels like {Math.round(weather.current.apparentTemperature)}°</span>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center rounded-2xl bg-sky-50 py-3">
                  <Droplets className="h-5 w-5 text-sky-600" />
                  <span className="mt-1 text-lg font-semibold text-gray-900">{weather.current.humidity}%</span>
                  <span className="text-[11px] text-gray-500">Humidity</span>
                </div>
                <div className="flex flex-col items-center rounded-2xl bg-amber-50 py-3">
                  <Wind className="h-5 w-5 text-amber-600" />
                  <span className="mt-1 text-lg font-semibold text-gray-900">{Math.round(weather.current.windSpeed)}</span>
                  <span className="text-[11px] text-gray-500">km/h</span>
                </div>
                <div className="flex flex-col items-center rounded-2xl bg-gray-50 py-3">
                  <CloudSun className="h-5 w-5 text-gray-600" />
                  <span className="mt-1 text-lg font-semibold text-gray-900">{weather.current.precipitation}</span>
                  <span className="text-[11px] text-gray-500">mm rain</span>
                </div>
              </div>
            </div>

            {/* 7-day mini forecast */}
            <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar">
              {weather.daily.map((day, i) => {
                const info = getWeatherInfo(day.weatherCode);
                return (
                  <div
                    key={day.date}
                    className="flex min-w-[68px] flex-col items-center rounded-2xl bg-white/60 px-2 py-3"
                  >
                    <span className="text-[11px] font-medium text-gray-500">
                      {i === 0 ? "Today" : new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                    </span>
                    <span className="my-1.5 text-2xl">{info.icon === "sun" ? "☀️" : info.icon === "cloud-sun" ? "⛅" : info.icon === "cloud" ? "☁️" : info.icon === "cloud-rain" ? "🌧️" : info.icon === "cloud-snow" ? "🌨️" : info.icon === "cloud-lightning" ? "⛈️" : "🌫️"}</span>
                    <span className="text-sm font-semibold text-gray-900">{Math.round(day.tempMax)}°</span>
                    <span className="text-xs text-gray-400">{Math.round(day.tempMin)}°</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : weatherError ? (
          <div className="flex flex-col items-center py-8 text-gray-400">
            <CloudSun className="h-10 w-10 mb-2" />
            <p className="text-sm">Weather data unavailable. Try again later.</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            <p className="text-sm text-gray-400">Loading live weather…</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="group ios-card flex flex-col items-start gap-3 p-4 text-left transition-all hover:shadow-md"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} shadow-md`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">{action.label}</span>
              <ArrowRight className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-500" />
            </div>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="ios-card p-6 animate-slide-up" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <button
            onClick={() => navigate("/field-memory")}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
          </button>
        </div>

        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm">
                  {act.event_type === "observation" && <Eye className="h-4 w-4 text-brand-600" />}
                  {act.event_type === "advisory" && <Leaf className="h-4 w-4 text-amber-600" />}
                  {act.event_type === "action" && <ArrowRight className="h-4 w-4 text-sky-600" />}
                  {act.event_type === "outcome" && <Calendar className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{act.title}</p>
                  <p className="text-xs text-gray-500 truncate">{act.description}</p>
                </div>
                <span className="text-[11px] text-gray-400 shrink-0">
                  {new Date(act.created_at).toLocaleDateString("en", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 text-gray-400">
            <BookOpen className="h-8 w-8 mb-2" />
            <p className="text-sm">No activity yet. Start by checking your crop or adding a field memory entry.</p>
          </div>
        )}
      </div>
    </div>
  );
}
