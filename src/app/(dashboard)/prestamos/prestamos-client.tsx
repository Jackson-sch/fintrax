"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  MoreVertical,
  Edit2,
  Trash2,
  TrendingDown,
  TrendingUp,
  Plus,
  Wallet,
  Clock,
  AlertTriangle,
} from "lucide-react";
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

interface LoanItem {
  id: string;
  entityName: string;
  amount: number;
  paidAmount: number;
  interestRate: number;
  dueDate: Date | null | string;
  status: string;
  type: string;
  notes?: string | null;
}

const statusConfig: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  ACTIVE: {
    label: "Activo",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    dot: "bg-blue-400",
  },
  PAID: {
    label: "Pagado",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    dot: "bg-emerald-400",
  },
  OVERDUE: {
    label: "Atrasado",
    className: "bg-rose-500/15 text-rose-400 border-rose-500/25",
    dot: "bg-rose-400",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-slate-500/15 text-slate-400 border-slate-500/25",
    dot: "bg-slate-500",
  },
};

function LoanCard({ item, currency }: { item: LoanItem; currency: string }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const progress = Math.min((item.paidAmount / item.amount) * 100, 100);
  const remaining = item.amount - item.paidAmount;
  const status = statusConfig[item.status] || statusConfig.ACTIVE;
  const isCollection = item.type === "COLLECTION";

  async function handleMarkAsPaid() {
    setIsUpdating(true);
    try {
      await updateLoan(item.id, { paidAmount: item.amount, status: "PAID" });
      toast.success("Marcado como pagado");
    } catch {
      toast.error("Error al actualizar");
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

  const accentGradient =
    item.status === "PAID"
      ? "from-emerald-600 to-emerald-400"
      : item.status === "OVERDUE"
        ? "from-rose-600 to-rose-400"
        : isCollection
          ? "from-emerald-600 to-teal-400"
          : "from-amber-600 to-orange-400";

  const glowColor =
    item.status === "PAID"
      ? "rgba(16,185,129,0.5)"
      : item.status === "OVERDUE"
        ? "rgba(244,63,94,0.5)"
        : isCollection
          ? "rgba(16,185,129,0.5)"
          : "rgba(245,158,11,0.5)";

  const cardAccentBorder = isCollection
    ? "hover:border-emerald-500/20"
    : "hover:border-amber-500/20";

  return (
    <div
      className={cn(
        "relative bg-white/3 border border-white/6 rounded-2xl p-5 transition-all duration-300",
        "hover:bg-white/5",
        cardAccentBorder,
        "group overflow-hidden",
      )}
    >
      {/* Left accent bar */}
      <div
        className={cn(
          "absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-linear-to-b opacity-60",
          accentGradient,
        )}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-4 pl-3">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-white leading-tight">
            {item.entityName}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <Clock className="h-3 w-3" />
            {item.dueDate
              ? new Date(item.dueDate).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Sin vencimiento"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "rounded-full text-[11px] font-semibold px-2.5 py-0.5 flex items-center gap-1.5",
              status.className,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
            {status.label}
          </Badge>

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
      </div>

      {/* Amounts */}
      <div className="flex items-end justify-between mb-3.5 pl-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold mb-0.5">
            Total
          </p>
          <p className="text-xl font-bold text-white">
            {formatCurrency(item.amount, currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold mb-0.5">
            Pendiente
          </p>
          <p
            className={cn(
              "text-xl font-bold",
              remaining === 0 ? "text-emerald-400" : "text-white/60",
            )}
          >
            {formatCurrency(remaining, currency)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="pl-3 mb-2.5">
        <div className="w-full bg-white/6 rounded-full h-1.5 overflow-hidden">
          <div
            className={cn(
              "h-1.5 rounded-full bg-linear-to-r transition-all duration-700",
              accentGradient,
            )}
            style={{
              width: `${progress}%`,
              boxShadow: `0 0 10px ${glowColor}`,
            }}
          />
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between pl-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-white/30 font-medium">
            {progress.toFixed(0)}% pagado
          </span>
          {item.interestRate > 0 && (
            <span className="text-[11px] text-white/20 font-medium">
              · {item.interestRate}% interés
            </span>
          )}
        </div>

        {item.status !== "PAID" && (
          <button
            onClick={handleMarkAsPaid}
            disabled={isUpdating}
            className={cn(
              "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border transition-all duration-200 active:scale-95 disabled:opacity-40",
              isCollection
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                : "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20",
            )}
          >
            <CheckCircle2 className="h-3 w-3" />
            {isUpdating ? "..." : "Liquidar"}
          </button>
        )}
      </div>

      {/* Dialogs */}
      <LoanDialog
        currency={currency}
        open={editOpen}
        onOpenChange={setEditOpen}
        initialData={item as any}
        hideTrigger
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#0c0e14] border border-white/8 text-white rounded-2xl shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-rose-500 via-pink-400 to-rose-600 rounded-t-2xl" />
          <AlertDialogHeader className="pt-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <Trash2 className="h-4 w-4 text-rose-400" />
              </div>
              <AlertDialogTitle className="text-lg font-bold">
                ¿Eliminar este registro?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-white/35 text-sm leading-relaxed">
              Esta acción no se puede deshacer. Los montos se recalcularán
              automáticamente en tu dashboard.
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
