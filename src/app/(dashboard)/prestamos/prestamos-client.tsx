"use client";

import { useState } from "react";
import {
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Plus,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { LoanDialog } from "@/components/pagos/loan-dialog";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { LoanCard } from "@/components/prestamos/loan-card";

// ── Summary stat card ─────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  valueColor = "text-white",
  icon: Icon,
  iconColor,
  iconBg,
}: {
  label: string;
  value: string;
  valueColor?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="bg-white/3 border border-white/6 rounded-2xl p-5 flex items-center gap-4">
      <div className={cn("p-2.5 rounded-xl border", iconBg)}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold mb-0.5">
          {label}
        </p>
        <p className={cn("text-xl font-bold", valueColor)}>{value}</p>
      </div>
    </div>
  );
}

// ── Tab button ────────────────────────────────────────────────────────────────
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  activeColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  count: number;
  activeColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
        active
          ? cn("text-white shadow-lg", activeColor)
          : "text-white/30 hover:text-white/60 hover:bg-white/4",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
      <span
        className={cn(
          "text-[11px] font-bold px-1.5 py-0.5 rounded-md",
          active ? "bg-white/20" : "bg-white/6 text-white/30",
        )}
      >
        {count}
      </span>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function PrestamosClient({
  initialLoans,
  currency,
}: {
  initialLoans: any[];
  currency: string;
}) {
  const [activeTab, setActiveTab] = useState<"collections" | "loans">(
    "collections",
  );

  const collections = initialLoans.filter((l) => l.type === "COLLECTION");
  const loans = initialLoans.filter((l) => l.type === "LOAN");

  const totalCollections = collections.reduce((a, c) => a + c.amount, 0);
  const collectedAmount = collections.reduce((a, c) => a + c.paidAmount, 0);
  const totalLoans = loans.reduce((a, l) => a + l.amount, 0);
  const paidLoans = loans.reduce((a, l) => a + l.paidAmount, 0);

  const isCollections = activeTab === "collections";
  const items = isCollections ? collections : loans;
  const total = isCollections ? totalCollections : totalLoans;
  const paid = isCollections ? collectedAmount : paidLoans;
  const pending = total - paid;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top bar: tabs + CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-white/3 border border-white/6 rounded-2xl">
          <TabButton
            active={isCollections}
            onClick={() => setActiveTab("collections")}
            icon={TrendingDown}
            label="Mis Cobros"
            count={collections.length}
            activeColor="bg-emerald-600 shadow-emerald-900/50"
          />
          <TabButton
            active={!isCollections}
            onClick={() => setActiveTab("loans")}
            icon={TrendingUp}
            label="Mis Préstamos"
            count={loans.length}
            activeColor="bg-amber-600 shadow-amber-900/50"
          />
        </div>

        <LoanDialog
          currency={currency}
          defaultType={isCollections ? "COLLECTION" : "LOAN"}
          trigger={
            <button className="relative overflow-hidden flex items-center gap-2 bg-linear-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-violet-900/40 transition-all duration-300 group">
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Nuevo Registro
            </button>
          }
        />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label={isCollections ? "Total a cobrar" : "Total prestado"}
          value={formatCurrency(total, currency)}
          icon={Wallet}
          iconColor={isCollections ? "text-emerald-400" : "text-amber-400"}
          iconBg={
            isCollections
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-amber-500/10 border-amber-500/20"
          }
        />
        <StatCard
          label={isCollections ? "Monto cobrado" : "Monto pagado"}
          value={formatCurrency(paid, currency)}
          valueColor="text-emerald-400"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          label="Pendiente"
          value={formatCurrency(pending, currency)}
          valueColor={pending > 0 ? "text-rose-400" : "text-emerald-400"}
          icon={pending > 0 ? AlertTriangle : CheckCircle2}
          iconColor={pending > 0 ? "text-rose-400" : "text-emerald-400"}
          iconBg={
            pending > 0
              ? "bg-rose-500/10 border-rose-500/20"
              : "bg-emerald-500/10 border-emerald-500/20"
          }
        />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.length > 0 ? (
          items.map((item) => (
            <LoanCard key={item.id} item={item} currency={currency} />
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white/2 border border-white/5 rounded-2xl gap-3">
            <div
              className={cn(
                "p-3 rounded-2xl border",
                isCollections
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : "bg-amber-500/10 border-amber-500/20",
              )}
            >
              {isCollections ? (
                <TrendingDown className="h-6 w-6 text-emerald-400 opacity-50" />
              ) : (
                <TrendingUp className="h-6 w-6 text-amber-400 opacity-50" />
              )}
            </div>
            <p className="text-white/25 text-sm font-medium">
              {isCollections
                ? "No hay cobros registrados"
                : "No hay préstamos registrados"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
