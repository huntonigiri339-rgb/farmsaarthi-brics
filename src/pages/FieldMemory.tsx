import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Eye,
  Leaf,
  ArrowRight,
  CheckCircle2,
  X,
  Loader2,
  Calendar,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "../components/Badges";

interface MemoryEntry {
  id: string;
  event_type: "observation" | "advisory" | "action" | "outcome";
  title: string;
  description: string;
  crop_name: string | null;
  created_at: string;
}

const EVENT_CONFIG = {
  observation: { icon: Eye, color: "bg-brand-100 text-brand-700", label: "Observation" },
  advisory: { icon: Leaf, color: "bg-amber-100 text-amber-700", label: "Advisory" },
  action: { icon: ArrowRight, color: "bg-sky-100 text-sky-700", label: "Action" },
  outcome: { icon: CheckCircle2, color: "bg-purple-100 text-purple-700", label: "Outcome" },
};

export default function FieldMemory() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    event_type: "observation" as MemoryEntry["event_type"],
    title: "",
    description: "",
    crop_name: "",
  });

  const fetchEntries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("field_memory")
      .select("id, event_type, title, description, crop_name, created_at")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    setEntries(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, [user?.id]);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSubmitting(true);
    await supabase.from("field_memory").insert({
      user_id: user?.id,
      event_type: form.event_type,
      title: form.title,
      description: form.description,
      crop_name: form.crop_name || null,
    });
    setSubmitting(false);
    setForm({ event_type: "observation", title: "", description: "", crop_name: "" });
    setShowForm(false);
    fetchEntries();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Field Memory" subtitle="Timeline of observations, advisories, actions, and outcomes">
        <button
          onClick={() => setShowForm(true)}
          className="ios-button bg-brand-500 px-4 py-2.5 text-white shadow-md shadow-brand-500/20 hover:bg-brand-600"
        >
          <Plus className="h-5 w-5" />
          Add Entry
        </button>
      </PageHeader>

      {loading ? (
        <div className="flex items-center gap-3 py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          <p className="text-sm text-gray-500">Loading field memory…</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="ios-card flex flex-col items-center py-16 text-gray-400">
          <BookOpen className="h-10 w-10 mb-3" />
          <p className="text-sm font-medium text-gray-600">No field memory entries yet</p>
          <p className="mt-1 text-xs text-gray-400">Track observations, advisories, actions, and outcomes here.</p>
          <button
            onClick={() => setShowForm(true)}
            className="ios-button mt-4 bg-brand-500 px-4 py-2.5 text-white"
          >
            <Plus className="h-5 w-5" />
            Add First Entry
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />

          <div className="space-y-4">
            {entries.map((entry, i) => {
              const config = EVENT_CONFIG[entry.event_type];
              const Icon = config.icon;
              return (
                <div
                  key={entry.id}
                  className="relative flex gap-4 animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.color} ring-4 ring-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 ios-card p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(entry.created_at).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">{entry.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{entry.description}</p>
                    {entry.crop_name && (
                      <span className="mt-2 inline-block rounded-lg bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        {entry.crop_name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Entry Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm sm:items-center" onClick={() => setShowForm(false)}>
          <div
            className="ios-card w-full max-w-md rounded-b-none p-6 animate-slide-up sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">New Field Memory Entry</h3>
              <button onClick={() => setShowForm(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Event Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(EVENT_CONFIG) as MemoryEntry["event_type"][]).map((type) => {
                    const config = EVENT_CONFIG[type];
                    const Icon = config.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => setForm({ ...form, event_type: type })}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                          form.event_type === type
                            ? "bg-brand-500 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Brief title for this entry"
                  className="ios-input"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what happened…"
                  rows={3}
                  className="ios-input resize-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Crop (optional)</label>
                <input
                  type="text"
                  value={form.crop_name}
                  onChange={(e) => setForm({ ...form, crop_name: e.target.value })}
                  placeholder="e.g. Rice, Wheat…"
                  className="ios-input"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !form.title.trim() || !form.description.trim()}
                className="ios-button w-full bg-brand-500 py-3.5 text-white hover:bg-brand-600"
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
