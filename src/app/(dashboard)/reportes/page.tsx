import { Header } from "@/components/sidebar/header";
import { ReportesClient } from "./reportes-client";
import { getReportsData, getSession } from "@/actions/financial-actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Reportes | Fintrax",
  description: "Análisis financiero detallado de tu actividad.",
};

export default async function ReportesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { monthlyData, budgetData } = await getReportsData();
  const currency = session?.user?.currency || "USD";

  return (
    <>
      <Header
        title="Reportes y Análisis"
        subtitle="Análisis financieros detallados de tu actividad"
      />
      <ReportesClient
        monthlyData={monthlyData}
        budgetData={budgetData}
        currency={currency}
      />
    </>
  );
}
