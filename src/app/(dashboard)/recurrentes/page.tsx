import { getRecurringTransactions, getCategories, getUserCurrency, getSession } from "@/actions/financial-actions";
import { RecurrentesClient } from "./recurrentes-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Recurrentes | Fintrax",
  description: "Gestiona tus transacciones automáticas.",
};

export default async function RecurrentesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  try {
    const [recurring, categories, currency] = await Promise.all([
      getRecurringTransactions(),
      getCategories(),
      getUserCurrency(),
    ]);

    return (
      <RecurrentesClient
        initialRecurring={recurring as any}
        categories={categories}
        currency={currency}
      />
    );
  } catch (error) {
    console.error("Error loading recurring transactions:", error);
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-white/50">Error al cargar las transacciones recurrentes.</p>
      </div>
    );
  }
}
