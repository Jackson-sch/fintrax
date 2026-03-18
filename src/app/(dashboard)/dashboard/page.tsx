import { Header } from "@/components/sidebar/header";
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Wallet,
  PiggyBank,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  getDashboardData,
  getCategories,
  getSession,
  getWallets,
  getTags,
} from "@/actions/financial-actions";
import { TransactionDialog } from "@/components/transacciones/transaction-dialog";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Panel de Control | Fintrax",
  description: "Visualiza tu rendimiento financiero en tiempo real.",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  let data;
  let categories = [];
  let wallets = [];
  let tags = [];
  try {
    data = await getDashboardData();
    categories = await getCategories();
    wallets = await getWallets();
    tags = await getTags();
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-white/50">Error al cargar los datos del panel.</p>
      </div>
    );
  }

  const {
    balance,
    monthlyIncome,
    monthlyExpense,
    savingRate,
    recentTransactions,
    currency,
  } = data;

  const netMonthly = monthlyIncome - monthlyExpense;
  const isPositiveBalance = balance >= 0;
  const isPositiveNet = netMonthly >= 0;

  return (
    <>
      <Header
        title="Panel de Control"
        subtitle="Visualiza tu rendimiento financiero en tiempo real."
      />

      <div className="p-6 md:p-8 space-y-5 max-w-7xl mx-auto">
        {/* ── Top row: Balance hero + stat cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Balance hero */}
          <div className="relative overflow-hidden bg-linear-to-br from-violet-600/25 via-indigo-800/20 to-slate-900/60 border border-white/8 rounded-2xl p-7 flex flex-col justify-between min-h-[240px]">
            {/* Glow orbs */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25">
                  <Wallet className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                  Saldo Disponible
                </p>
              </div>
              <h3
                className={cn(
                  "text-4xl font-bold tracking-tight",
                  isPositiveBalance ? "text-white" : "text-amber-400",
                )}
              >
                {formatCurrency(balance, currency)}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-white/25 font-medium">
                  {isPositiveBalance
                    ? "Saldo positivo"
                    : "Saldo negativo — revisa tus gastos"}
                </p>
                <span className="text-white/10">•</span>
                <p className="text-[10px] text-violet-400/80 font-bold uppercase tracking-tight">
                  Patrimonio Neto: {formatCurrency(data.netWorth, currency)}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="relative z-10 flex gap-2 mt-6">
              <TransactionDialog
                categories={categories}
                wallets={wallets as any}
                tags={tags}
                defaultType="INCOME"
                currency={currency}
                trigger={
                  <button className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-emerald-500/25 text-sm">
                    <ArrowDownLeft className="h-4 w-4" />
                    Ingreso
                  </button>
                }
              />
              <TransactionDialog
                categories={categories}
                wallets={wallets as any}
                tags={tags}
                defaultType="EXPENSE"
                currency={currency}
                trigger={
                  <button className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-rose-500/25 text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    Gasto
                  </button>
                }
              />
            </div>
          </div>

          {/* Stat cards — 2x2 grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly income */}
            <div className="bg-white/3 border border-white/6 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  Ingresos del mes
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(monthlyIncome, currency)}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <PiggyBank className="h-3 w-3 text-emerald-400/60" />
                  <p className="text-xs text-white/25">
                    Tasa de ahorro:{" "}
                    <span className="text-emerald-400 font-semibold">
                      {savingRate.toFixed(1)}%
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Monthly expense */}
            <div className="bg-white/3 border border-white/6 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <TrendingDown className="h-4 w-4 text-rose-400" />
                </div>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  Gastos del mes
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(monthlyExpense, currency)}
                </p>
                <p className="text-xs text-white/25 mt-2">
                  Saldo neto:{" "}
                  <span
                    className={
                      isPositiveNet
                        ? "text-emerald-400 font-semibold"
                        : "text-rose-400 font-semibold"
                    }
                  >
                    {isPositiveNet ? "+" : ""}
                    {formatCurrency(netMonthly, currency)}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick add — spans full width on sm */}
            <div className="sm:col-span-2 bg-white/2 border border-dashed border-white/6 rounded-2xl p-4 flex items-center justify-between gap-4 hover:bg-white/4 hover:border-white/14 transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <Plus className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/60 group-hover:text-white/80 transition-colors">
                    Registrar nuevo movimiento
                  </p>
                  <p className="text-xs text-white/20">
                    Ingreso, gasto o transferencia
                  </p>
                </div>
              </div>
              <TransactionDialog
                categories={categories}
                wallets={wallets as any}
                currency={currency}
                trigger={
                  <button className="relative overflow-hidden shrink-0 flex items-center gap-2 h-10 px-4 bg-linear-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-900/40 transition-all duration-300 group/btn">
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Nueva
                  </button>
                }
              />
            </div>
          </div>
        </div>

        {/* ── Recent transactions ── */}
        <div className="bg-white/2 border border-white/6 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h3 className="text-sm font-bold text-white">
              Transacciones recientes
            </h3>
            <a
              href="/transacciones"
              className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Ver todas
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* List */}
          <div className="divide-y divide-white/4">
            {recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14">
                <div className="p-3 rounded-2xl bg-white/4 border border-white/6">
                  <Wallet className="h-6 w-6 text-white/20" />
                </div>
                <p className="text-sm text-white/20 font-medium">
                  No hay transacciones aún
                </p>
              </div>
            ) : (
              recentTransactions.map((tx) => {
                const isPositive = tx.type === "INCOME";
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-white/25 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Type icon */}
                      <div
                        className={cn(
                          "p-2.5 rounded-xl border transition-all duration-200",
                          isPositive
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/15"
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400 group-hover:bg-rose-500/15",
                        )}
                      >
                        {isPositive ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <p className="text-sm font-semibold text-white leading-tight">
                          {tx.description}
                        </p>
                        <p className="text-xs text-white/25 mt-0.5 flex items-center gap-1.5">
                          <span className="bg-white/5 border border-white/7 px-2 py-0.5 rounded-md text-[10px] font-medium">
                            {tx.category?.name ?? "Sin categoría"}
                          </span>
                          <span>
                            {new Date(tx.date).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <span
                      className={cn(
                        "text-sm font-bold tabular-nums",
                        isPositive ? "text-emerald-400" : "text-rose-400",
                      )}
                    >
                      {isPositive ? "+" : "−"}
                      {formatCurrency(tx.amount, currency)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {recentTransactions.length > 0 && (
            <div className="px-6 py-3 border-t border-white/4 flex items-center justify-between">
              <p className="text-[11px] text-white/20 font-medium">
                Mostrando {recentTransactions.length} movimientos recientes
              </p>
              <a
                href="/transacciones"
                className="text-[11px] font-semibold text-violet-400/70 hover:text-violet-300 transition-colors"
              >
                Ver historial completo →
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
