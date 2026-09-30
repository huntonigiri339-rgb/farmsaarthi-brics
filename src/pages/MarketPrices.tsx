import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, MapPin } from "lucide-react";
import { DemoBadge, PageHeader } from "../components/Badges";

interface PriceEntry {
  crop: string;
  state: string;
  mandi: string;
  price: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number;
  date: string;
}

const STATES = ["All States", "Maharashtra", "Punjab", "Karnataka", "Madhya Pradesh", "Uttar Pradesh", "Gujarat", "Tamil Nadu"];

const CROPS = ["All Crops", "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Onion", "Tomato", "Groundnut", "Soybean"];

const DEMO_PRICES: PriceEntry[] = [
  { crop: "Rice", state: "Punjab", mandi: "Khanna", price: 2850, unit: "quintal", trend: "up", change: 45, date: "2026-09-28" },
  { crop: "Rice", state: "Uttar Pradesh", mandi: "Varanasi", price: 2720, unit: "quintal", trend: "stable", change: 0, date: "2026-09-28" },
  { crop: "Rice", state: "Andhra Pradesh", mandi: "Vijayawada", price: 2680, unit: "quintal", trend: "down", change: -30, date: "2026-09-27" },
  { crop: "Wheat", state: "Punjab", mandi: "Ludhiana", price: 2120, unit: "quintal", trend: "up", change: 25, date: "2026-09-28" },
  { crop: "Wheat", state: "Madhya Pradesh", mandi: "Bhopal", price: 2050, unit: "quintal", trend: "stable", change: 0, date: "2026-09-28" },
  { crop: "Wheat", state: "Uttar Pradesh", mandi: "Kanpur", price: 2080, unit: "quintal", trend: "up", change: 15, date: "2026-09-27" },
  { crop: "Maize", state: "Karnataka", mandi: "Davangere", price: 1965, unit: "quintal", trend: "down", change: -20, date: "2026-09-28" },
  { crop: "Maize", state: "Maharashtra", mandi: "Aurangabad", price: 1890, unit: "quintal", trend: "up", change: 35, date: "2026-09-28" },
  { crop: "Cotton", state: "Gujarat", mandi: "Rajkot", price: 7250, unit: "quintal", trend: "up", change: 120, date: "2026-09-28" },
  { crop: "Cotton", state: "Maharashtra", mandi: "Nagpur", price: 7100, unit: "quintal", trend: "stable", change: 0, date: "2026-09-27" },
  { crop: "Sugarcane", state: "Uttar Pradesh", mandi: "Meerut", price: 340, unit: "quintal", trend: "stable", change: 0, date: "2026-09-28" },
  { crop: "Sugarcane", state: "Maharashtra", mandi: "Kolhapur", price: 355, unit: "quintal", trend: "up", change: 5, date: "2026-09-28" },
  { crop: "Onion", state: "Maharashtra", mandi: "Lasalgaon", price: 1850, unit: "quintal", trend: "down", change: -80, date: "2026-09-28" },
  { crop: "Onion", state: "Karnataka", mandi: "Hubli", price: 1720, unit: "quintal", trend: "down", change: -50, date: "2026-09-27" },
  { crop: "Tomato", state: "Tamil Nadu", mandi: "Coimbatore", price: 1450, unit: "quintal", trend: "up", change: 120, date: "2026-09-28" },
  { crop: "Tomato", state: "Karnataka", mandi: "Bangalore", price: 1320, unit: "quintal", trend: "up", change: 65, date: "2026-09-28" },
  { crop: "Groundnut", state: "Gujarat", mandi: "Junagadh", price: 5850, unit: "quintal", trend: "stable", change: 0, date: "2026-09-28" },
  { crop: "Soybean", state: "Madhya Pradesh", mandi: "Indore", price: 4480, unit: "quintal", trend: "up", change: 70, date: "2026-09-28" },
  { crop: "Soybean", state: "Maharashtra", mandi: "Nagpur", price: 4350, unit: "quintal", trend: "down", change: -35, date: "2026-09-27" },
];

export default function MarketPrices() {
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [selectedState, setSelectedState] = useState("All States");

  const filtered = useMemo(() => {
    return DEMO_PRICES.filter(
      (p) =>
        (selectedCrop === "All Crops" || p.crop === selectedCrop) &&
        (selectedState === "All States" || p.state === selectedState)
    );
  }, [selectedCrop, selectedState]);

  const avgPrice = filtered.length > 0 ? Math.round(filtered.reduce((s, p) => s + p.price, 0) / filtered.length) : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Market Prices" subtitle="Mandi (agricultural market) prices across India">
        <DemoBadge text="Demo Data" />
      </PageHeader>

      <div className="flex items-start gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Prices shown are demo data for illustration. In production, data would be sourced from AGMARKNET (agmarknet.gov.in) and state APMC portals.</p>
      </div>

      {/* Filters */}
      <div className="ios-card space-y-4 p-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Crop</label>
          <div className="flex flex-wrap gap-2">
            {CROPS.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
                  selectedCrop === crop
                    ? "bg-brand-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">State</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="ios-input cursor-pointer"
          >
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="ios-card flex flex-col items-center py-4">
            <span className="text-2xl font-bold text-gray-900">{filtered.length}</span>
            <span className="text-[11px] text-gray-500">Listings</span>
          </div>
          <div className="ios-card flex flex-col items-center py-4">
            <span className="text-2xl font-bold text-brand-600">₹{avgPrice}</span>
            <span className="text-[11px] text-gray-500">Avg Price</span>
          </div>
          <div className="ios-card flex flex-col items-center py-4">
            <span className="text-2xl font-bold text-gray-900">{selectedCrop === "All Crops" ? "All" : selectedCrop}</span>
            <span className="text-[11px] text-gray-500">Crop</span>
          </div>
        </div>
      )}

      {/* Price Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((entry, i) => (
          <div key={i} className="ios-card p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{entry.crop}</h3>
                <p className="text-sm text-gray-500">{entry.mandi}, {entry.state}</p>
              </div>
              <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                entry.trend === "up" ? "bg-green-50 text-green-700" :
                entry.trend === "down" ? "bg-red-50 text-red-700" :
                "bg-gray-50 text-gray-500"
              }`}>
                {entry.trend === "up" && <TrendingUp className="h-3.5 w-3.5" />}
                {entry.trend === "down" && <TrendingDown className="h-3.5 w-3.5" />}
                {entry.trend === "stable" && <Minus className="h-3.5 w-3.5" />}
                {entry.change > 0 ? "+" : ""}{entry.change}
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900">₹{entry.price.toLocaleString("en-IN")}</span>
                <span className="ml-1 text-sm text-gray-400">/{entry.unit}</span>
              </div>
              <span className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString("en", { month: "short", day: "numeric" })}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="ios-card flex flex-col items-center py-12 text-gray-400">
          <TrendingUp className="h-8 w-8 mb-2" />
          <p className="text-sm">No price data for this combination. Try different filters.</p>
        </div>
      )}
    </div>
  );
}
