"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  Edit2,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { TransactionDialog } from "@/components/transacciones/transaction-dialog";
import { deleteTransaction } from "@/actions/financial-actions";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";

const statusConfig = {
  COMPLETED: {
    label: "Completado",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    dot: "bg-emerald-400",
  },
  PENDING: {
    label: "Pendiente",
    className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
    dot: "bg-yellow-400",
  },
  OVERDUE: {
    label: "Atrasado",
    className: "bg-rose-500/15 text-rose-400 border-rose-500/25",
    dot: "bg-rose-400",
  },
};

export function TransactionRow({
  transaction: tx,
  currency,
  categories,
  wallets,
  tags,
}: {
  transaction: any;
  currency: string;
  categories: any[];
  wallets: any[];
  tags: any[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const status =
    statusConfig[tx.status as keyof typeof statusConfig] ??
    statusConfig.COMPLETED;
  const isIncome = tx.type === "INCOME";

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteTransaction(tx.id);
      toast.success("Transacción eliminada correctamente");
    } catch {
      toast.error("Error al eliminar la transacción");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  }

  return (
    <>
      <tr className="group border-b border-white/4 hover:bg-white/2.5 transition-colors duration-150">
        {/* Type indicator + Description */}
        <td className="px-3 md:px-5 py-3.5">
          <div className="flex items-center gap-3">
            {/* Type icon pill */}
            <div
              className={cn(
                "shrink-0 p-1.5 rounded-xl border",
                isIncome
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400",
              )}
            >
              {isIncome ? (
                <ArrowDownLeft className="h-3.5 w-3.5" />
              ) : (
                <ArrowUpRight className="h-3.5 w-3.5" />
              )}
            </div>
            <span className="text-sm font-semibold text-white truncate max-w-[180px]">
              {tx.description}
            </span>
          </div>
        </td>

        {/* Category */}
        <td className="px-5 py-3.5">
          <span className="text-xs font-medium text-white/30 bg-white/4 border border-white/6 px-2.5 py-1 rounded-lg">
            {tx.category?.name ?? "Sin categoría"}
          </span>
        </td>

        {/* Date */}
        <td className="px-5 py-3.5">
          <span className="text-sm text-white/30 tabular-nums">
            {new Date(tx.date).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </td>

        {/* Amount */}
        <td className="px-5 py-3.5 text-right">
          <span
            className={cn(
              "text-sm font-bold tabular-nums",
              isIncome ? "text-emerald-400" : "text-rose-400",
            )}
          >
            {isIncome ? "+" : "−"}
            {formatCurrency(tx.amount, currency)}
          </span>
        </td>

        {/* Status */}
        <td className="px-3 md:px-5 py-3.5 text-center">
          <Badge
            variant="outline"
            className={cn(
              "rounded-full text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 flex items-center gap-1.5 w-fit mx-auto",
              status.className,
            )}
          >
            <span
              className={cn("h-1.5 w-1.5 rounded-full shrink-0", status.dot)}
            />
            {status.label}
          </Badge>
        </td>

        {/* Actions */}
        <td className="px-3 md:px-5 py-3.5 text-center">
          <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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
                  className="cursor-pointer rounded-lg hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
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
        </td>
      </tr>

      {/* Edit dialog */}
      <TransactionDialog
        categories={categories}
        wallets={wallets}
        tags={tags}
        currency={currency}
        initialData={tx}
        open={editOpen}
        onOpenChange={setEditOpen}
        hideTrigger
      />

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#0c0e14] border border-white/8 text-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-rose-500 via-pink-400 to-rose-600" />
          <AlertDialogHeader className="pt-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <Trash2 className="h-4 w-4 text-rose-400" />
              </div>
              <AlertDialogTitle className="text-lg font-bold">
                ¿Eliminar esta transacción?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-white/35 text-sm leading-relaxed">
              Esta acción no se puede deshacer. El balance de tu cuenta se
              ajustará automáticamente.
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
    </>
  );
}
