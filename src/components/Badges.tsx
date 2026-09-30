import { ReactNode } from "react";

interface DemoBadgeProps {
  text?: string;
}

export function DemoBadge({ text = "Demo Data" }: DemoBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      {text}
    </span>
  );
}

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
      Live
    </span>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
