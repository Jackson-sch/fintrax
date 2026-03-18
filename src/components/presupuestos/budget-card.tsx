"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { BudgetProgressBar } from "./budget-progress-bar";
import { BudgetDialog } from "./budget-dialog";
import { deleteBudget } from "@/actions/financial-actions";
import { toast } from "sonner";
import { Edit2, AlertTriangle } from "lucide-react";
import { CardActionMenu } from "@/components/comun/card-action-menu";
import { ConfirmDeleteDialog } from "@/components/comun/confirm-delete-dialog";
import { GlowEffect } from "@/components/comun/glow-effect";

export interface BudgetItem {
  id: string;
  amount: number;
  month: number;
  year: number;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  spent: number;
}

interface BudgetCardProps {
  budget: BudgetItem;
  currency: string;
  categories: { id: string; name: string; color: string }[];
}

export function BudgetCard({ budget, currency, categories }: BudgetCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
  const remaining = budget.amount - budget.spent;
  const isOver = remaining < 0;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteBudget(budget.id);
      toast.success("Presupuesto eliminado");
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  }

  const statusLabel =
    percentage >= 100
      ? "Excedido"
      : percentage >= 80
        ? "Casi al límite"
        : "En control";

  const statusColor =
    percentage >= 100
      ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
      : percentage >= 80
        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

  return (
    <div
      className={cn(
        "relative bg-white/3 border border-white/6 rounded-2xl p-5 transition-all duration-300",
        "hover:bg-white/5 group overflow-hidden",
        percentage >= 100 && "hover:border-rose-500/20",
        percentage >= 80 && percentage < 100 && "hover:border-amber-500/20",
        percentage < 80 && "hover:border-emerald-500/20",
      )}
    >
      <GlowEffect 
        color="#34d399" 
        className="-top-24 left-1/2 -translate-x-1/2" 
        opacity={0.1}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 pl-3">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white leading-tight">
            {budget.categoryName}
          </h4>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border",
              statusColor,
            )}
          >
            {percentage >= 100 && <AlertTriangle className="h-2.5 w-2.5" />}
            {statusLabel}
          </span>
        </div>

        <CardActionMenu
          onEdit={() => setEditOpen(true)}
          onDelete={() => setDeleteOpen(true)}
          editIcon={Edit2}
          className="p-1.5"
        />
      </div>

      {/* Amounts */}
      <div className="flex items-end justify-between mb-3.5 pl-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold mb-0.5">
            Gastado
          </p>
          <p className="text-xl font-bold text-white">
            {formatCurrency(budget.spent, currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold mb-0.5">
            Límite
          </p>
          <p
            className={cn(
              "text-xl font-bold",
              isOver ? "text-rose-400" : "text-white/60",
            )}
          >
            {formatCurrency(budget.amount, currency)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="pl-3 mb-2.5">
        <BudgetProgressBar percentage={percentage} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pl-3">
        <span className="text-[11px] text-white/30 font-medium">
          {Math.min(percentage, 100).toFixed(0)}% utilizado
        </span>
        <span
          className={cn(
            "text-[11px] font-bold",
            isOver ? "text-rose-400" : "text-emerald-400",
          )}
        >
          {isOver ? "−" : ""}
          {formatCurrency(Math.abs(remaining), currency)} {isOver ? "excedido" : "restante"}
        </span>
      </div>

      {/* Edit dialog */}
      <BudgetDialog
        categories={categories}
        currency={currency}
        initialData={budget}
        open={editOpen}
        onOpenChange={setEditOpen}
        hideTrigger
      />

      {/* Delete dialog */}
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="¿Eliminar este presupuesto?"
        description="Se eliminará el límite de gasto para esta categoría en este mes."
      />
    </div>
  );
}
