"use client";

import { 
  Target, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Plus,
  Calendar,
  ChevronRight
} from "lucide-react";
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
import { useState } from "react";
import { deleteSavingGoal } from "@/actions/financial-actions";
import { toast } from "sonner";
import { GoalProgressBar } from "./goal-progress-bar";

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
        {/* Background glow base on goal color */}
        <div 
          className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-[60px] opacity-10 transition-opacity duration-700 group-hover:opacity-20"
          style={{ backgroundColor: goal.color }}
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

          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-xl text-white/20 hover:text-white/60 hover:bg-white/5 transition-all outline-none">
              <MoreVertical className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0c0e14] border-white/10 text-white">
              <DropdownMenuItem onClick={() => onEdit(goal.id)} className="gap-2 focus:bg-white/5 cursor-pointer text-xs font-medium">
                <Pencil className="h-3.5 w-3.5" /> Editar meta
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2 focus:bg-rose-500/10 text-rose-400 focus:text-rose-400 cursor-pointer text-xs font-medium"
              >
                <Trash2 className="h-3.5 w-3.5" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#0c0e14] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar meta de ahorro?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40">
              Perderás el seguimiento del progreso de "{goal.name}". Los fondos ahorrados ya registrados no se verán afectados en tu balance general.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
