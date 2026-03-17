import { Header } from "@/components/sidebar/header";
import { PresupuestosClient } from "./presupuestos-client";
import {
  getBudgets,
  getCategories,
  getSession,
} from "@/actions/financial-actions";
import { getUserCurrency } from "@/actions/shared";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Presupuestos | Fintrax",
  description: "Controla tus límites de gasto por categoría.",
};

export default async function PresupuestosPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  let budgets = [];
  let categories: { id: string; name: string; color: string }[] = [];
  let currency = "USD";

  try {
    [budgets, categories, currency] = await Promise.all([
      getBudgets(month, year),
      getCategories(),
      getUserCurrency(),
    ]);
  } catch (error) {
    console.error("Presupuestos error:", error);
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-white/50">Error al cargar los presupuestos.</p>
      </div>
    );
  }

  return (
    <>
      <Header
        title="Presupuestos"
        subtitle="Controla tus límites de gasto mensuales por categoría"
      />
      <PresupuestosClient
        initialBudgets={budgets}
        categories={categories}
        currency={currency}
        currentMonth={month}
        currentYear={year}
      />
    </>
  );
}
