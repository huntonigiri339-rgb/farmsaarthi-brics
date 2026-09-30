import {
  Sprout,
  Brain,
  Handshake,
  Heart,
  ExternalLink,
  Info,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "../components/Badges";

const PILLARS = [
  {
    icon: Brain,
    title: "Intelligence",
    description: "AI-powered crop diagnostics and real-time weather data help farmers make informed decisions. We bring validated agricultural knowledge to the field.",
    color: "from-brand-500 to-brand-600",
    bg: "bg-brand-50",
  },
  {
    icon: Handshake,
    title: "Cooperation",
    description: "Cross-border knowledge sharing between BRICS nations. Context Passport validates whether advisories from one region apply in another before transferring.",
    color: "from-sky-500 to-sky-600",
    bg: "bg-sky-50",
  },
  {
    icon: Heart,
    title: "Inclusion",
    description: "Designed for smallholder farmers. Local data stays local — only validated, context-matched knowledge moves across borders. Accessible on any device.",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
  },
];

const DATA_SOURCES = [
  {
    name: "ICAR — Indian Council of Agricultural Research",
    description: "Crop disease databases and agricultural research",
    url: "https://icar.org.in",
  },
  {
    name: "Google AMED API",
    description: "Agricultural metadata and entity detection",
    url: "https://developers.google.com/maps/documentation/places/web-service",
  },
  {
    name: "Open-Meteo",
    description: "Free weather API for current conditions and 7-day forecasts",
    url: "https://open-meteo.com",
  },
  {
    name: "AGMARKNET",
    description: "Agricultural Marketing Information Network — mandi prices",
    url: "https://agmarknet.gov.in",
  },
];

export default function About() {
  return (
    <div className="space-y-6">
      <PageHeader title="About FarmSaarthi" subtitle="Bridging agricultural intelligence across BRICS borders" />

      {/* Hero */}
      <div className="glass-card p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
            <Sprout className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">FarmSaarthi</h2>
            <p className="text-sm text-gray-500">BRICS Agricultural Intelligence Platform</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-gray-600">
          FarmSaarthi connects farmers to real weather data, AI crop diagnostics, and cross-border validated agricultural knowledge. A farmer in Brazil can benefit from a disease advisory validated in India — but only when growing conditions genuinely match. That's what Context Passport ensures.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          The core principle: <span className="font-semibold text-brand-700">local data stays local — validated knowledge moves.</span>
        </p>
      </div>

      {/* Three Pillars */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Three Pillars</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="ios-card p-6 transition-all hover:shadow-md">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.color} shadow-md`}>
                <pillar.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-gray-900">{pillar.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Data Sources</h3>
        <div className="ios-card divide-y divide-gray-100">
          {DATA_SOURCES.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 transition-all hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                <ExternalLink className="h-5 w-5 text-sky-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{source.name}</p>
                <p className="text-xs text-gray-500">{source.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-300" />
            </a>
          ))}
        </div>
      </div>

      {/* Limitations */}
      <div className="rounded-3xl border-2 border-amber-200 bg-amber-50 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <AlertCircle className="h-5 w-5 text-amber-700" />
          </div>
          <h3 className="text-lg font-bold text-amber-900">Limitations</h3>
        </div>
        <div className="space-y-2 text-sm text-amber-800">
          <p className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            This is a <span className="font-semibold">prototype</span> for demonstration purposes.
          </p>
          <p className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            Not an official <span className="font-semibold">BRICS standard</span> or endorsed protocol.
          </p>
          <p className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            <span className="font-semibold">No accuracy claims</span> — AI diagnoses are simulated, market prices are demo data.
          </p>
          <p className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
            Weather data is real (Open-Meteo), but agricultural advisories should not replace professional consultation.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 py-4 text-xs text-gray-400">
        <Info className="h-3.5 w-3.5" />
        FarmSaarthi — Prototype — Demo Data — 2026
      </div>
    </div>
  );
}
