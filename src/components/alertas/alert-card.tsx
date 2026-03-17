"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AlertTypeConfig {
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

interface AlertCardProps {
  alert: {
    id: string;
    type: string;
    threshold: number;
    enabled: boolean;
  };
  config: AlertTypeConfig;
  currency: string;
  onToggle: (id: string, currentEnabled: boolean) => void;
  onEditThreshold: (id: string, currentThreshold: number) => void;
}

export function AlertCard({
  alert,
  config,
  currency,
  onToggle,
  onEditThreshold,
}: AlertCardProps) {
  return (
    <div
      className={cn(
        "bg-white/3 p-5 rounded-2xl flex items-center justify-between transition-all hover:bg-white/5 border",
        alert.enabled ? config.border : "border-white/5",
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-2xl", config.bg, config.color)}>
          <config.icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-white flex items-center gap-2">
            {config.label}
            {!alert.enabled && (
              <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-500 rounded-full font-bold uppercase tracking-wider">
                Inactivo
              </span>
            )}
          </h3>
          <p className="text-sm text-slate-400">
            {config.description}
          </p>
          <button
            onClick={() => onEditThreshold(alert.id, alert.threshold)}
            className="text-xs text-white/30 hover:text-white/60 mt-0.5 transition-colors"
          >
            Umbral: {currency} {alert.threshold.toLocaleString()} ✎
          </button>
        </div>
      </div>

      <button
        onClick={() => onToggle(alert.id, alert.enabled)}
        className={cn(
          "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500 shrink-0",
          alert.enabled ? "bg-blue-600" : "bg-slate-700",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
            alert.enabled ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}
