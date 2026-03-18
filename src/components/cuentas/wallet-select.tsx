"use client";

import { useState, useEffect } from "react";
import { Wallet as WalletIcon, Plus, ChevronsUpDown, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import { getWallets } from "@/actions/financial-actions";
import { WalletDialog } from "@/components/cuentas/wallet-dialog";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface WalletSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  showBalance?: boolean;
  showCreateOption?: boolean;
  currency?: string;
  className?: string;
  allowNone?: boolean;
  noneLabel?: string;
  noneValue?: string;
}

// ── Wallet color dot ──────────────────────────────────────────────────────────
function WalletDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block size-2.5 rounded-full shrink-0 ring-2 ring-white/10"
      style={{
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}60`,
      }}
    />
  );
}

// ── Skeleton shimmer ──────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 mx-1 rounded-xl animate-pulse">
      <span className="size-2.5 rounded-full bg-white/10 shrink-0" />
      <span className="h-3 w-28 rounded-md bg-white/8" />
      <span className="ml-auto h-3 w-14 rounded-md bg-white/5" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function WalletSelect({
  value,
  onValueChange,
  placeholder = "Seleccionar cuenta",
  showBalance = false,
  showCreateOption = true,
  currency = "USD",
  className,
  allowNone = false,
  noneLabel = "Ninguna (No afecta saldo)",
  noneValue = "NO_WALLET",
}: WalletSelectProps) {
  const [wallets, setWallets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  const fetchWallets = async () => {
    try {
      setIsLoading(true);
      const data = await getWallets();
      setWallets(data);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleValueChange = (val: string | null) => {
    if (val === "NEW_WALLET") {
      setIsWalletDialogOpen(true);
    } else if (val !== null) {
      onValueChange(val);
    }
  };

  const selectedWallet = wallets.find((w) => w.id === value);
  const isNoneSelected = value === noneValue;

  return (
    <div className={cn("w-full", className)}>
      <Select value={value ?? ""} onValueChange={handleValueChange}>
        <FormControl>
          <SelectTrigger
            className={cn(
              // base
              "group w-full h-14! px-4 rounded-2xl border outline-none",
              "flex items-center justify-between gap-3",
              "transition-all duration-200",
              // colors
              "bg-white/4 border-white/8 text-white",
              "hover:bg-white/7 hover:border-white/14",
              "focus:bg-white/6 focus:border-white/20 focus:ring-0",
              // icon override — hide default chevron
              "[&>svg:last-child]:hidden",
            )}
          >
            {/* Left content */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {isLoading ? (
                <>
                  <WalletIcon className="size-4 text-white/20 shrink-0" />
                  <span className="h-3 w-24 rounded bg-white/10 animate-pulse" />
                </>
              ) : isNoneSelected ? (
                <>
                  <WalletIcon className="size-4 text-white/20 shrink-0" />
                  <span className="text-[13px] text-white/30 italic truncate">
                    {noneLabel}
                  </span>
                </>
              ) : selectedWallet ? (
                <>
                  <WalletDot color={selectedWallet.color} />
                  <span className="text-[14px] font-semibold truncate">
                    {selectedWallet.name}
                  </span>
                  {showBalance && (
                    <span className="ml-1 text-[11px] font-bold text-white/35 shrink-0">
                      {formatCurrency(selectedWallet.balance, currency)}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <WalletIcon className="size-4 text-white/20 shrink-0" />
                  <span className="text-[13px] text-white/30 truncate">
                    {placeholder}
                  </span>
                </>
              )}
            </div>

            {/* Custom chevron */}
            <ChevronsUpDown className="size-4 text-white/25 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </SelectTrigger>
        </FormControl>

        {/* ── Dropdown ── */}
        <SelectContent
          className={cn(
            "rounded-2xl border border-white/8 shadow-2xl shadow-black/60 overflow-hidden p-1.5",
            "bg-[#0e1018] text-white",
            "max-h-[320px]",
          )}
          align="start"
          side="bottom"
          sideOffset={6}
        >
          {/* Loading skeletons */}
          {isLoading && (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}

          {/* None option */}
          {!isLoading && allowNone && (
            <SelectItem
              value={noneValue}
              className={cn(
                "rounded-xl px-3 py-2.5 cursor-pointer transition-colors",
                "focus:bg-white/5 focus:text-white",
                "data-[state=checked]:bg-white/5",
              )}
            >
              <div className="flex items-center gap-3">
                <WalletIcon className="size-3.5 text-white/20 shrink-0" />
                <span className="text-[13px] text-white/35 italic">
                  {noneLabel}
                </span>
                {isNoneSelected && (
                  <Check className="ml-auto size-3.5 text-white/30" />
                )}
              </div>
            </SelectItem>
          )}

          {/* Wallet list */}
          {!isLoading &&
            wallets.map((w) => (
              <SelectItem
                key={w.id}
                value={w.id}
                className={cn(
                  "rounded-xl px-3 py-2.5 cursor-pointer transition-colors",
                  "focus:bg-white/5 focus:text-white",
                  "data-[state=checked]:bg-white/4",
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <WalletDot color={w.color} />
                  <span className="text-[13px] font-medium flex-1 truncate">
                    {w.name}
                  </span>
                  {showBalance && (
                    <span className="text-[10px] font-bold text-white/30 shrink-0 tabular-nums">
                      {formatCurrency(w.balance, currency)}
                    </span>
                  )}
                  {value === w.id && (
                    <Check className="size-3.5 text-white/50 shrink-0" />
                  )}
                </div>
              </SelectItem>
            ))}

          {/* Empty state */}
          {!isLoading && wallets.length === 0 && (
            <div className="py-8 text-center">
              <WalletIcon className="mx-auto size-8 text-white/10 mb-2" />
              <p className="text-[12px] text-white/20 italic">
                No hay cuentas disponibles
              </p>
            </div>
          )}

          {/* Create new wallet */}
          {showCreateOption && (
            <>
              <div className="my-1.5 mx-1 h-px bg-white/6" />
              <SelectItem
                value="NEW_WALLET"
                className={cn(
                  "rounded-xl px-3 py-2.5 cursor-pointer transition-colors",
                  "text-indigo-400 font-bold",
                  "focus:bg-indigo-500/10 focus:text-indigo-300",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="size-5 rounded-lg flex items-center justify-center bg-indigo-500/15 shrink-0">
                    <Plus className="size-3 text-indigo-400" />
                  </span>
                  <span className="text-[13px]">Nueva Cuenta</span>
                </div>
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      <WalletDialog
        open={isWalletDialogOpen}
        onOpenChange={setIsWalletDialogOpen}
        currency={currency}
        onSuccess={(newWallet) => {
          setWallets((prev) => [...prev, newWallet]);
          onValueChange(newWallet.id);
        }}
      />
    </div>
  );
}