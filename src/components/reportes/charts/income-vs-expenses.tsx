import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";
import { CustomTooltip } from "../custom-tooltip";

export default function IncomeVsExpenses({
  monthlyData,
  currency,
}: {
  monthlyData: any[];
  currency: string;
}) {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl animate-fade-in shadow-xl shadow-black/20">
      <h3 className="text-lg font-bold text-white mb-6">Ingresos vs Gastos</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.03)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="rgba(148,163,184,0.6)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(148,163,184,0.6)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                `${currency}${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`
              }
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIngresos)"
              name="Ingresos"
            />
            <Area
              type="monotone"
              dataKey="gastos"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGastos)"
              name="Gastos"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-sm text-slate-400">Ingresos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-sm text-slate-400">Gastos</span>
        </div>
      </div>
    </div>
  );
}
