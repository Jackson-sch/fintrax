"use client";

import { FileSpreadsheet, FileText } from "lucide-react";

interface MonthlyData {
  name: string;
  ingresos: number;
  gastos: number;
}

interface BudgetData {
  category: string;
  budget: number;
  spent: number;
  color: string;
}

interface ReportesClientProps {
  monthlyData: MonthlyData[];
  budgetData: BudgetData[];
  currency: string;
}

import { exportReportToPDF, exportReportToExcel } from "@/lib/export";
import IncomeVsExpenses from "@/components/reportes/charts/income-vs-expenses";
import MonthlyTrend from "@/components/reportes/charts/monthly-trend";
import ExpenseCategory from "@/components/reportes/charts/expense-category";

export function ReportesClient({
  monthlyData,
  budgetData,
  currency,
}: ReportesClientProps) {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Export Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => exportReportToPDF(monthlyData, budgetData, currency)}
          className="flex items-center gap-2 px-4 py-2.5 glass-panel rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-medium"
        >
          <FileText className="h-4 w-4" />
          Exportar PDF
        </button>
        <button
          onClick={() => exportReportToExcel(monthlyData, budgetData, currency)}
          className="flex items-center gap-2 px-4 py-2.5 glass-panel rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-all text-sm font-medium"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Exportar Excel
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Income vs Expenses Chart */}
        <IncomeVsExpenses monthlyData={monthlyData} currency={currency} />

        {/* Monthly Trend Bar Chart */}
        <MonthlyTrend monthlyData={monthlyData} currency={currency} />
      </div>

      {/* Budget Progress */}
      <ExpenseCategory budgetData={budgetData} currency={currency} />
    </div>
  );
}
