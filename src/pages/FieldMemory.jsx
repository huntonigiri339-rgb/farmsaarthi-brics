import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Eye,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  Plus,
  Calendar,
  Tag,
  Loader2,
  X
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useToast } from "../components/Toast";
import { fieldMemoryDemo } from "../data/mockData";
import { collection, query, orderBy, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const iconMap = {
  observation: Eye,
  advisory: MessageSquare,
  action: CheckCircle,
  outcome: TrendingUp
};

export default function FieldMemory() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [type, setType] = useState("observation");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("Field Check");

  const { showToast } = useToast();

  const fetchFieldMemory = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "fieldMemory"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const fetched = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setEntries(fetched);
      } else {
        setEntries(fieldMemoryDemo);
      }
    } catch (err) {
      console.warn("Firestore fieldMemory query fallback:", err);
      setEntries(fieldMemoryDemo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFieldMemory();
  }, []);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      showToast("Please enter a title and description.", "error");
      return;
    }

    setSaving(true);
    const newEntry = {
      type,
      title,
      description,
      tag: tag || "Field Check",
      timestamp: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "fieldMemory"), newEntry);
      setEntries((prev) => [{ id: docRef.id, ...newEntry }, ...prev]);
      showToast("Field Memory entry saved!", "success");
      setShowModal(false);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.warn("Firestore add error, adding locally for demo:", err);
      const demoEntry = { id: "local-" + Date.now(), ...newEntry };
      setEntries((prev) => [demoEntry, ...prev]);
      showToast("Saved to local timeline (Demo mode)", "success");
      setShowModal(false);
      setTitle("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Immutable Agronomic Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Your Field's History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chronological field memory recording observations, KVK advisories, farmer actions, and yield outcomes.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => setShowModal(true)}>
          Add Entry
        </Button>
      </div>

      {/* Timeline Section */}
      <Card glass className="p-6 sm:p-8">
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-500 mb-2" />
            <p className="text-xs">Loading field history...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">No entries yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">Start by checking your crop or adding an observation.</p>
            <Button variant="primary" icon={Plus} onClick={() => setShowModal(true)}>
              Add First Entry
            </Button>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-6 space-y-8 py-2">
            {entries.map((item) => {
              const IconComp = iconMap[item.type] || Eye;
              return (
                <div key={item.id} className="relative pl-6 sm:pl-8 group">
                  {/* Icon Node */}
                  <div className="absolute -left-[17px] top-0.5 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-brand-500 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-md group-hover:scale-110 transition-transform">
                    <IconComp className="w-4 h-4" />
                  </div>

                  {/* Content Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 hover:border-brand-400/40 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold capitalize">
                          {item.type}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(item.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded-md">
                        <Tag className="w-3 h-3" />
                        {item.tag || "General"}
                      </span>
                      {item.isSimulated && (
                        <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-300/40">
                          Demo Entry
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Add Field Memory Entry</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Entry Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium outline-none"
                >
                  <option value="observation">Observation (Eye)</option>
                  <option value="advisory">Advisory Given (MessageSquare)</option>
                  <option value="action">Action Taken (CheckCircle)</option>
                  <option value="outcome">Outcome Monitored (TrendingUp)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Leaf spot noticed on maize seedlings"
                  required
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Tag / Category</label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Treatment, Field Check, Harvest"
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed notes on field symptoms, inputs applied, or yield observations..."
                  rows={3}
                  required
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={saving}>
                  Save Entry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
