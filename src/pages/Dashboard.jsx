import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  CloudSun,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Droplets,
  Wind,
  MapPin,
  Clock,
  Sparkles,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getWeather, DEFAULT_LOCATION, getCurrentUserCoordinates } from "../services/weather";
import { fieldMemoryDemo } from "../data/mockData";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Dashboard() {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [locationName, setLocationName] = useState("Dharwad, Karnataka");
  const [recentActivities, setRecentActivities] = useState(fieldMemoryDemo);
  const [isLiveLocation, setIsLiveLocation] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      // 1. Fetch Weather
      try {
        try {
          const coords = await getCurrentUserCoordinates();
          const data = await getWeather(coords.lat, coords.lon);
          setWeatherData(data);
          setLocationName("Your Live Location");
          setIsLiveLocation(true);
        } catch (geoErr) {
          const data = await getWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
          setWeatherData(data);
          setLocationName(DEFAULT_LOCATION.name);
          setIsLiveLocation(false);
        }
      } catch (err) {
        console.warn("Dashboard weather fetch fallback:", err);
      } finally {
        setWeatherLoading(false);
      }

      // 2. Fetch Recent Activities from Firestore if available
      try {
        const q = query(collection(db, "fieldMemory"), orderBy("timestamp", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecentActivities(items);
        }
      } catch (dbErr) {
        console.warn("Firestore activity query fallback to demo data:", dbErr);
      }
    }

    loadInitialData();
  }, []);

  const quickActions = [
    {
      title: "Check Crop",
      subtitle: "AI leaf stress & pest diagnosis",
      icon: Leaf,
      to: "/crop-health",
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Weather",
      subtitle: "7-day & hourly Open-Meteo forecast",
      icon: CloudSun,
      to: "/weather",
      color: "from-sky-500 to-blue-600",
      textColor: "text-sky-600 dark:text-sky-400"
    },
    {
      title: "Context Passport",
      subtitle: "Cross-border assertion check",
      icon: ShieldCheck,
      to: "/passport",
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      title: "Field Memory",
      subtitle: "Historical field logs & timeline",
      icon: BookOpen,
      to: "/field-memory",
      color: "from-indigo-500 to-purple-600",
      textColor: "text-indigo-600 dark:text-indigo-400"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BRICS Agriculture AI Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, <span className="text-brand-600 dark:text-brand-400">{user?.email?.split("@")[0] || "Farmer"}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time weather, crop disease analysis & cross-border knowledge validation.
          </p>
        </div>

        {/* Demo Mode Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Demo Mode Enabled
          </span>
        </div>
      </div>

      {/* Live Weather Card */}
      <Card glass className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-teal-950 to-slate-900 text-white border-brand-800/50 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{locationName}</span>
              {isLiveLocation ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px]">
                  Live GPS
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 text-[10px]">
                  Fallback Coords
                </span>
              )}
            </div>

            {weatherLoading ? (
              <div className="space-y-2 py-4">
                <div className="h-10 w-32 bg-white/10 rounded-xl animate-pulse" />
                <div className="h-4 w-48 bg-white/10 rounded-lg animate-pulse" />
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black tracking-tight">{weatherData?.current?.temp}°C</span>
                  <span className="text-lg font-medium text-emerald-200">{weatherData?.current?.info?.label}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Feels like {weatherData?.current?.apparentTemp}°C • Precipitation: {weatherData?.current?.precipitation} mm
                </p>
              </div>
            )}
          </div>

          {!weatherLoading && weatherData && (
            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                  <Droplets className="w-6 h-6 text-sky-300" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Humidity</p>
                  <p className="text-base font-bold text-white">{weatherData.current.humidity}%</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                  <Wind className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Wind Speed</p>
                  <p className="text-base font-bold text-white">{weatherData.current.windSpeed} km/h</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live data from Open-Meteo
          </span>
          <Link to="/weather" className="text-white hover:underline flex items-center gap-1 font-medium">
            Full Forecast <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>

      {/* Quick Action Grid (2x2 Mobile, 4-col Desktop) */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to} className="group">
              <Card hover glass className="h-full flex flex-col justify-between p-4 md:p-5 group-hover:border-brand-500/40">
                <div>
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {action.subtitle}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Field Activity</h2>
          <Link to="/field-memory" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            View History <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Card glass className="p-0 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
          {recentActivities.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No entries yet. Start by checking your crop.
            </div>
          ) : (
            recentActivities.map((act) => (
              <div key={act.id} className="p-4 flex items-start gap-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="p-2.5 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 mt-0.5 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {act.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {new Date(act.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                    {act.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                      {act.tag || "Observation"}
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200/50 dark:border-amber-800/50">
                      Demo Mode
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
