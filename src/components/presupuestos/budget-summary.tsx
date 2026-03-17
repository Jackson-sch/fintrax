import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { Wallet, TrendingDown, CheckCircle2, AlertTriangle } from "lucide-react";

interface BudgetSummaryProps {
  totalBudget: number;
  totalSpent: number;
  currency: string;
}

function StatCard({
  label,
  value,
  valueColor,
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
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4">
      <div className={cn("p-2.5 rounded-xl border", iconBg)}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold mb-0.5">
          {label}
        </p>
        <p className={cn("text-xl font-bold", valueColor || "text-white")}>
          {value}
        </p>
      </div>
    </div>
  );
}

export function BudgetSummary({
  totalBudget,
  totalSpent,
  currency,
}: BudgetSummaryProps) {
  const remaining = totalBudget - totalSpent;
  const isOver = remaining < 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatCard
        label="Presupuestado"
        value={formatCurrency(totalBudget, currency)}
        icon={Wallet}
        iconColor="text-violet-400"
        iconBg="bg-violet-500/10 border-violet-500/20"
      />
      <StatCard
        label="Gastado"
        value={formatCurrency(totalSpent, currency)}
        valueColor="text-rose-400"
        icon={TrendingDown}
        iconColor="text-rose-400"
        iconBg="bg-rose-500/10 border-rose-500/20"
      />
      <StatCard
        label="Disponible"
        value={formatCurrency(Math.abs(remaining), currency)}
        valueColor={isOver ? "text-rose-400" : "text-emerald-400"}
        icon={isOver ? AlertTriangle : CheckCircle2}
        iconColor={isOver ? "text-rose-400" : "text-emerald-400"}
        iconBg={
          isOver
            ? "bg-rose-500/10 border-rose-500/20"
            : "bg-emerald-500/10 border-emerald-500/20"
        }
      />
    </div>
  );
}
