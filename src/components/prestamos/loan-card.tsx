"use client";

import { useState } from "react";
import { LoanDialog } from "@/components/pagos/loan-dialog";
import { updateLoan, deleteLoan } from "@/actions/financial-actions";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatters";
import { Edit2, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { CardActionMenu } from "@/components/comun/card-action-menu";
import { ConfirmDeleteDialog } from "@/components/comun/confirm-delete-dialog";
import { cn } from "@/lib/utils";

export interface LoanItem {
  id: string;
  entityName: string;
  amount: number;
  paidAmount: number;
  type: "LOAN" | "COLLECTION";
  status: "ACTIVE" | "PAID" | "OVERDUE" | "CANCELLED";
  dueDate: Date | null;
  interestRate: number;
  notes: string | null;
  walletId?: string | null;
  wallet?: {
    id: string;
    name: string;
    color: string;
  } | null;
}

/* ── Status palette ── */
const STATUS: Record<string, { label: string; card: string; dot: string; text: string }> = {
  ACTIVE:  { label: "Activo",   card: "bg-blue-500/10 border-blue-400/20",     dot: "bg-blue-400",    text: "text-blue-400"    },
  PAID:    { label: "Pagado",   card: "bg-emerald-500/10 border-emerald-400/20", dot: "bg-emerald-400", text: "text-emerald-400" },
  OVERDUE: { label: "Atrasado", card: "bg-rose-500/10 border-rose-400/20",      dot: "bg-rose-400",    text: "text-rose-400"    },
};

export function LoanCard({ item, currency }: { item: LoanItem; currency: string }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editOpen,   setEditOpen]   = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const progress  = Math.min((item.paidAmount / item.amount) * 100, 100);
  const remaining = item.amount - item.paidAmount;
  const status    = STATUS[item.status] ?? STATUS.ACTIVE;
  const isCol     = item.type === "COLLECTION";

  /* accent per status / type */
  const gradient =
    item.status === "PAID"    ? "from-emerald-600 to-emerald-400"
    : item.status === "OVERDUE" ? "from-rose-600 to-rose-400"
    : isCol                     ? "from-emerald-600 to-teal-400"
    :                             "from-blue-600 to-indigo-500";

  const glow =
    item.status === "PAID"    ? "rgba(16,185,129,0.45)"
    : item.status === "OVERDUE" ? "rgba(244,63,94,0.45)"
    : isCol                     ? "rgba(16,185,129,0.45)"
    :                             "rgba(59,130,246,0.45)";

  const hoverBorder = isCol
    ? "hover:border-emerald-500/20"
    : "hover:border-blue-500/20";

  const liquidarClass = isCol
    ? "text-emerald-400 bg-emerald-500/8 border-emerald-400/20 hover:bg-emerald-500/15"
    : "text-blue-400 bg-blue-500/8 border-blue-400/20 hover:bg-blue-500/15";

  async function handleMarkAsPaid() {
    if (item.paidAmount === item.amount) {
      toast.info("Este registro ya está pagado completamente.");
      return;
    }
    setIsUpdating(true);
    try {
      await updateLoan(item.id, { paidAmount: item.amount, status: "PAID" });
      toast.success("Registro actualizado correctamente");
    } catch {
      toast.error("Error al actualizar el registro");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteLoan(item.id);
      toast.success("Registro eliminado correctamente");
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  }

  const dueDateStr = item.dueDate
    ? new Date(item.dueDate).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
    : "Sin vencimiento";

  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 backdrop-blur-xl",
      "transition-all duration-300 hover:bg-white/5 group animate-fade-in",
      hoverBorder,
    )}>
      {/* Top shimmer */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/6 to-transparent" />

      <div className="pl-6 pr-5 pt-5 pb-4 space-y-4">

        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0 pr-3">
            <h3 className="font-bold text-base text-white leading-tight truncate group-hover:text-blue-300 transition-colors duration-200">
              {item.entityName}
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-slate-600 shrink-0" />
                <span className="text-[10px] text-slate-600 font-medium">{dueDateStr}</span>
              </div>
              {item.wallet && (
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: item.wallet.color }} 
                  />
                  <span className="text-[10px] text-slate-600 font-medium truncate max-w-[80px]">
                    {item.wallet.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Status badge */}
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold",
              status.card, status.text,
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", status.dot)} />
              {status.label}
            </div>

            <CardActionMenu
              onEdit={() => setEditOpen(true)}
              onDelete={() => setDeleteOpen(true)}
              editIcon={Edit2}
            />
          </div>
        </div>

        {/* ── Amounts ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-0.5">Total</p>
            <p className="text-2xl font-bold text-white leading-none">
              {formatCurrency(item.amount, currency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-0.5">Pendiente</p>
            <p className={cn(
              "text-xl font-bold leading-none",
              remaining === 0 ? "text-emerald-400" : "text-slate-400",
            )}>
              {formatCurrency(remaining, currency)}
            </p>
          </div>
        </div>

        {/* ── Progress ── */}
        <div className="space-y-2">
          <div className="w-full bg-white/6 rounded-full h-1 overflow-hidden">
            <div
              className={cn("h-1 rounded-full bg-linear-to-r transition-all duration-700 ease-out", gradient)}
              style={{ width: `${progress}%`, boxShadow: `0 0 8px ${glow}` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-600 font-medium">{progress.toFixed(0)}% pagado</span>
              {item.interestRate > 0 && (
                <span className="text-xs text-slate-700">· {item.interestRate}% interés</span>
              )}
            </div>

            {item.status !== "PAID" && (
              <button
                onClick={handleMarkAsPaid}
                disabled={isUpdating}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border transition-all duration-200 active:scale-95 disabled:opacity-40",
                  liquidarClass,
                )}
              >
                {isUpdating
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <CheckCircle2 className="h-3 w-3" />}
                {isUpdating ? "…" : "Liquidar"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Dialogs ── */}
      <LoanDialog
        currency={currency}
        open={editOpen}
        onOpenChange={setEditOpen}
        initialData={item as any}
        hideTrigger
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="¿Eliminar este registro?"
        description="Esta acción no se puede deshacer. Los montos volverán a recalcularse en tu dashboard."
      />
    </div>
  );
}