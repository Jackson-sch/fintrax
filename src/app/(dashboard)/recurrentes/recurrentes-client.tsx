"use client";

import { Header } from "@/components/sidebar/header";
import { Plus, Repeat, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { RecurringCard } from "@/components/recurrentes/recurring-card";
import { RecurringDialog } from "@/components/recurrentes/recurring-dialog";
import { RecurrenceFrequency, TransactionType } from "@prisma-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";

interface RecurringItem {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  startDate: Date;
  categoryId: string;
  category: {
    name: string;
    icon: string;
    color: string;
  };
}

interface RecurrentesClientProps {
  initialRecurring: RecurringItem[];
  categories: { id: string; name: string }[];
  currency: string;
}

export function RecurrentesClient({
  initialRecurring,
  categories,
  currency,
}: RecurrentesClientProps) {
  const [editId, setEditId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const editData = initialRecurring.find((r) => r.id === editId);

  const handleEdit = (id: string) => {
    setEditId(id);
    setIsDialogOpen(true);
  };

  const sums = initialRecurring.reduce(
    (acc, curr) => {
      if (curr.type === "INCOME") acc.income += curr.amount;
      else acc.expense += curr.amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );

  const net = sums.income - sums.expense;
  const isPositiveNet = net >= 0;
  const incomeCount = initialRecurring.filter(
    (r) => r.type === "INCOME",
  ).length;
  const expenseCount = initialRecurring.filter(
    (r) => r.type === "EXPENSE",
  ).length;

  return (
    <>
      <Header
        title="Transacciones Recurrentes"
        subtitle="Automatiza tus finanzas mensuales"
      />

      <div className="p-6 md:p-8 space-y-5 max-w-7xl mx-auto">
        {/* ── Top row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Hero card */}
          <div className="md:col-span-2 relative overflow-hidden bg-linear-to-br from-violet-600/20 via-indigo-800/10 to-slate-900/60 border border-white/8 rounded-2xl p-7 flex flex-col justify-between min-h-[220px]">
            {/* Glow */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-12 -left-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-violet-500/15 border border-violet-500/25">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                </div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                  Automatización
                </p>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Planificación financiera fija
              </h3>
              <p className="text-sm text-white/30 max-w-md leading-relaxed">
                Las recurrencias son plantillas que generan transacciones
                automáticamente según la frecuencia que definas — diaria,
                semanal, mensual o anual.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 mt-6">
              <RecurringDialog
                categories={categories}
                open={isDialogOpen && !editId}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) setEditId(null);
                }}
                trigger={
                  <Button className="relative overflow-hidden flex items-center gap-2 h-11 px-5 bg-linear-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-900/40 transition-all duration-300 group">
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Nueva Recurrencia
                  </Button>
                }
              />
              {initialRecurring.length > 0 && (
                <span className="text-xs text-white/25 font-medium">
                  {initialRecurring.length}{" "}
                  {initialRecurring.length === 1
                    ? "recurrencia activa"
                    : "recurrencias activas"}
                </span>
              )}
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-white/3 border border-white/6 rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-0.5 mb-4">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                Impacto mensual estimado
              </p>
              <p
                className={cn(
                  "text-3xl font-bold tabular-nums",
                  isPositiveNet ? "text-violet-400" : "text-amber-400",
                )}
              >
                {isPositiveNet ? "+" : ""}
                {formatCurrency(net, currency)}
              </p>
            </div>

            <div className="space-y-3">
              {/* Income row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                  </div>
                  <span className="text-xs text-white/30 font-medium">
                    Ingresos fijos
                  </span>
                  {incomeCount > 0 && (
                    <span className="text-[10px] text-white/15 bg-white/4 border border-white/6 px-1.5 py-0.5 rounded-md font-bold">
                      ×{incomeCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-emerald-400 tabular-nums">
                  +{formatCurrency(sums.income, currency)}
                </span>
              </div>

              {/* Expense row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <TrendingDown className="h-3 w-3 text-rose-400" />
                  </div>
                  <span className="text-xs text-white/30 font-medium">
                    Gastos fijos
                  </span>
                  {expenseCount > 0 && (
                    <span className="text-[10px] text-white/15 bg-white/4 border border-white/6 px-1.5 py-0.5 rounded-md font-bold">
                      ×{expenseCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-rose-400 tabular-nums">
                  -{formatCurrency(sums.expense, currency)}
                </span>
              </div>

              <div className="h-px bg-white/5" />

              {/* Net impact bar */}
              {(sums.income > 0 || sums.expense > 0) && (
                <div className="space-y-1.5">
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-linear-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(
                          (sums.income / (sums.income + sums.expense)) * 100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-white/15 font-medium">
                    <span>Ingresos</span>
                    <span>Gastos</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Recurring list ── */}
        <div className="space-y-4">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-5 w-[3px] bg-linear-to-b from-violet-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Recurrencias activas
              </h3>
            </div>
            {initialRecurring.length > 0 && (
              <span className="text-[11px] text-white/20 font-medium">
                {initialRecurring.length}{" "}
                {initialRecurring.length === 1 ? "registro" : "registros"}
              </span>
            )}
          </div>

          {/* Empty state */}
          {initialRecurring.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white/2 border border-dashed border-white/7 rounded-2xl">
              <div className="p-3 rounded-2xl bg-white/4 border border-white/6">
                <Repeat className="h-6 w-6 text-white/20" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-white/25 font-medium">
                  No hay recurrencias configuradas
                </p>
                <p className="text-xs text-white/15">
                  Crea una para automatizar tus finanzas fijas
                </p>
              </div>
              <RecurringDialog
                categories={categories}
                open={isDialogOpen && !editId}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) setEditId(null);
                }}
                trigger={
                  <Button className="relative overflow-hidden mt-1 flex items-center gap-2 h-10 px-5 bg-linear-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-900/40 transition-all duration-300 group">
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Crear primera recurrencia
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {initialRecurring.map((r) => (
                <RecurringCard
                  key={r.id}
                  recurring={r}
                  currency={currency}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit dialog (controlled externally) */}
      <RecurringDialog
        categories={categories}
        initialData={editData}
        open={isDialogOpen && !!editId}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditId(null);
        }}
      />
    </>
  );
}
