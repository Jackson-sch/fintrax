"use server";

import { Header } from "@/components/sidebar/header";
import {
  getWallets,
  getUserCurrency,
  getSession,
  getDashboardData,
} from "@/actions/financial-actions";
import { CuentasClient } from "./cuentas-client";
import { redirect } from "next/navigation";

export default async function CuentasPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [wallets, currency, dashboardData] = await Promise.all([
    getWallets(),
    getUserCurrency(),
    getDashboardData(),
  ]);

  return (
    <CuentasClient
      initialWallets={wallets as any}
      currency={currency}
      netWorth={dashboardData.netWorth}
    />
  );
}
