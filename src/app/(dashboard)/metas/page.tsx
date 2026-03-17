import { getSavingGoals, getUserCurrency, getSession } from "@/actions/financial-actions";
import { MetasClient } from "./metas-client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Metas de Ahorro | Fintrax",
  description: "Planifica y alcanza tus objetivos financieros.",
};

export default async function MetasPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  try {
    const [goals, currency, wallets] = await Promise.all([
      getSavingGoals(),
      getUserCurrency(),
      prisma.wallet.findMany({ where: { userId: session.user.id } }),
    ]);

    return (
      <MetasClient
        initialGoals={goals as any}
        currency={currency}
        wallets={wallets as any}
      />
    );
  } catch (error) {
    console.error("Error loading saving goals:", error);
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-white/50">Error al cargar las metas de ahorro.</p>
      </div>
    );
  }
}
