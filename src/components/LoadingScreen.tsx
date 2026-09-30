import { Leaf } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-sky-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30 animate-pulse">
            <Leaf className="h-8 w-8 text-white" />
          </div>
        </div>
        <p className="text-sm font-medium text-brand-700 animate-fade-in">Loading FarmSaarthi…</p>
      </div>
    </div>
  );
}
