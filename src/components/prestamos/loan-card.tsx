"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { LoanDialog } from "@/components/pagos/loan-dialog";
import { updateLoan, deleteLoan } from "@/actions/financial-actions";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
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
import { CheckCircle2 } from "lucide-react";

export interface LoanItem {
  id: string;
  entityName: string;
  amount: number;
  paidAmount: number;
  type: string;
  status: string;
  dueDate: Date | null;
  interestRate: number;
  notes: string | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Activo",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  PAID: {
    label: "Pagado",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  OVERDUE: {
    label: "Atrasado",
    className: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  },
};

export function LoanCard({
  item,
  currency,
}: {
  item: LoanItem;
  currency: string;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const progress = (item.paidAmount / item.amount) * 100;
  const remaining = item.amount - item.paidAmount;
  const status = statusConfig[item.status] || statusConfig.ACTIVE;

  async function handleUpdatePaidAmount() {
    setIsUpdating(true);
    try {
      if (item.paidAmount === item.amount) {
        toast.info("Este registro ya está pagado completamente.");
        return;
      }
      await updateLoan(item.id, {
        paidAmount: item.amount,
        status: "PAID",
      });
      toast.success("Registro actualizado correctamente");
    } catch (error) {
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
    } catch (error) {
      toast.error("Error al eliminar");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  }

  const progressColor =
    item.status === "PAID"
      ? "from-emerald-600 to-emerald-400"
      : item.status === "OVERDUE"
        ? "from-rose-600 to-rose-400"
        : "from-blue-600 to-indigo-500";

  return (
    <div className="glass-panel p-6 rounded-3xl animate-fade-in relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
            {item.entityName}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Vencimiento:{" "}
            {item.dueDate
              ? new Date(item.dueDate).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })
              : "Sin fecha"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`${status.className} rounded-full text-xs font-medium px-3 py-1`}
          >
            {status.label}
          </Badge>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10 outline-none">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#111318] border-white/10 text-slate-300"
            >
              <div className="px-2 py-1.5 text-sm font-semibold text-slate-400">
                Acciones
              </div>
              <div className="-mx-1 my-1 h-px bg-white/10" />
              <DropdownMenuItem
                onClick={() => setEditOpen(true)}
                className="hover:bg-white/10! cursor-pointer"
              >
                <Edit2 className="h-4 w-4 mr-2" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="hover:bg-rose-500/20! hover:text-rose-400! cursor-pointer text-rose-400"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1">Total</p>
          <p className="text-2xl font-bold tracking-tight text-white flex items-baseline gap-1">
            {formatCurrency(item.amount, currency).split(" ")[0]}
            <span className="text-sm font-medium text-slate-400">
              {currency}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 font-medium mb-1">Pendiente</p>
          <p className="text-lg font-bold text-slate-200">
            {formatCurrency(remaining, currency)}
          </p>
        </div>
      </div>

      <div className="w-full bg-slate-800/50 rounded-full h-2.5 mb-2 overflow-hidden border border-white/5">
        <div
          className={`bg-linear-to-r ${progressColor} h-2.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-500">
        <span className="font-medium">{progress.toFixed(0)}% pagado</span>
        {item.interestRate > 0 && (
          <span className="font-medium text-slate-400">
            Interés: {item.interestRate}%
          </span>
        )}
      </div>

      {item.status !== "PAID" && (
        <button
          onClick={handleUpdatePaidAmount}
          disabled={isUpdating}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isUpdating ? (
            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Marcar como Pagado
            </>
          )}
        </button>
      )}

      {item.interestRate > 0 && (
        <p className="text-[10px] text-slate-600 mt-1">
          Interés: {item.interestRate}%
        </p>
      )}

      <LoanDialog
        currency={currency}
        open={editOpen}
        onOpenChange={setEditOpen}
        initialData={item as any}
        hideTrigger={true}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#0c0e14] border-white/10 text-white shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este registro?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Esta acción no se puede deshacer. Los montos volverán a
              recalcularse en tu dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-500 text-white border-transparent"
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Sí, Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
