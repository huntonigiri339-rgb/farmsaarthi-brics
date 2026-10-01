import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = "", glass = false, hover = false, onClick }: CardProps) {
  const baseClasses = glass
    ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-slate-800/80 shadow-sm"
    : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm";

  const hoverClasses = hover ? "lg:hover:-translate-y-1 lg:hover:shadow-md transition-all duration-200" : "";

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-5 md:p-6 transition-colors duration-200 ${baseClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}
