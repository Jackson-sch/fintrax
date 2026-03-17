"use client";

import {
  Repeat,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Trash2,
  CalendarDays,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatLongDate } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteRecurringTransaction } from "@/actions/financial-actions";
import { toast } from "sonner";
import { RecurrenceFrequency, TransactionType } from "@prisma/client";

interface RecurringCardProps {
  recurring: {
    id: string;
    description: string;
    amount: number;
    type: TransactionType;
    frequency: RecurrenceFrequency;
    startDate: Date;
    category: {
      name: string;
      color: string;
    };
  };
  currency: string;
  onEdit?: (id: string) => void;
}

const frequencyLabels: Record<RecurrenceFrequency, string> = {
  DAILY: "Diario",
  WEEKLY: "Semanal",
  BIWEEKLY: "Quincenal",
  MONTHLY: "Mensual",
  YEARLY: "Anual",
};

export function RecurringCard({ recurring, currency, onEdit }: RecurringCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar esta regla de recurrencia?")) {
      setIsDeleting(true);
      try {
        await deleteRecurringTransaction(recurring.id);
        toast.success("Recurrencia eliminada correctamente");
      } catch {
        toast.error("Error al eliminar la recurrencia");
        setIsDeleting(false);
      }
    }
  };

  const isIncome = recurring.type === "INCOME";

  return (
    <div className="relative bg-white/3 border border-white/6 rounded-2xl overflow-hidden group hover:bg-white/5 transition-all duration-300">
       {/* Subtle radial glow */}
        <div
          className={cn(
            "absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none",
            isIncome ? "bg-emerald-400" : "bg-rose-400",
          )}
        />

      <div className="px-5 pt-5 pb-4 pl-6 space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Type icon — bg only, no border */}
            <div
              className={cn(
                "shrink-0 p-2 rounded-xl",
                isIncome ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400",
              )}
            >
              {isIncome ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate group-hover:text-violet-300 transition-colors duration-200">
                {recurring.description}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: recurring.category.color }}
                />
                <span className="text-[11px] text-white/25 font-medium uppercase tracking-wide truncate">
                  {recurring.category.name}
                </span>
              </div>
            </div>
          </div>

          {/* Actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-white/20 hover:text-white hover:bg-white/8 rounded-xl transition-all"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              }
            />
            <DropdownMenuContent
              align="end"
              className="bg-[#111318] border border-white/8 text-white rounded-xl shadow-2xl"
            >
              <DropdownMenuItem
                onClick={() => onEdit?.(recurring.id)}
                className="cursor-pointer rounded-lg hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
              >
                <Pencil className="h-3.5 w-3.5 mr-2 text-blue-400" />
                Editar
              </DropdownMenuItem>
              <div className="h-px bg-white/5 my-1" />
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="cursor-pointer rounded-lg text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 focus:bg-rose-500/15 focus:text-rose-300 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                {isDeleting ? "Eliminando…" : "Eliminar"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Amount + frequency */}
        <div className="flex items-end justify-between">
          <span
            className={cn(
              "text-2xl font-black tracking-tight tabular-nums",
              isIncome ? "text-emerald-400" : "text-white",
            )}
          >
            {isIncome ? "+" : "−"}
            {formatCurrency(recurring.amount, currency)}
          </span>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-[11px] font-bold text-white/40 uppercase tracking-wide">
            <Repeat className="h-3 w-3 text-violet-400" />
            {frequencyLabels[recurring.frequency]}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-[11px] text-white/25 font-medium pt-0.5">
          <CalendarDays className="h-3.5 w-3.5 text-white/15 shrink-0" />
          <span>
            Desde el{" "}
            {formatLongDate(new Date(recurring.startDate), "d 'de' MMM, yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
}