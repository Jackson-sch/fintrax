import { Header } from "@/components/sidebar/header";
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  getTransactions,
  getDashboardData,
  getCategories,
  getWallets,
  getTags,
  getSession,
} from "@/actions/financial-actions";
import { TransactionDialog } from "@/components/transacciones/transaction-dialog";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/formatters";
import { ExportButtons } from "@/components/comun/export-buttons";
import { TransactionRow } from "./transaction-row";
import { SearchBar } from "@/components/transacciones/search-bar";
import { ImportDialog } from "@/components/transacciones/import-dialog";

export const metadata = {
  title: "Transacciones | Fintrax",
  description: "Gestiona tus movimientos financieros.",
};

export default async function TransaccionesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  let transactions = [];
  const session = await getSession();
  if (!session) redirect("/login");

  let totalsData;
  let categories = [];
  let wallets = [];
  let tags = [];

  try {
    const [
      fetchedTransactions,
      fetchedTotalsData,
      fetchedCategories,
      fetchedWallets,
      fetchedTags,
    ] = await Promise.all([
      getTransactions(params.q ? { search: params.q } : undefined),
      getDashboardData(),
      getCategories(),
      getWallets(),
      getTags(),
    ]);
    transactions = fetchedTransactions;
    totalsData = fetchedTotalsData;
    categories = fetchedCategories;
    wallets = fetchedWallets;
    tags = fetchedTags;
  } catch (error) {
    console.error("Transactions loading error:", error);
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-white/50">Error al cargar las transacciones.</p>
      </div>
    );
  }

  const { balance, monthlyIncome, monthlyExpense, currency } = totalsData;
  const isPositiveBalance = balance >= 0;

  return (
    <>
      <Header
        title="Transacciones"
        subtitle="Gestiona tus movimientos financieros"
      />

      <div className="p-4 md:p-8 space-y-5 max-w-7xl mx-auto">
        {/* ── Summary cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Monthly income */}
          <div className="bg-white/3 border border-white/6 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
              <TrendingDown className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold mb-0.5">
                Ingresos del mes
              </p>
              <p className="text-xl font-bold text-emerald-400">
                {formatCurrency(monthlyIncome, currency)}
              </p>
            </div>
          </div>

          {/* Monthly expense */}
          <div className="bg-white/3 border border-white/6 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 shrink-0">
              <TrendingUp className="h-4 w-4 text-rose-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold mb-0.5">
                Gastos del mes
              </p>
              <p className="text-xl font-bold text-rose-400">
                {formatCurrency(monthlyExpense, currency)}
              </p>
            </div>
          </div>

          {/* Balance */}
          <div className="bg-white/3 border border-white/6 rounded-2xl p-5 flex items-center gap-4">
            <div
              className={
                isPositiveBalance
                  ? "p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0"
                  : "p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0"
              }
            >
              <Wallet
                className={
                  isPositiveBalance
                    ? "h-4 w-4 text-emerald-400"
                    : "h-4 w-4 text-amber-400"
                }
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/25 font-bold mb-0.5">
                Saldo disponible
              </p>
              <p
                className={
                  isPositiveBalance
                    ? "text-xl font-bold text-white"
                    : "text-xl font-bold text-amber-400"
                }
              >
                {formatCurrency(balance, currency)}
              </p>
              <p className="text-[9px] text-violet-400/60 font-bold uppercase tracking-tight mt-0.5">
                Patrimonio: {formatCurrency(totalsData.netWorth, currency)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <SearchBar />

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 md:shrink-0">
            <ImportDialog />
            <ExportButtons transactions={transactions} currency={currency} />
            <TransactionDialog
              categories={categories}
              wallets={wallets as any}
              tags={tags}
              currency={currency}
              trigger={
                <button className="relative overflow-hidden flex items-center gap-2 h-11 px-5 bg-linear-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-900/40 transition-all duration-300 group">
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  Nueva Transacción
                </button>
              }
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white/2 border border-white/6 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  {[
                    { label: "Descripción", align: "text-left" },
                    { label: "Categoría", align: "text-left" },
                    { label: "Fecha", align: "text-left" },
                    { label: "Monto", align: "text-right" },
                    { label: "Estado", align: "text-center" },
                    { label: "", align: "text-center" },
                  ].map(({ label, align }, i) => (
                    <th
                      key={i}
                      className={`${align} text-[10px] font-bold text-white/20 uppercase tracking-widest px-3 md:px-5 py-4`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex flex-col items-center justify-center gap-3 py-16">
                        <div className="p-3 rounded-2xl bg-white/4 border border-white/6">
                          <Wallet className="h-6 w-6 text-white/20" />
                        </div>
                        <p className="text-sm text-white/20 font-medium">
                          No hay transacciones registradas
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <TransactionRow
                      key={tx.id}
                      transaction={tx as any}
                      currency={currency}
                      categories={categories}
                      wallets={wallets as any}
                      tags={tags}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          {transactions.length > 0 && (
            <div className="px-5 py-3 border-t border-white/4 flex items-center justify-between">
              <p className="text-[11px] text-white/20 font-medium">
                {transactions.length}{" "}
                {transactions.length === 1 ? "transacción" : "transacciones"}
              </p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[11px] text-emerald-400/60 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
                  {transactions.filter((t: any) => t.type === "INCOME").length}{" "}
                  ingresos
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-rose-400/60 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400/60" />
                  {
                    transactions.filter((t: any) => t.type === "EXPENSE").length
                  }{" "}
                  gastos
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
