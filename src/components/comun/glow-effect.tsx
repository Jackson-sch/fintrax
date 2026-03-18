"use client";

import { cn } from "@/lib/utils";

interface GlowEffectProps {
  color: string;
  opacity?: number;
  className?: string;
  size?: string;
}

export function GlowEffect({
  color,
  opacity = 0.1,
  className,
  size = "w-72 h-72",
}: GlowEffectProps) {
  return (
    <div
      className={cn(
        "absolute rounded-full blur-3xl pointer-events-none transition-opacity duration-700",
        size,
        className
      )}
      style={{
        backgroundColor: color,
        opacity: opacity,
      }}
    />
  );
}
