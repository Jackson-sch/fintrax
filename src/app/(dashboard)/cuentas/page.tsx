"use server";

import { Header } from "@/components/sidebar/header";
import {
  getWallets,
  getUserCurrency,
  getSession,
} from "@/actions/financial-actions";
import { CuentasClient } from "./cuentas-client";
import { redirect } from "next/navigation";

export default async function CuentasPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [wallets, currency] = await Promise.all([
    getWallets(),
    getUserCurrency(),
  ]);

  return <CuentasClient initialWallets={wallets as any} currency={currency} />;
}
