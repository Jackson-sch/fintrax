"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import {
  exportTransactionsToPDF,
  exportTransactionsToExcel,
} from "@/lib/export";
import { exportTransactionsCSV } from "@/actions/financial-actions";
import { toast } from "sonner";

interface Transaction {
  id: string;
  description: string;
  type: string;
  amount: number;
  date: Date | string;
  category?: { name: string } | null;
}

export function ExportButtons({
  transactions,
  currency,
}: {
  transactions: Transaction[];
  currency: string;
}) {
  return (
    <>
      <button
        onClick={() => exportTransactionsToPDF(transactions, currency)}
        className="flex items-center gap-2 px-4 py-2.5 glass-panel rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-medium"
      >
        <FileText className="h-4 w-4" />
        PDF
      </button>
      <button
        onClick={async () => {
          try {
            const csv = await exportTransactionsCSV();
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `transacciones_${new Date().toISOString().split("T")[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("CSV exportado correctamente");
          } catch (error) {
            toast.error("Error al exportar CSV");
          }
        }}
        className="flex items-center gap-2 px-4 py-2.5 glass-panel rounded-xl text-blue-400 hover:bg-blue-500/10 transition-all text-sm font-medium"
      >
        <FileSpreadsheet className="h-4 w-4" />
        CSV
      </button>
      <button
        onClick={() => exportTransactionsToExcel(transactions, currency)}
        className="flex items-center gap-2 px-4 py-2.5 glass-panel rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-all text-sm font-medium"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </button>
    </>
  );
}
