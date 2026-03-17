"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "./shared";

export async function updateCurrency(currency: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { currency },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transacciones");
  revalidatePath("/alertas");
  revalidatePath("/configuracion");
}

export async function updateProfile(name: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  revalidatePath("/configuracion");
  revalidatePath("/dashboard"); // since sidebar might show name
}

export async function getReportsData() {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      date: { gte: twelveMonthsAgo },
    },
    orderBy: { date: "asc" },
  });

  const monthlyMap = new Map();
  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];

  for (let i = 0; i < 12; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    monthlyMap.set(key, { name: key, ingresos: 0, gastos: 0 });
  }

  transactions.forEach((t) => {
    const key = `${months[t.date.getMonth()]} ${t.date.getFullYear().toString().slice(-2)}`;
    if (monthlyMap.has(key)) {
      const data = monthlyMap.get(key);
      if (t.type === "INCOME") data.ingresos += t.amount;
      else data.gastos += t.amount;
    }
  });

  const monthlyData = Array.from(monthlyMap.values());

  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const currentMonth = firstDayOfMonth.getMonth() + 1; // 1-12
  const currentYear = firstDayOfMonth.getFullYear();

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    include: {
      transactions: {
        where: {
          date: { gte: firstDayOfMonth },
        },
      },
      budgets: {
        where: {
          month: currentMonth,
          year: currentYear,
        },
      },
    },
  });

  const budgetData = categories
    .map((cat) => ({
      category: cat.name,
      budget: cat.budgets?.[0]?.amount || 0,
      spent: cat.transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0),
      color: cat.color,
    }))
    .filter((cat) => cat.spent > 0 || cat.budget > 0);

  return { monthlyData, budgetData };
}

export async function getAlertSettings() {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
  });

  return alerts;
}

export async function createAlert(type: string, threshold: number) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const alert = await prisma.alert.create({
    data: {
      type: type as any,
      threshold,
      userId: session.user.id,
    },
  });

  revalidatePath("/alertas");
  return alert;
}

export async function updateAlertSettings(
  alertId: string,
  enabled: boolean,
  threshold?: number,
) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const updated = await prisma.alert.update({
    where: { id: alertId, userId: session.user.id },
    data: {
      enabled,
      ...(threshold !== undefined && { threshold }),
    },
  });

  revalidatePath("/alertas");
  return updated;
}
