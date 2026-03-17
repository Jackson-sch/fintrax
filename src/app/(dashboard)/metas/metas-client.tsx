"use client";

import { Header } from "@/components/sidebar/header";
import { Plus, Target, TrendingUp, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";
import { GoalCard } from "@/components/metas/goal-card";
import { GoalDialog } from "@/components/metas/goal-dialog";
import { AddFundsDialog } from "@/components/metas/add-funds-dialog";
import { cn } from "@/lib/utils";

interface GoalItem {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date | null;
  color: string;
  icon: string;
}

interface MetasClientProps {
  initialGoals: GoalItem[];
  currency: string;
  wallets?: { id: string; name: string; color: string; balance: number }[];
}

export function MetasClient({ initialGoals, currency, wallets = [] }: MetasClientProps) {
  const [editId, setEditId] = useState<string | null>(null);
  const [addFundsId, setAddFundsId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const editData = initialGoals.find((g) => g.id === editId);
  const addFundsGoal = initialGoals.find((g) => g.id === addFundsId);

  const totalTarget = initialGoals.reduce(
    (acc, curr) => acc + curr.targetAmount,
    0,
  );
  const totalSaved = initialGoals.reduce(
    (acc, curr) => acc + curr.currentAmount,
    0,
  );
  const overallPercentage =
    totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <>
      <Header
        title="Metas de Ahorro"
        subtitle="Construye tu futuro paso a paso"
      />

      <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto">
        {/* Bento Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 bg-linear-to-br from-blue-600/20 via-indigo-600/10 to-transparent border border-white/6 rounded-[40px] p-10 relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-blue-400 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" /> Disciplina Financiera
              </div>
              <h2 className="text-4xl font-black text-white leading-tight">
                Tus sueños tienen <br />{" "}
                <span className="text-blue-400">un plan.</span>
              </h2>
              <p className="text-sm text-white/40 max-w-sm font-medium leading-relaxed">
                Estás a{" "}
                <span className="text-white">{100 - overallPercentage}%</span>{" "}
                de completar el total de tus objetivos actuales. Mantén el ritmo
                y alcanza la libertad financiera.
              </p>
            </div>

            <div className="relative z-10 pt-8 flex items-center gap-4">
              <GoalDialog
                open={isDialogOpen && !editId}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) setEditId(null);
                }}
                trigger={
                  <button className="h-14 px-8 bg-blue-500 text-white font-bold rounded-[22px] hover:bg-blue-400 transition-all flex items-center gap-3 shadow-2xl shadow-blue-500/20 group/btn">
                    <Plus className="h-5 w-5 transition-transform group-hover/btn:rotate-90" />
                    Nueva Meta
                  </button>
                }
              />
            </div>

            {/* Visual background elements */}
            <div className="absolute right-[-10%] bottom-[-10%] text-white/5 scale-[4] rotate-[-15deg] pointer-events-none transition-transform duration-1000 group-hover:scale-[4.5]">
              <Target className="h-40 w-40" />
            </div>
          </div>

          <div className="bg-white/3 border border-white/6 rounded-[40px] p-8 flex flex-col justify-between items-center text-center">
            <div className="space-y-2">
              <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 w-fit mx-auto mb-2">
                <Trophy className="h-8 w-8" />
              </div>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                Total Ahorrado
              </p>
              <h3 className="text-3xl font-black text-white tabular-nums">
                {new Intl.NumberFormat("es-PE", {
                  style: "currency",
                  currency,
                }).format(totalSaved)}
              </h3>
            </div>

            <div className="w-full space-y-4 pt-6">
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
                  style={{ width: `${overallPercentage}%` }}
                />
              </div>
              <p className="text-xs font-bold text-white/30 tracking-wide">
                PROGRESO GLOBAL{" "}
                <span className="text-white/60 ml-2">{overallPercentage}%</span>
              </p>
            </div>
          </div>

          <div className="bg-white/3 border border-white/6 rounded-[40px] p-8 flex flex-col justify-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-blue-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  Metas Activas
                </p>
                <p className="text-2xl font-black text-white">
                  {initialGoals.length}
                </p>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            <div className="space-y-4 text-left">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                Consejo del día
              </p>
              <p className="text-[11px] text-white/40 leading-relaxed font-medium italic">
                "El ahorro no es lo que queda después de gastar, sino el gasto
                es lo que queda después de ahorrar."
              </p>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
              <h3 className="text-2xl font-black text-white tracking-tight">
                Objetivos de Ahorro
              </h3>
            </div>
          </div>

          {initialGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/2 border border-dashed border-white/10 rounded-[40px]">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 mb-4">
                <Target className="h-10 w-10 text-white/10" />
              </div>
              <p className="text-white/20 font-bold tracking-wide">
                Comienza creando tu primera meta de ahorro
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialGoals.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g as any}
                  currency={currency}
                  onEdit={(id) => {
                    setEditId(id);
                    setIsDialogOpen(true);
                  }}
                  onAddFunds={(id) => {
                    setAddFundsId(id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <GoalDialog
        initialData={editData}
        open={isDialogOpen && !!editId}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditId(null);
        }}
      />

      <AddFundsDialog
        goalId={addFundsId}
        goalName={addFundsGoal?.name || null}
        currency={currency}
        wallets={wallets}
        open={!!addFundsId}
        onOpenChange={(open) => {
          if (!open) setAddFundsId(null);
        }}
      />
    </>
  );
}
