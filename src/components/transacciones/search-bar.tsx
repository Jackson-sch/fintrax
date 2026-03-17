"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  paramName?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Buscar transacciones…",
  paramName = "q",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get(paramName) || "";
  const [value, setValue] = useState(currentQuery);

  function handleSearch(newValue: string) {
    setValue(newValue);

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (newValue.trim()) {
        params.set(paramName, newValue.trim());
      } else {
        params.delete(paramName);
      }
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  function handleClear() {
    setValue("");
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(paramName);
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className={cn("relative flex-1 max-w-sm group", className)}>
      <Search
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none transition-colors",
          isPending ? "text-violet-400 animate-pulse" : "text-white/20 group-focus-within:text-white/40",
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-11 pr-10 bg-white/4 border border-white/6 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:bg-white/6 focus:border-white/20 transition-all"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-white/20 hover:text-white/60 hover:bg-white/10 transition-all"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
