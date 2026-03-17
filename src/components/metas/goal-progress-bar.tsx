"use client";

import { cn } from "@/lib/utils";

interface GoalProgressBarProps {
  current: number;
  target: number;
  color: string;
}

export function GoalProgressBar({ current, target, color }: GoalProgressBarProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const isCompleted = percentage === 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Progreso</span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-white leading-none">{percentage}%</span>
          {isCompleted && (
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter animate-pulse">¡Meta alcanzada!</span>
          )}
        </div>
      </div>
      
      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
        <div 
          className={cn(
            "h-full transition-all duration-1000 ease-out rounded-full relative",
            isCompleted && "animate-glow shadow-[0_0_15px_rgba(var(--glow-color),0.5)]"
          )}
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: color,
            boxShadow: isCompleted ? `0 0 15px ${color}80` : 'none'
          }}
        >
          {/* Animated stripe */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
