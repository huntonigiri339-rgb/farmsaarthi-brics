import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Check,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Globe2,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  FileCheck
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { contextPassports } from "../data/mockData";
import { useToast } from "../components/Toast";

export default function ContextPassport() {
  const [activeStateKey, setActiveStateKey] = useState("review");
  const [animatedIndex, setAnimatedIndex] = useState(0);
  const { showToast } = useToast();

  const activePassport = contextPassports[activeStateKey] || contextPassports.review;

  // Trigger checkmark animation when state switches
  useEffect(() => {
    setAnimatedIndex(0);
    const interval = setInterval(() => {
      setAnimatedIndex((prev) => {
        if (prev < 4) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [activeStateKey]);

  const handleSwitchState = (key) => {
    setActiveStateKey(key);
    showToast(`Switched Context Passport demo state to: ${key.toUpperCase()}`, "info");
  };

  const getVerdictStyles = (status) => {
    switch (status) {
      case "ACCEPT":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200",
          badge: "bg-emerald-600 text-white",
          icon: CheckCircle2,
          color: "text-emerald-600 dark:text-emerald-400"
        };
      case "REJECT":
        return {
          bg: "bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200",
          badge: "bg-red-600 text-white",
          icon: XCircle,
          color: "text-red-600 dark:text-red-400"
        };
      default:
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200",
          badge: "bg-amber-600 text-white",
          icon: AlertTriangle,
          color: "text-amber-600 dark:text-amber-400"
        };
    }
  };

  const verdict = getVerdictStyles(activePassport.status);
  const VerdictIcon = verdict.icon;

  const fieldsList = [
    { key: "crop", label: "Crop Type", sourceVal: activePassport.source.crop, targetVal: activePassport.target.crop, isMatch: activePassport.source.matches.crop },
    { key: "growthStage", label: "Growth Stage", sourceVal: activePassport.source.growthStage, targetVal: activePassport.target.growthStage, isMatch: activePassport.source.matches.growthStage },
    { key: "climate", label: "Climate & Moisture", sourceVal: activePassport.source.climate, targetVal: activePassport.target.climate, isMatch: activePassport.source.matches.climate },
    { key: "geography", label: "Geography / Region", sourceVal: activePassport.source.region, targetVal: activePassport.target.region, isMatch: activePassport.source.matches.geography }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-2">
            <Globe2 className="w-3.5 h-3.5" />
            <span>BRICS Cross-Border Validation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Cross-Border Knowledge Check
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Safely adapt agronomic assertions from India, Brazil, China, Russia, or South Africa to your local field.
          </p>
        </div>

        {/* Demo Outcome Controls */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700">
          <span className="text-xs font-semibold px-2 text-slate-500 dark:text-slate-400">Demo Outcome:</span>
          <button
            onClick={() => handleSwitchState("accept")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeStateKey === "accept"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            ACCEPT
          </button>
          <button
            onClick={() => handleSwitchState("review")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeStateKey === "review"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            REVIEW
          </button>
          <button
            onClick={() => handleSwitchState("reject")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeStateKey === "reject"
                ? "bg-red-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            REJECT
          </button>
        </div>
      </div>

      {/* Main Verdict Card */}
      <Card glass className={`p-6 sm:p-8 border-2 ${verdict.bg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${verdict.badge}`}>
              <VerdictIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Passport ID: {activePassport.id}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">
                  Demo Mode
                </span>
              </div>
              <h2 className={`text-2xl font-black ${verdict.color}`}>
                {activePassport.status}
              </h2>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 dark:text-slate-400">
            <span>Valid until: </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{activePassport.source.validUntil || "Oct 2026"}</span>
          </div>
        </div>

        <div className="pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Validation Reason
          </h4>
          <p className="text-sm font-semibold leading-relaxed">
            {activePassport.reason}
          </p>
        </div>
      </Card>

      {/* Two Column Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Assertion */}
        <Card glass className="p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Origin Country</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Source Assertion</span>
                <span className="text-base font-normal">({activePassport.source.country})</span>
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              Verified Source
            </span>
          </div>

          <div className="space-y-4">
            {fieldsList.map((field, idx) => {
              const isVisible = idx <= animatedIndex;
              return (
                <div key={field.key} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">{field.label}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{field.sourceVal}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isVisible && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold animate-scale-in ${
                        field.isMatch
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                      }`}>
                        {field.isMatch ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        {field.isMatch ? "Match" : "Differs"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Target Field */}
        <Card glass className="p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Destination Field</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Your Field</span>
                <span className="text-base font-normal">({activePassport.target.country})</span>
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-semibold">
              Target Field
            </span>
          </div>

          <div className="space-y-4">
            {fieldsList.map((field, idx) => {
              const isVisible = idx <= animatedIndex;
              return (
                <div key={field.key} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">{field.label}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{field.targetVal}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isVisible && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold animate-scale-in ${
                        field.isMatch
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                      }`}>
                        {field.isMatch ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        {field.isMatch ? "OK" : "Review"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Info Card */}
      <Card glass className="p-5 flex items-start gap-3 bg-slate-900 text-white border-slate-800">
        <FileCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <p className="font-bold text-white mb-1">How Context Passport Works</p>
          Context Passport ensures cross-border agricultural knowledge is adapted with local governance rules. If micro-climate, soil moisture, or growth stages differ between source and target fields, FarmSaarthi flags "LOCAL REVIEW REQUIRED" so extension workers can inspect before application.
        </div>
      </Card>
    </div>
  );
}
