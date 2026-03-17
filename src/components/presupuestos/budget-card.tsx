"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { BudgetProgressBar } from "./budget-progress-bar";
import { BudgetDialog } from "./budget-dialog";
import { deleteBudget } from "@/actions/financial-actions";
import { toast } from "sonner";
import { MoreVertical, Edit2, Trash2, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
      {/* radial glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none bg-emerald-400" />

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

        <DropdownMenu>
          <DropdownMenuTrigger className="p-1.5 rounded-xl text-white/20 hover:text-white hover:bg-white/10 transition-all outline-none">
            <MoreVertical className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#111318] border border-white/8 text-slate-300 rounded-xl shadow-2xl"
          >
            <DropdownMenuItem
              onClick={() => setEditOpen(true)}
              className="cursor-pointer rounded-lg hover:bg-white/10 hover:text-white focus:bg-white/10"
            >
              <Edit2 className="h-3.5 w-3.5 mr-2 text-blue-400" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteOpen(true)}
              className="cursor-pointer rounded-lg text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 focus:bg-rose-500/15 focus:text-rose-300"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#0c0e14] border border-white/8 text-white rounded-2xl shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-rose-500 via-pink-400 to-rose-600 rounded-t-2xl" />
          <AlertDialogHeader className="pt-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <Trash2 className="h-4 w-4 text-rose-400" />
              </div>
              <AlertDialogTitle className="text-lg font-bold">
                ¿Eliminar este presupuesto?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-white/35 text-sm leading-relaxed">
              Se eliminará el límite de gasto para esta categoría en este mes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-white/4 border border-white/8 text-white hover:bg-white/8 hover:text-white rounded-xl h-11">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-500 text-white border-transparent rounded-xl h-11 font-semibold shadow-lg shadow-rose-900/40"
            >
              {isDeleting ? "Eliminando…" : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
