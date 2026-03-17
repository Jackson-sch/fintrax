"use client";

import { useState } from "react";
import { BudgetSummary } from "@/components/presupuestos/budget-summary";
import { BudgetCard, BudgetItem } from "@/components/presupuestos/budget-card";
import { BudgetDialog } from "@/components/presupuestos/budget-dialog";
import { cn } from "@/lib/utils";
import { Wallet, ChevronLeft, ChevronRight } from "lucide-react";

interface PresupuestosClientProps {
  initialBudgets: BudgetItem[];
  categories: { id: string; name: string; color: string }[];
  currency: string;
  currentMonth: number;
  currentYear: number;
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function PresupuestosClient({
  initialBudgets,
  categories,
  currency,
  currentMonth,
  currentYear,
}: PresupuestosClientProps) {
  const totalBudget = initialBudgets.reduce((a, b) => a + b.amount, 0);
  const totalSpent = initialBudgets.reduce((a, b) => a + b.spent, 0);

  return (
    <div className="p-6 md:p-8 space-y-5 max-w-7xl mx-auto">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-2 bg-white/3 border border-white/6 rounded-xl">
            <span className="text-sm font-semibold text-white">
              {MONTH_NAMES[currentMonth - 1]} {currentYear}
            </span>
          </div>
        </div>

        <BudgetDialog categories={categories} currency={currency} />
      </div>

      {/* Summary */}
      <BudgetSummary
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        currency={currency}
      />

      {/* Budget cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {initialBudgets.length > 0 ? (
          initialBudgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              currency={currency}
              categories={categories}
            />
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white/2 border border-white/5 rounded-2xl gap-3">
            <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20">
              <Wallet className="h-6 w-6 text-violet-400 opacity-50" />
            </div>
            <p className="text-white/25 text-sm font-medium">
              No hay presupuestos configurados para este mes
            </p>
            <p className="text-white/15 text-xs">
              Crea un presupuesto para controlar tus gastos por categoría
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
