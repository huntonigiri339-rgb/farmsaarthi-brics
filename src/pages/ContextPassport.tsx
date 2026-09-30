import { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Globe2,
  Crop as CropIcon,
  Cloud,
  Mountain,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { DemoBadge, PageHeader } from "../components/Badges";

interface AssertionField {
  label: string;
  sourceValue: string;
  fieldValue: string;
  match: boolean;
  icon: typeof CropIcon;
}

interface PassportResult {
  verdict: "ACCEPT" | "LOCAL_REVIEW" | "REJECT";
  fields: AssertionField[];
  summary: string;
}

const CROPS = ["Rice", "Wheat", "Maize", "Cotton", "Soybean"];

const ASSERTION_DATABASE: Record<string, { climate: string; geography: string; growthStage: string }> = {
  Rice: { climate: "Tropical wet — monsoon dependent", geography: "Alluvial plains, lowland", growthStage: "Tillering to flowering" },
  Wheat: { climate: "Temperate — cool season", geography: "Alluvial plains, subtropical", growthStage: "Booting to grain filling" },
  Maize: { climate: "Subtropical to temperate", geography: "Well-drained plains and uplands", growthStage: "Tasseling to silking" },
  Cotton: { climate: "Semi-arid tropical", geography: "Black cotton soil, Deccan plateau", growthStage: "Squaring to boll formation" },
  Soybean: { climate: "Subtropical — warm humid", geography: "Medium black soil, Malwa plateau", growthStage: "Pod set to seed fill" },
};

export default function ContextPassport() {
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [fieldRegion, setFieldRegion] = useState("Brazil — Cerrado");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PassportResult | null>(null);

  const analyze = async () => {
    setAnalyzing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2500));

    const source = ASSERTION_DATABASE[selectedCrop];

    const brazilOverrides: Record<string, { climate: string; geography: string; growthStage: string }> = {
      Rice: { climate: "Tropical wet — summer rains", geography: "Alluvial lowland, southern states", growthStage: "Tillering to flowering" },
      Wheat: { climate: "Subtropical — mild winter", geography: "Rolling plateau, acid soils", growthStage: "Booting to grain filling" },
      Maize: { climate: "Tropical — summer wet season", geography: "Well-drained cerrado uplands", growthStage: "Tasseling to silking" },
      Cotton: { climate: "Tropical semi-arid — distinct wet/dry", geography: "Oxisol plateau, central Brazil", growthStage: "Squaring to boll formation" },
      Soybean: { climate: "Tropical — wet summer/dry winter", geography: "Oxisol cerrado, central plateau", growthStage: "Pod set to seed fill" },
    };

    const field = brazilOverrides[selectedCrop] ?? source;

    const fields: AssertionField[] = [
      {
        label: "Crop Species",
        sourceValue: selectedCrop,
        fieldValue: selectedCrop,
        match: true,
        icon: CropIcon,
      },
      {
        label: "Growth Stage",
        sourceValue: source.growthStage,
        fieldValue: field.growthStage,
        match: source.growthStage === field.growthStage,
        icon: CropIcon,
      },
      {
        label: "Climate Zone",
        sourceValue: source.climate,
        fieldValue: field.climate,
        match: source.climate === field.climate,
        icon: Cloud,
      },
      {
        label: "Geography & Soil",
        sourceValue: source.geography,
        fieldValue: field.geography,
        match: source.geography === field.geography,
        icon: Mountain,
      },
    ];

    const matchCount = fields.filter((f) => f.match).length;
    let verdict: PassportResult["verdict"];
    let summary: string;

    if (matchCount >= 3) {
      verdict = "ACCEPT";
      summary = "High contextual alignment between source assertion and your field conditions. The advisory can be applied with confidence, monitoring for local soil pH and rainfall variations.";
    } else if (matchCount >= 2) {
      verdict = "LOCAL_REVIEW";
      summary = "Partial alignment. Core agronomy transfers, but climate or soil differences require local calibration. Consult a regional agronomist before full application.";
    } else {
      verdict = "REJECT";
      summary = "Insufficient contextual match. Growing conditions differ significantly. Direct application risks crop failure — seek a regionally validated advisory instead.";
    }

    setResult({ verdict, fields, summary });
    setAnalyzing(false);
  };

  const verdictConfig = {
    ACCEPT: {
      icon: CheckCircle2,
      color: "text-brand-600",
      bg: "bg-brand-50",
      border: "border-brand-200",
      label: "ACCEPT",
    },
    LOCAL_REVIEW: {
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      label: "LOCAL REVIEW REQUIRED",
    },
    REJECT: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      label: "REJECT",
    },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Context Passport" subtitle="Cross-border assertion validation for agricultural advisories">
        <DemoBadge text="Prototype" />
      </PageHeader>

      <div className="flex items-start gap-3 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-800">
        <Globe2 className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          FarmSaarthi validates whether an advisory from one region (e.g., India) applies in your field context (e.g., Brazil). We check crop species, growth stage, climate zone, and geography before transferring knowledge across borders.
        </p>
      </div>

      {/* Configuration */}
      <div className="ios-card space-y-4 p-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Source Assertion Region</label>
          <div className="flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3">
            <ShieldCheck className="h-5 w-5 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">India — ICAR Validated</p>
              <p className="text-xs text-gray-500">Agricultural advisory source</p>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Crop</label>
          <div className="flex flex-wrap gap-2">
            {CROPS.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
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
          <label className="mb-2 block text-sm font-medium text-gray-700">Your Field Region</label>
          <select
            value={fieldRegion}
            onChange={(e) => setFieldRegion(e.target.value)}
            className="ios-input cursor-pointer"
          >
            <option value="Brazil — Cerrado">Brazil — Cerrado</option>
            <option value="Brazil — South">Brazil — South (Rio Grande do Sul)</option>
            <option value="Russia — Black Earth">Russia — Black Earth Region</option>
            <option value="South Africa — Highveld">South Africa — Highveld</option>
            <option value="China — Yangtze">China — Yangtze Basin</option>
            <option value="India — Punjab">India — Punjab</option>
          </select>
        </div>

        <button
          onClick={analyze}
          disabled={analyzing}
          className="ios-button w-full bg-gradient-to-r from-brand-500 to-brand-600 py-3.5 text-white shadow-lg shadow-brand-500/25"
        >
          {analyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Validating Context…
            </>
          ) : (
            <>
              <ShieldCheck className="h-5 w-5" />
              Run Context Validation
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-scale-in">
          {/* Verdict */}
          <div className={`flex items-center gap-4 rounded-3xl border-2 ${verdictConfig[result.verdict].bg} ${verdictConfig[result.verdict].border} p-6`}>
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm`}>
              {(() => {
                const Icon = verdictConfig[result.verdict].icon;
                return <Icon className={`h-7 w-7 ${verdictConfig[result.verdict].color}`} />;
              })()}
            </div>
            <div>
              <p className={`text-xl font-bold ${verdictConfig[result.verdict].color}`}>
                {verdictConfig[result.verdict].label}
              </p>
              <p className="mt-0.5 text-sm text-gray-600">{result.summary}</p>
            </div>
          </div>

          {/* Field Comparison */}
          <div className="ios-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Assertion Comparison</h3>
            <div className="space-y-3">
              {result.fields.map((field, i) => {
                const Icon = field.icon;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border p-4 transition-all animate-slide-up ${
                      field.match ? "border-brand-100 bg-brand-50/50" : "border-amber-100 bg-amber-50/50"
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-900">{field.label}</span>
                      {field.match ? (
                        <CheckCircle2 className="ml-auto h-4 w-4 text-brand-600" />
                      ) : (
                        <AlertTriangle className="ml-auto h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="text-left">
                        <p className="text-[11px] font-medium text-brand-700">India (Source)</p>
                        <p className="text-sm text-gray-700">{field.sourceValue}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300" />
                      <div className="text-right">
                        <p className="text-[11px] font-medium text-sky-700">Your Field</p>
                        <p className="text-sm text-gray-700">{field.fieldValue}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
