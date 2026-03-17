import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { CustomTooltip } from "../custom-tooltip";

export default function MonthlyTrend({
  monthlyData,
  currency,
}: {
  monthlyData: any[];
  currency: string;
}) {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl animate-fade-in shadow-xl shadow-black/20">
      <h3 className="text-lg font-bold text-white mb-6">Tendencia Mensual</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
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
                `${currency}${" "}${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`
              }
            />
            <Tooltip
              content={<CustomTooltip currency={currency} />}
              cursor={false}
            />
            <Bar
              dataKey="ingresos"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              name="Ingresos"
              opacity={0.8}
            />
            <Bar
              dataKey="gastos"
              fill="#f43f5e"
              radius={[6, 6, 0, 0]}
              name="Gastos"
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
