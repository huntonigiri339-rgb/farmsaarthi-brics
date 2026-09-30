import { useState, useRef, ChangeEvent } from "react";
import {
  Leaf,
  Upload,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  ArrowRight,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { DemoBadge, PageHeader } from "../components/Badges";

interface DiagnosisResult {
  diagnosis: string;
  confidence: number;
  evidence: { label: string; detail: string }[];
  status: "diagnosed" | "insufficient_evidence";
  recommendation: string;
}

const CROP_OPTIONS = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Tomato", "Onion", "Groundnut"];

const SIMULATED_DIAGNOSES: Omit<DiagnosisResult, "confidence">[] = [
  {
    diagnosis: "Leaf Blast (Magnaporthe oryzae)",
    evidence: [
      { label: "Visual pattern", detail: "Diamond-shaped lesions with brown borders detected on leaf blades" },
      { label: "Color analysis", detail: "Gray-white center spots with dark brown margins consistent with blast lesions" },
      { label: "Distribution", detail: "Lesions spread across upper leaf surface, indicating advanced infection stage" },
    ],
    status: "diagnosed",
    recommendation: "Apply approved fungicide within 48 hours. Improve field drainage and reduce nitrogen fertilizer application.",
  },
  {
    diagnosis: "Bacterial Blight (Xanthomonas oryzae)",
    evidence: [
      { label: "Visual pattern", detail: "Yellow-striped lesions along leaf margins, wavy edges observed" },
      { label: "Color analysis", detail: "Lesions show progressive yellowing from tip to base, wilting at edges" },
      { label: "Distribution", detail: "Pattern starts from leaf tips, spreading downward — typical of bacterial spread" },
    ],
    status: "diagnosed",
    recommendation: "Remove infected plants. Apply copper-based bactericide. Avoid overhead irrigation.",
  },
  {
    diagnosis: "Nutrient Deficiency (Nitrogen)",
    evidence: [
      { label: "Visual pattern", detail: "General yellowing (chlorosis) of older leaves, V-shaped yellowing pattern" },
      { label: "Color analysis", detail: "Pale green to yellow coloration spreading from lower leaves upward" },
      { label: "Distribution", detail: "Uniform across field section, older leaves most affected" },
    ],
    status: "diagnosed",
    recommendation: "Apply nitrogen fertilizer (urea) in split doses. Conduct soil test for precise N-P-K levels.",
  },
  {
    diagnosis: "Insufficient Evidence",
    evidence: [
      { label: "Image quality", detail: "Low resolution or lighting conditions prevent reliable pattern detection" },
      { label: "Symptom clarity", detail: "No distinctive lesion patterns or color signatures matched known disease profiles" },
      { label: "Coverage", detail: "Less than 60% of leaf area visible for analysis" },
    ],
    status: "insufficient_evidence",
    recommendation: "Retake photo with better lighting and closer focus. Alternatively, consult a local agricultural extension officer.",
  },
];

export default function CropHealth() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [saved, setSaved] = useState(false);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setResult(null);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imagePreview) return;
    setAnalyzing(true);
    setResult(null);
    setSaved(false);

    await new Promise((r) => setTimeout(r, 2000));

    const randomIndex = Math.floor(Math.random() * SIMULATED_DIAGNOSES.length);
    const base = SIMULATED_DIAGNOSES[randomIndex];
    const confidence =
      base.status === "insufficient_evidence"
        ? Math.round(30 + Math.random() * 20)
        : Math.round(72 + Math.random() * 23);

    setResult({ ...base, confidence });
    setAnalyzing(false);

    await supabase.from("observations").insert({
      user_id: user?.id,
      crop_name: selectedCrop,
      diagnosis: base.diagnosis,
      confidence,
      evidence: base.evidence,
      status: base.status,
      data_source: "ICAR / Google AMED API (simulated)",
    });

    await supabase.from("field_memory").insert({
      user_id: user?.id,
      event_type: "observation",
      title: `Crop check: ${selectedCrop}`,
      description: `${base.diagnosis} — ${confidence}% confidence`,
      crop_name: selectedCrop,
    });
  };

  const reset = () => {
    setImagePreview(null);
    setResult(null);
    setSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crop Health"
        subtitle="Upload a photo for AI-powered crop disease diagnosis"
      >
        <DemoBadge text="Simulated AI" />
      </PageHeader>

      {/* Data Source Note */}
      <div className="flex items-start gap-3 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-800">
        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <span className="font-semibold">Data Source:</span> Diagnoses reference ICAR (Indian Council of Agricultural Research) disease databases and Google AMED API patterns. This is a prototype — results are simulated for demonstration.
        </p>
      </div>

      {/* Crop selector */}
      <div className="ios-card p-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">Select Crop</label>
        <div className="flex flex-wrap gap-2">
          {CROP_OPTIONS.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
                selectedCrop === crop
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Upload area */}
      <div className="ios-card p-6">
        {!imagePreview ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 py-12 transition-all hover:border-brand-300 hover:bg-brand-50/30"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
              <Upload className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Upload a crop photo</p>
              <p className="mt-0.5 text-xs text-gray-500">Tap to select an image from your device</p>
            </div>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Uploaded crop"
                className="w-full rounded-2xl object-cover max-h-72"
              />
              <button
                onClick={reset}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            {!result && !analyzing && (
              <button
                onClick={analyze}
                className="ios-button w-full bg-gradient-to-r from-brand-500 to-brand-600 py-3.5 text-white shadow-lg shadow-brand-500/25"
              >
                <Leaf className="h-5 w-5" />
                Analyze Crop Health
              </button>
            )}

            {analyzing && (
              <div className="flex flex-col items-center gap-3 py-6">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
                <p className="text-sm font-medium text-gray-600">Analyzing image…</p>
                <p className="text-xs text-gray-400">Running pattern recognition against disease database</p>
              </div>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Results */}
      {result && (
        <div className="ios-card p-6 animate-scale-in">
          {/* Confidence header */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                {result.status === "diagnosed" ? (
                  <CheckCircle2 className="h-5 w-5 text-brand-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                <h3 className="text-lg font-bold text-gray-900">{result.diagnosis}</h3>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {result.status === "diagnosed"
                  ? "Diagnosis complete"
                  : "Unable to determine with high confidence"}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${result.status === "diagnosed" ? "text-brand-600" : "text-amber-500"}`}>
                {result.confidence}%
              </div>
              <p className="text-[11px] text-gray-400">confidence</p>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="mb-5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  result.status === "diagnosed"
                    ? "bg-gradient-to-r from-brand-400 to-brand-600"
                    : "bg-gradient-to-r from-amber-400 to-amber-500"
                }`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>

          {/* Insufficient evidence warning */}
          {result.status === "insufficient_evidence" && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Confidence is below 60%. Please retake the photo with better lighting and closer focus for a more reliable diagnosis.</p>
            </div>
          )}

          {/* Evidence list */}
          <div className="mb-5">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Evidence</h4>
            <div className="space-y-2">
              {result.evidence.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-[11px] font-bold text-brand-700">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ev.label}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{ev.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="rounded-2xl bg-brand-50 px-4 py-4">
            <h4 className="mb-1.5 text-sm font-semibold text-brand-900">Recommendation</h4>
            <p className="text-sm text-brand-800">{result.recommendation}</p>
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={reset}
              className="ios-button flex-1 border border-gray-200 bg-white py-3 text-gray-700 hover:bg-gray-50"
            >
              Check Another
            </button>
            <button
              onClick={() => setSaved(true)}
              disabled={saved}
              className="ios-button flex-1 bg-brand-500 py-3 text-white hover:bg-brand-600"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Saved to Field Memory
                </>
              ) : (
                <>
                  Save to Field Memory
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
