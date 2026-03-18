"use client";

import { 
  Plus,
  Calendar,
  ChevronRight,
  Pencil,
  Target
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { CardActionMenu } from "@/components/comun/card-action-menu";
import { GlowEffect } from "@/components/comun/glow-effect";
import { useState } from "react";
import { deleteSavingGoal } from "@/actions/financial-actions";
import { toast } from "sonner";
import { GoalProgressBar } from "./goal-progress-bar";
import { ConfirmDeleteDialog } from "@/components/comun/confirm-delete-dialog";

interface GoalCardProps {
  goal: {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: Date | null;
    color: string;
    icon: string;
  };
  currency: string;
  onEdit: (id: string) => void;
  onAddFunds: (id: string) => void;
}

export function GoalCard({ goal, currency, onEdit, onAddFunds }: GoalCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSavingGoal(goal.id);
      toast.success("Meta de ahorro eliminada");
    } catch (error) {
      toast.error("Error al eliminar la meta");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

  return (
    <>
      <div className="group relative bg-white/3 border border-white/6 rounded-3xl p-6 hover:bg-white/5 transition-all duration-300 overflow-hidden">
        <GlowEffect 
          color={goal.color} 
          className="-right-12 -top-12 group-hover:opacity-20" 
          size="w-32 h-32"
          opacity={0.1}
        />

        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div 
              className="p-3.5 rounded-2xl border flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
              style={{ 
                backgroundColor: `${goal.color}15`,
                borderColor: `${goal.color}30`,
                color: goal.color 
              }}
            >
              <Target className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xl tracking-tight leading-tight">
                {goal.name}
              </h3>
              {goal.deadline && (
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  Meta: {new Date(goal.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <CardActionMenu
            onEdit={() => onEdit(goal.id)}
            onDelete={() => setShowDeleteDialog(true)}
            editIcon={Pencil}
            editLabel="Editar meta"
          />
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Ahorrado</span>
              <p className="text-2xl font-black text-white tabular-nums">
                {formatCurrency(goal.currentAmount, currency)}
              </p>
            </div>
            <div className="text-right space-y-1">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Objetivo</span>
              <p className="text-sm font-bold text-white/60 tabular-nums">
                {formatCurrency(goal.targetAmount, currency)}
              </p>
            </div>
          </div>

          <GoalProgressBar 
            current={goal.currentAmount} 
            target={goal.targetAmount} 
            color={goal.color} 
          />

          <div className="flex items-center gap-3 pt-2">
            <button 
              onClick={() => onAddFunds(goal.id)}
              className="flex-1 h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 group/btn"
              disabled={goal.currentAmount >= goal.targetAmount}
            >
              <Plus className="h-3.5 w-3.5 transition-transform group-hover/btn:rotate-90" />
              Abonar Capital
            </button>
            
            <div className="h-11 w-11 shrink-0 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/30">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-3xl bg-linear-to-tr from-transparent via-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="¿Eliminar meta de ahorro?"
        description={`Perderás el seguimiento del progreso de "${goal.name}". Los fondos ahorrados ya registrados no se verán afectados en tu balance general.`}
      />
    </>
  );
}
