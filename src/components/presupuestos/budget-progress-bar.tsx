import { cn } from "@/lib/utils";

interface BudgetProgressBarProps {
  percentage: number;
  color?: string;
  className?: string;
}

export function BudgetProgressBar({
  percentage,
  color,
  className,
}: BudgetProgressBarProps) {
  const clampedPercent = Math.min(percentage, 100);

  const gradientColor =
    percentage >= 100
      ? "from-rose-600 to-rose-400"
      : percentage >= 80
        ? "from-amber-600 to-orange-400"
        : "from-emerald-600 to-teal-400";

  const glowColor =
    percentage >= 100
      ? "rgba(244,63,94,0.5)"
      : percentage >= 80
        ? "rgba(245,158,11,0.5)"
        : "rgba(16,185,129,0.5)";

  return (
    <div
      className={cn(
        "w-full bg-white/6 rounded-full h-1.5 overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "h-1.5 rounded-full bg-linear-to-r transition-all duration-700",
          gradientColor,
        )}
        style={{
          width: `${clampedPercent}%`,
          boxShadow: `0 0 10px ${glowColor}`,
          backgroundColor: color && percentage < 80 ? color : undefined,
        }}
      />
    </div>
  );
}
