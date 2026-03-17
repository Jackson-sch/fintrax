import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatCurrency, formatDate } from "./formatters";

// ─── Types ───────────────────────────────────────────────────────────

interface TransactionExport {
  description: string;
  type: string;
  amount: number;
  date: Date | string;
  category?: { name: string } | null;
}

interface MonthlyDataExport {
  name: string;
  ingresos: number;
  gastos: number;
}

interface BudgetDataExport {
  category: string;
  budget: number;
  spent: number;
}

// ─── PDF Helpers ─────────────────────────────────────────────────────

function createPDFBase(title: string): jsPDF {
  const doc = new jsPDF();

  // Header bar
  doc.setFillColor(2, 6, 23); // slate-950
  doc.rect(0, 0, 210, 35, "F");

  // Brand
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("Fintrax", 14, 18);

  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(title, 14, 27);

  // Date
  doc.text(`Generado: ${formatDate(new Date())}`, 210 - 14, 27, {
    align: "right",
  });

  return doc;
}

// ─── Transaction Exports ─────────────────────────────────────────────

export function exportTransactionsToPDF(
  transactions: TransactionExport[],
  currency: string,
  title = "Transacciones",
) {
  const doc = createPDFBase(title);

  const tableData = transactions.map((tx) => [
    tx.description,
    tx.category?.name || "Sin categoría",
    formatDate(tx.date),
    tx.type === "INCOME" ? "Ingreso" : "Gasto",
    formatCurrency(tx.amount, currency),
  ]);

  autoTable(doc, {
    startY: 42,
    head: [["Descripción", "Categoría", "Fecha", "Tipo", "Monto"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [37, 99, 235], // blue-600
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249],
    },
    styles: {
      cellPadding: 4,
    },
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportTransactionsToExcel(
  transactions: TransactionExport[],
  currency: string,
  title = "Transacciones",
) {
  const data = transactions.map((tx) => ({
    Descripción: tx.description,
    Categoría: tx.category?.name || "Sin categoría",
    Fecha: formatDate(tx.date),
    Tipo: tx.type === "INCOME" ? "Ingreso" : "Gasto",
    Monto: tx.amount,
    Moneda: currency,
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  // Column widths
  ws["!cols"] = [
    { wch: 30 },
    { wch: 18 },
    { wch: 15 },
    { wch: 10 },
    { wch: 15 },
    { wch: 8 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title);
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// ─── Report Exports ──────────────────────────────────────────────────

export function exportReportToPDF(
  monthlyData: MonthlyDataExport[],
  budgetData: BudgetDataExport[],
  currency: string,
) {
  const doc = createPDFBase("Reportes y Análisis");

  // Monthly trend table
  autoTable(doc, {
    startY: 42,
    head: [["Mes", "Ingresos", "Gastos", "Balance"]],
    body: monthlyData.map((m) => [
      m.name,
      formatCurrency(m.ingresos, currency),
      formatCurrency(m.gastos, currency),
      formatCurrency(m.ingresos - m.gastos, currency),
    ]),
    theme: "striped",
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    styles: { cellPadding: 4 },
  });

  // Budget table
  if (budgetData.length > 0) {
    const finalY = (doc as any).lastAutoTable?.finalY || 42;

    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text("Gasto por Categoría (Mes Actual)", 14, finalY + 14);

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Categoría", "Gastado", "Presupuesto", "% Uso"]],
      body: budgetData.map((b) => [
        b.category,
        formatCurrency(b.spent, currency),
        formatCurrency(b.budget, currency),
        `${Math.min((b.spent / b.budget) * 100, 100).toFixed(0)}%`,
      ]),
      theme: "striped",
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      styles: { cellPadding: 4 },
    });
  }

  doc.save(`reportes_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportReportToExcel(
  monthlyData: MonthlyDataExport[],
  budgetData: BudgetDataExport[],
  currency: string,
) {
  const wb = XLSX.utils.book_new();

  // Monthly sheet
  const monthlySheet = XLSX.utils.json_to_sheet(
    monthlyData.map((m) => ({
      Mes: m.name,
      Ingresos: m.ingresos,
      Gastos: m.gastos,
      Balance: m.ingresos - m.gastos,
      Moneda: currency,
    })),
  );
  monthlySheet["!cols"] = [
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 8 },
  ];
  XLSX.utils.book_append_sheet(wb, monthlySheet, "Tendencia Mensual");

  // Budget sheet
  if (budgetData.length > 0) {
    const budgetSheet = XLSX.utils.json_to_sheet(
      budgetData.map((b) => ({
        Categoría: b.category,
        Gastado: b.spent,
        Presupuesto: b.budget,
        "% Uso": `${Math.min((b.spent / b.budget) * 100, 100).toFixed(0)}%`,
        Moneda: currency,
      })),
    );
    budgetSheet["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 8 },
    ];
    XLSX.utils.book_append_sheet(wb, budgetSheet, "Presupuesto");
  }

  XLSX.writeFile(wb, `reportes_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
