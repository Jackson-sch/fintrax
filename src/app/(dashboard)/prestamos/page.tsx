import { Header } from "@/components/sidebar/header";
import {
  getLoans,
  getUserCurrency,
  getSession,
} from "@/actions/financial-actions";
import { PrestamosClient } from "./prestamos-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Préstamos y Cobros | Fintrax",
  description: "Gestiona tus préstamos y cobros pendientes.",
};

export default async function PrestamosPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const loans = await getLoans();
  const currency = await getUserCurrency();

  return (
    <>
      <Header
        title="Préstamos y Cobros"
        subtitle="Gestiona tus préstamos y cobros pendientes"
      />
      <PrestamosClient initialLoans={loans} currency={currency} />
    </>
  );
}
