"use client";

import { useState, useRef } from "react";
import { Upload, FileDown, AlertCircle, CheckCircle2, Loader2, X, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { importTransactionsCSV } from "@/actions/financial-actions";
import { toast } from "sonner";
import Papa from "papaparse";
import { cn } from "@/lib/utils";

const CSV_COLUMNS = ["Fecha", "Descripción", "Monto", "Tipo"];

const INSTRUCTIONS = [
  "El archivo debe estar en formato .CSV",
  'Columnas requeridas: Fecha, Descripción, Monto, Tipo',
  'El tipo puede ser "Ingreso" o "Gasto"',
];

export function ImportDialog() {
  const [open, setOpen]           = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [file, setFile]           = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef                  = useRef<HTMLInputElement>(null);

  /* ── helpers ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped?.name.endsWith(".csv")) setFile(dropped);
    else toast.error("Solo se aceptan archivos .CSV");
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleImport = async () => {
    if (!file) return;
    setIsImporting(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const mappedData = results.data.map((row: any) => ({
            description: row["Descripción"] || row.description,
            amount: row["Monto"] || row.amount,
            type:
              (row["Tipo"] || row.type)?.toUpperCase() === "INGRESO"
                ? "INCOME"
                : "EXPENSE",
            date: row["Fecha"] || row.date || new Date().toISOString(),
          }));
          const count = await importTransactionsCSV(mappedData);
          toast.success(`${count} transacciones importadas correctamente`);
          setOpen(false);
          setFile(null);
        } catch (err) {
          console.error(err);
          toast.error("Error al importar. Revisa el formato del CSV.");
        } finally {
          setIsImporting(false);
        }
      },
      error: (err) => {
        console.error(err);
        toast.error("Error al leer el archivo CSV.");
        setIsImporting(false);
      },
    });
  };

  const downloadTemplate = () => {
    const csv =
      "Fecha,Descripción,Monto,Tipo\n2026-03-12,Compra Supermercado,150.50,Gasto\n2026-03-13,Sueldo Quincena,2500.00,Ingreso";
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "plantilla_importacion.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  /* ── file size helper ── */
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setFile(null); }}>
      <DialogTrigger
        render={
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/8 bg-white/3 hover:bg-amber-500/8 hover:border-amber-400/20 text-amber-400 transition-all duration-200 text-sm font-semibold backdrop-blur-sm active:scale-[0.97]">
            <Upload className="h-4 w-4" />
            Importar
          </button>
        }
      />

      <DialogContent className="bg-slate-950/95 border border-white/8 backdrop-blur-2xl text-white rounded-3xl shadow-2xl shadow-black/50 max-w-md p-0 overflow-hidden gap-0">

        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />
        {/* Glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-28 bg-amber-500/8 rounded-full blur-2xl" />

        <div className="relative p-5 md:p-7 space-y-5">
          {/* ── Header ── */}
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/20">
                <Upload className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white leading-tight">
                  Importar Transacciones
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Sube un CSV con tus movimientos bancarios o de otras apps.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* ── Instructions card ── */}
          <div className="rounded-2xl bg-white/3 border border-white/6 p-4 space-y-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <AlertCircle className="h-3.5 w-3.5" />
              Instrucciones
            </p>

            <ul className="space-y-1.5">
              {INSTRUCTIONS.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <div className="mt-1 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                  <span className="text-xs text-slate-500 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {/* Column badges */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {CSV_COLUMNS.map((col) => (
                <span
                  key={col}
                  className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/8 text-xs text-slate-400 font-mono"
                >
                  {col}
                </span>
              ))}
            </div>

            <button
              onClick={downloadTemplate}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors mt-1"
            >
              <FileDown className="h-3.5 w-3.5" />
              Descargar plantilla CSV
            </button>
          </div>

          {/* ── Drop zone ── */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
            className={cn(
              "relative rounded-2xl border-2 border-dashed transition-all duration-200 p-6 flex flex-col items-center justify-center gap-3 min-h-[140px]",
              file
                ? "border-emerald-500/30 bg-emerald-500/5 cursor-default"
                : isDragging
                ? "border-amber-400/40 bg-amber-500/5 scale-[1.01]"
                : "border-white/8 hover:border-white/15 hover:bg-white/2 cursor-pointer"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              /* ── File selected state ── */
              <div className="flex items-center gap-4 w-full">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 shrink-0">
                  <FileText className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatSize(file.size)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <button
                    onClick={clearFile}
                    className="p-1 rounded-lg hover:bg-white/8 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* ── Empty state ── */
              <>
                <div className={cn(
                  "p-3.5 rounded-2xl border transition-colors duration-200",
                  isDragging
                    ? "bg-amber-500/10 border-amber-400/20 text-amber-400"
                    : "bg-white/4 border-white/8 text-slate-500"
                )}>
                  <Upload className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-400">
                    {isDragging ? "Suelta el archivo aquí" : "Selecciona un archivo"}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">o arrastra y suelta · solo .CSV</p>
                </div>
              </>
            )}
          </div>

          {/* ── Import button ── */}
          <button
            onClick={handleImport}
            disabled={!file || isImporting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-amber-600/90 hover:bg-amber-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-lg shadow-amber-500/15 border border-amber-400/30 transition-all duration-200"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importando…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Comenzar importación
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}