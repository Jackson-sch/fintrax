"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import {
  updateAlertSettings,
  createAlert,
} from "@/actions/financial-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCard } from "@/components/alertas/alert-card";
import { AlertDialog } from "@/components/alertas/alert-dialog";
import { SecurityCard } from "@/components/alertas/security-card";

interface AlertItem {
  id: string;
  type: string;
  threshold: number;
  enabled: boolean;
}

const alertTypeConfig: Record<string, any> = {
  SPENDING_LIMIT: {
    label: "Límite de Gasto",
    description: "Notificar cuando los gastos mensuales superen el límite",
    icon: Bell,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
  },
  INCOME_ALERT: {
    label: "Aviso de Ingresos",
    description: "Notificar al recibir depósitos mayores al umbral",
    icon: Bell,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  LOAN_DUE_DATE: {
    label: "Fecha de Préstamo",
    description: "Recordatorio antes del vencimiento de un pago",
    icon: Bell,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  LOW_BALANCE: {
    label: "Saldo Bajo",
    description: "Alerta cuando el balance total sea menor al umbral",
    icon: Bell,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  BUDGET_EXCEEDED: {
    label: "Presupuesto Excedido",
    description: "Notificar si una categoría supera su presupuesto",
    icon: Bell,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
};

export function AlertasClient({
  initialAlerts,
  initialCurrency,
}: {
  initialAlerts: AlertItem[];
  initialCurrency: string;
}) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{ alertId: string; currentThreshold: number } | null>(null);
  const currency = initialCurrency;
  const router = useRouter();

  const toggleAlert = async (id: string, currentEnabled: boolean) => {
    try {
      const newEnabled = !currentEnabled;
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, enabled: newEnabled } : a)),
      );
      await updateAlertSettings(id, newEnabled);
      toast.success("Ajuste de alerta actualizado");
    } catch {
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, enabled: currentEnabled } : a)),
      );
      toast.error("Error al actualizar la alerta");
    }
  };

  const handleEditThreshold = (id: string, currentThreshold: number) => {
    setEditTarget({ alertId: id, currentThreshold });
    setEditDialogOpen(true);
  };

  const handleCreateAlert = async (type: string, threshold: number) => {
    try {
      const newAlert = await createAlert(type, threshold);
      setAlerts((prev) => [...prev, newAlert]);
      toast.success("Alerta creada");
      router.refresh();
    } catch {
      toast.error("Error al crear la alerta");
    }
  };

  const handleUpdateThreshold = async (_type: string, threshold: number) => {
    if (!editTarget) return;
    try {
      const alert = alerts.find((a) => a.id === editTarget.alertId);
      if (!alert) return;
      await updateAlertSettings(editTarget.alertId, alert.enabled, threshold);
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === editTarget.alertId ? { ...a, threshold } : a,
        ),
      );
      toast.success("Umbral actualizado");
      setEditTarget(null);
    } catch {
      toast.error("Error al actualizar el umbral");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-5xl mx-auto">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Bell className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Alertas Inteligentes</h2>
        </div>
        <AlertDialog onSubmit={handleCreateAlert} currency={currency} />
      </div>

      {/* Alert cards */}
      <section className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => {
            const config =
              alertTypeConfig[alert.type] || alertTypeConfig.SPENDING_LIMIT;
            return (
              <AlertCard
                key={alert.id}
                alert={alert}
                config={config}
                currency={currency}
                onToggle={toggleAlert}
                onEditThreshold={handleEditThreshold}
              />
            );
          })
        ) : (
          <div className="bg-white/3 p-8 text-center rounded-2xl border border-white/5">
            <p className="text-slate-500 italic">
              No tienes alertas configuradas aún. Crea una alerta para comenzar a monitorear tus finanzas.
            </p>
          </div>
        )}
      </section>

      {/* Edit threshold dialog */}
      {editTarget && (
        <AlertDialog
          onSubmit={handleUpdateThreshold}
          currency={currency}
          editMode={editTarget}
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setEditTarget(null);
          }}
          hideTrigger
        />
      )}

      {/* Security card */}
      <SecurityCard />
    </div>
  );
}
