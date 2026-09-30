import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  Mail,
  MapPin,
  LogOut,
  Navigation,
  Check,
  Loader2,
  Save,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { PageHeader } from "../components/Badges";

interface ProfileData {
  display_name: string;
  email: string;
  field_location_name: string;
  field_latitude: number | null;
  field_longitude: number | null;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    field_location_name: "",
    field_latitude: "",
    field_longitude: "",
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("user_profiles")
        .select("display_name, email, field_location_name, field_latitude, field_longitude")
        .eq("id", user?.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
        setForm({
          display_name: data.display_name ?? "",
          field_location_name: data.field_location_name ?? "",
          field_latitude: data.field_latitude?.toString() ?? "",
          field_longitude: data.field_longitude?.toString() ?? "",
        });
      }
      setLoading(false);
    })();
  }, [user?.id]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await supabase
      .from("user_profiles")
      .update({
        display_name: form.display_name,
        field_location_name: form.field_location_name,
        field_latitude: form.field_latitude ? parseFloat(form.field_latitude) : null,
        field_longitude: form.field_longitude ? parseFloat(form.field_longitude) : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user?.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const useGeolocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm({
        ...form,
        field_latitude: pos.coords.latitude.toFixed(4),
        field_longitude: pos.coords.longitude.toFixed(4),
      });
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
        <p className="text-sm text-gray-500">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="Manage your account and field settings" />

      {/* User Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white shadow-lg shadow-brand-500/30">
            {(profile?.email ?? user?.email ?? "U")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">{profile?.display_name || user?.email?.split("@")[0]}</h2>
            <p className="text-sm text-gray-500 truncate flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {profile?.email ?? user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Field Location Settings */}
      <div className="ios-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
            <MapPin className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Field Location</h3>
            <p className="text-xs text-gray-500">Used for weather forecasts and context matching</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Location Name</label>
            <input
              type="text"
              value={form.field_location_name}
              onChange={(e) => setForm({ ...form, field_location_name: e.target.value })}
              placeholder="e.g. My Farm, Pune, India"
              className="ios-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                step="any"
                value={form.field_latitude}
                onChange={(e) => setForm({ ...form, field_latitude: e.target.value })}
                placeholder="28.6139"
                className="ios-input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                step="any"
                value={form.field_longitude}
                onChange={(e) => setForm({ ...form, field_longitude: e.target.value })}
                placeholder="77.209"
                className="ios-input"
              />
            </div>
          </div>

          <button
            onClick={useGeolocation}
            className="ios-button w-full border border-sky-200 bg-sky-50 py-3 text-sky-700 hover:bg-sky-100"
          >
            <Navigation className="h-5 w-5" />
            Use My Current Location
          </button>
        </div>
      </div>

      {/* Display Name */}
      <div className="ios-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
            <UserIcon className="h-5 w-5 text-brand-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Display Name</h3>
        </div>
        <input
          type="text"
          value={form.display_name}
          onChange={(e) => setForm({ ...form, display_name: e.target.value })}
          placeholder="Your name"
          className="ios-input"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="ios-button w-full bg-gradient-to-r from-brand-500 to-brand-600 py-3.5 text-white shadow-lg shadow-brand-500/25 hover:from-brand-600 hover:to-brand-700"
      >
        {saving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : saved ? (
          <>
            <Check className="h-5 w-5" />
            Saved Successfully
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            Save Changes
          </>
        )}
      </button>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="ios-button w-full border border-red-200 bg-red-50 py-3.5 text-red-600 hover:bg-red-100"
      >
        <LogOut className="h-5 w-5" />
        Sign Out
      </button>
    </div>
  );
}
