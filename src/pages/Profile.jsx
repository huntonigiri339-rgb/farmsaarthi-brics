import React, { useState } from "react";
import {
  User,
  Mail,
  MapPin,
  Moon,
  LogOut,
  Info,
  Check,
  Shield,
  Sliders
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../components/Toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [locationName, setLocationName] = useState("Dharwad, Karnataka, India");
  const [lat, setLat] = useState("15.3647");
  const [lon, setLon] = useState("75.1240");
  const [savingLocation, setSavingLocation] = useState(false);

  const handleSaveLocation = (e) => {
    e.preventDefault();
    setSavingLocation(true);
    setTimeout(() => {
      setSavingLocation(false);
      showToast("Default field location updated!", "success");
    }, 600);
  };

  const handleSignOut = async () => {
    await signOut();
    showToast("Signed out successfully", "info");
    navigate("/login");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          User Settings & Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account credentials, default field coordinates, and app theme preferences.
        </p>
      </div>

      {/* Profile Card */}
      <Card glass className="p-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
            {(user?.email || "U")[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {user?.displayName || user?.email?.split("@")[0] || "Farmer Account"}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user?.email}</span>
            </div>
            {user?.isDemo && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                Demo User Session
              </span>
            )}
          </div>
        </div>

        <div className="py-6 space-y-6">
          {/* Theme Preference Setting */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Theme Mode
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current active mode: <span className="font-bold uppercase text-brand-600 dark:text-brand-400">{theme}</span>
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Default Location Form */}
          <form onSubmit={handleSaveLocation} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-500" />
              Default Field Location Settings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Used when browser geolocation is disabled or unavailable.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Region Name</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Latitude</label>
                <input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Longitude</label>
                <input
                  type="text"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" variant="secondary" size="sm" loading={savingLocation} icon={Check}>
                Save Location
              </Button>
            </div>
          </form>
        </div>

        {/* Sign Out Action */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">Session Control</span>
          <Button variant="danger" size="md" icon={LogOut} onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </Card>

      {/* App Version Info */}
      <Card glass className="p-5 text-center text-xs text-slate-400 space-y-1">
        <p className="font-bold text-slate-700 dark:text-slate-300">FarmSaarthi v1.0.0 (Production Release)</p>
        <p>BRICS Agronomic Intelligence Platform • MIT License</p>
        <p className="text-[10px] text-slate-400 pt-1">Designed with iOS Glassmorphism UX Guidelines</p>
      </Card>
    </div>
  );
}
