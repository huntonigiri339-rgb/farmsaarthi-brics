import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Loader2,
  RefreshCw,
  Info,
  ShieldAlert
} from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useToast } from "../components/Toast";
import { diagnosisHigh, diagnosisLow } from "../data/mockData";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function CropHealth() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [lowConfidence, setLowConfidence] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const { showToast } = useToast();

  const handleFileSelect = (file) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showToast("Invalid file type. Please upload JPG, PNG, or WebP.", "error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("File size exceeds 10MB limit.", "error");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setResult(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !previewUrl) {
      showToast("Please upload or capture a crop leaf photo first.", "error");
      return;
    }

    setAnalyzing(true);
    showToast("Analyzing leaf image with AI vision models...", "info");

    setTimeout(async () => {
      setAnalyzing(false);
      const activeResult = lowConfidence ? diagnosisLow : diagnosisHigh;
      setResult(activeResult);

      if (!lowConfidence) {
        showToast("Crop diagnosis complete!", "success");
        // Save to Firestore fieldMemory
        try {
          await addDoc(collection(db, "fieldMemory"), {
            type: "observation",
            title: `Diagnosis: ${activeResult.condition}`,
            description: `Confidence: ${(activeResult.confidence * 100).toFixed(0)}%. ${activeResult.recommendation}`,
            timestamp: new Date().toISOString(),
            tag: "AI Diagnosis",
            isSimulated: true
          });
        } catch (dbErr) {
          console.warn("Firestore fieldMemory add note:", dbErr);
        }
      } else {
        showToast("Low confidence diagnosis warning", "amber");
      }
    }, 2000);
  };

  const handleContactExpert = () => {
    showToast("Connecting to nearest extension officer... (Demo)", "info");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Agronome Vision</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Crop Health Diagnostics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload leaf photos to detect pest attacks, fungal diseases, and nutrient deficits.
          </p>
        </div>

        {/* Demo Mode & Confidence Scenario Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700">
            <span className="text-xs font-semibold px-2 text-slate-700 dark:text-slate-300">
              Low Confidence Test
            </span>
            <button
              onClick={() => {
                const nextVal = !lowConfidence;
                setLowConfidence(nextVal);
                if (result) {
                  setResult(nextVal ? diagnosisLow : diagnosisHigh);
                }
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                lowConfidence ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  lowConfidence ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Upload Card */}
      <Card glass className="p-6 md:p-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Check Your Crop
        </h2>

        {/* Hidden Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />

        {/* Drag and Drop Zone / Preview */}
        {!previewUrl ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 ${
              isDragOver
                ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 scale-[0.99]"
                : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-brand-400"
            }`}
          >
            <div className="w-16 h-16 rounded-3xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Drag & Drop leaf photo here
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Supports JPG, PNG, WebP up to 10MB. Make sure the leaf veins and affected spots are clear.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Button
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                icon={Upload}
              >
                Upload File
              </Button>
              <Button
                variant="secondary"
                onClick={() => cameraInputRef.current?.click()}
                icon={Camera}
              >
                Take Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950">
            <img
              src={previewUrl}
              alt="Crop leaf sample"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleRemove}
                className="p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors backdrop-blur-md"
                title="Remove Image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-between text-xs">
              <span className="truncate">{selectedFile?.name || "Leaf_Sample.jpg"}</span>
              <span className="shrink-0 text-slate-400">Ready for Analysis</span>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            size="lg"
            loading={analyzing}
            disabled={!previewUrl}
            onClick={handleAnalyze}
            className="w-full sm:w-auto px-8"
          >
            {analyzing ? "Analyzing Image..." : "Analyze Crop Health"}
          </Button>
        </div>
      </Card>

      {/* Diagnosis Result Card */}
      {result && (
        <Card glass className="p-6 md:p-8 border-2 border-brand-500/30 dark:border-brand-400/30 animate-scale-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold">
                  Demo Mode
                </span>
                <span className="text-xs text-slate-400 font-medium">Simulation Result</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {result.condition}
              </h3>
            </div>

            {/* Confidence Progress Bar */}
            <div className="w-full md:w-64 bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-600 dark:text-slate-300">Confidence Score</span>
                <span className={result.confidence > 0.5 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
                  {(result.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    result.confidence > 0.5 ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* High vs Low Confidence Layout */}
          {result.confidence < 0.5 ? (
            <div className="py-6 space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Insufficient Evidence</h4>
                  <p className="text-xs mt-1 leading-relaxed">
                    I cannot diagnose this reliably due to low confidence match. Please consult an agronomy extension officer.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Button variant="danger" icon={PhoneCall} onClick={handleContactExpert}>
                  Contact Expert
                </Button>
                <Button variant="secondary" icon={RefreshCw} onClick={handleRemove}>
                  Try Another Photo
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-6">
              {/* Evidence List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Diagnostic Evidence Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.evidence.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <span className="font-bold text-slate-900 dark:text-white block mb-1">
                        {item.type}
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 leading-normal">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Recommended Treatment Plan
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                  {result.recommendation}
                </p>
              </div>
            </div>
          )}

          {/* Data Source Note */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-slate-500" />
            <span>{result.citation}</span>
          </div>
        </Card>
      )}
    </div>
  );
}
