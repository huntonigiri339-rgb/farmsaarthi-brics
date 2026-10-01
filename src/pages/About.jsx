import React from "react";
import {
  Sprout,
  Brain,
  Users,
  HeartHandshake,
  ExternalLink,
  AlertOctagon,
  ArrowRight,
  Database,
  Layers,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import Card from "../components/Card";

export default function About() {
  const pillars = [
    {
      title: "1. Agronomic Intelligence",
      description: "Combines high-resolution Open-Meteo meteorological data with AI leaf diagnostics to provide field-specific advice.",
      icon: Brain,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "2. BRICS Cooperation",
      description: "Enables cross-border knowledge passports between India, Brazil, South Africa, China, and Russia while safeguarding local climate rules.",
      icon: Users,
      color: "from-sky-500 to-blue-600"
    },
    {
      title: "3. Inclusive Governance",
      description: "Ensures low-confidence AI results are transparently flagged, connecting farmers with human extension officers.",
      icon: HeartHandshake,
      color: "from-amber-500 to-orange-600"
    }
  ];

  const dataSources = [
    {
      name: "Open-Meteo API",
      type: "Live Weather & Geolocation",
      description: "High-resolution forecast data without API keys.",
      link: "https://open-meteo.com/",
      status: "Live Data"
    },
    {
      name: "ICAR Geoportal",
      type: "Crop Disease Knowledge base",
      description: "Cited for pest & disease identification guidelines.",
      link: "https://icar.org.in/",
      status: "Cited Source"
    },
    {
      name: "Google AMED API",
      type: "Satellite Vegetation Stress",
      description: "Earth observation NDVI data streams.",
      link: "https://earthengine.google.com/",
      status: "Cited Source"
    },
    {
      name: "AGMARKNET",
      type: "Market Commodity Prices",
      description: "Indian agricultural market price monitoring.",
      link: "https://agmarknet.gov.in/",
      status: "Cited Source"
    }
  ];

  const limitations = [
    "AI Crop Diagnosis is simulated for demonstration purposes in this prototype.",
    "Weather forecasting uses live real-time Open-Meteo data via browser geolocation.",
    "Context Passport is a demonstrative framework for BRICS knowledge exchange.",
    "FarmSaarthi is a research prototype and not an officially endorsed BRICS intergovernmental standard.",
    "No guaranteed claims are made regarding crop yield impact, accuracy, or financial outcomes."
  ];

  const flowSteps = [
    { step: "1", title: "Capture Photo", desc: "Farmer takes photo of affected crop leaf." },
    { step: "2", title: "Open-Meteo Sync", desc: "System fetches live temperature & relative humidity." },
    { step: "3", title: "AI Diagnostic Engine", desc: "Evaluates leaf symptoms & calculates confidence." },
    { step: "4", title: "Context Passport", desc: "Validates if cross-border advisory matches local climate." },
    { step: "5", title: "Field Memory", desc: "Stores observation & outcome in immutable history." }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <Card glass className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-4">
            <Sprout className="w-4 h-4" />
            <span>FarmSaarthi Vision</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            What is FarmSaarthi?
          </h1>
          <p className="text-slate-200 text-sm sm:text-base mt-3 leading-relaxed">
            FarmSaarthi is an open, production-quality agricultural decision-support web application designed to deliver <span className="text-emerald-300 font-semibold">Validated Knowledge and Local Advice</span> to smallholder farmers across BRICS member countries.
          </p>
        </div>
      </Card>

      {/* Three Pillars */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Core Pillars of FarmSaarthi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map((pillar) => (
            <Card key={pillar.title} glass hover className="p-6">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pillar.color} text-white flex items-center justify-center shadow-lg mb-4`}>
                <pillar.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* 5-Step Flow Diagram */}
      <Card glass className="p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          How FarmSaarthi Works
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          5-step workflow linking image recognition, real-time weather, and governance passports.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {flowSteps.map((s, idx) => (
            <div key={s.step} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 relative flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center mb-3 shadow-sm">
                  {s.step}
                </span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                  {s.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Data Sources */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Data Sources & Integration
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dataSources.map((ds) => (
            <Card key={ds.name} glass hover className="p-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{ds.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ds.status === "Live Data" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {ds.status}
                  </span>
                </div>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 block mb-1">{ds.type}</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{ds.description}</p>
              </div>

              <a
                href={ds.link}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 shrink-0 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </Card>
          ))}
        </div>
      </div>

      {/* Prototype Limitations */}
      <Card glass className="p-6 border-2 border-amber-500/30 bg-amber-500/5">
        <div className="flex items-center gap-2.5 mb-4 text-amber-800 dark:text-amber-300">
          <AlertOctagon className="w-6 h-6 shrink-0 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-bold">Prototype Limitations & Transparency Disclaimer</h2>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
          {limitations.map((lim, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>{lim}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
