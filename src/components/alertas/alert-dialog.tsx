"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Bell, CheckCircle2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ALERT_TYPES = [
  { value: "SPENDING_LIMIT", label: "Límite de Gasto", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  { value: "INCOME_ALERT", label: "Aviso de Ingresos", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { value: "LOAN_DUE_DATE", label: "Fecha de Préstamo", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { value: "LOW_BALANCE", label: "Saldo Bajo", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { value: "BUDGET_EXCEEDED", label: "Presupuesto Excedido", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
];

interface AlertDialogProps {
  onSubmit: (type: string, threshold: number) => Promise<void>;
  currency: string;
  editMode?: {
    alertId: string;
    currentThreshold: number;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

export function AlertDialog({
  onSubmit,
  currency,
  editMode,
  open: controlledOpen,
  onOpenChange,
  hideTrigger,
}: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(ALERT_TYPES[0].value);
  const [threshold, setThreshold] = useState(editMode?.currentThreshold || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (threshold <= 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(selectedType, threshold);
      setOpen(false);
      setThreshold(0);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputCls = cn(
    "bg-white/4 border border-white/8 text-white h-14 rounded-2xl transition-all",
    "hover:bg-white/6 hover:border-white/12",
    "focus:bg-white/7 focus:border-white/20",
    "placeholder:text-white/20",
    "focus-visible:ring-amber-500/40",
  );

  const defaultTrigger = (
    <Button className="relative overflow-hidden bg-linear-to-br from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white rounded-2xl shadow-lg shadow-amber-900/40 px-6 py-5 font-semibold tracking-wide transition-all duration-300 group">
      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
      {editMode ? "Editar Umbral" : "Nueva Alerta"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && <DialogTrigger render={defaultTrigger} />}

      <DialogContent
        className={cn(
          "sm:max-w-[420px] bg-[#0c0e14] border border-white/6 text-white p-0 overflow-hidden rounded-3xl shadow-2xl",
          "shadow-amber-500/20",
        )}
      >
        {/* Top strip */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-amber-500 via-orange-400 to-amber-600" />

        <div className="relative z-10 px-8 pt-8 pb-7 space-y-6">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-[1.6rem] font-bold tracking-tight text-white">
                  {editMode ? "Editar umbral" : "Nueva alerta"}
                </DialogTitle>
                <p className="text-sm text-white/30 font-medium">
                  {editMode ? "Ajusta el umbral de esta alerta" : "Configura una alerta inteligente"}
                </p>
              </div>
              <div className="p-2.5 rounded-2xl border bg-amber-500/10 border-amber-500/30">
                <Bell className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type selector (only for new alerts) */}
            {!editMode && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/30">
                  Tipo de Alerta
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {ALERT_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSelectedType(type.value)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left",
                        selectedType === type.value
                          ? `${type.bg} ${type.color} shadow-lg`
                          : "bg-white/3 border-white/6 text-white/40 hover:bg-white/6 hover:text-white/70",
                      )}
                    >
                      <Bell className="h-4 w-4 shrink-0" />
                      <span className="truncate">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Threshold amount */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30">
                Umbral
              </label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/25 bg-white/6 border border-white/8 px-2 py-0.5 rounded-md pointer-events-none">
                  {currency}
                </span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={threshold || ""}
                  onChange={(e) => setThreshold(parseFloat(e.target.value) || 0)}
                  className={cn(inputCls, "pl-14 text-xl font-bold")}
                />
              </div>
            </div>

            <div className="border-t border-white/5" />

            <Button
              type="submit"
              disabled={isSubmitting || threshold <= 0}
              className={cn(
                "w-full text-white font-bold py-7 rounded-2xl text-base tracking-wide transition-all duration-300",
                "border border-white/8 shadow-xl",
                "bg-amber-600 hover:bg-amber-500 shadow-amber-700/40",
                "relative overflow-hidden group",
              )}
            >
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Guardando…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    {editMode ? "Guardar cambios" : "Crear alerta"}
                  </>
                )}
              </span>
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
