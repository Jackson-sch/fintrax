"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "./shared";

export async function getDashboardData() {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currency: true },
  });

  const currency = user?.currency || "USD";

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const recentTransactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 5,
    include: { category: true },
  });

  const walletAggregate = await prisma.wallet.aggregate({
    where: { userId },
    _sum: { balance: true },
  });

  const loans = await prisma.loan.findMany({
    where: { 
      userId,
      status: "ACTIVE" 
    },
    select: {
      type: true,
      amount: true,
      paidAmount: true,
    }
  });

  const pendingLoans = loans
    .filter((l) => l.type === "LOAN")
    .reduce((acc, l) => acc + (l.amount - l.paidAmount), 0);

  const pendingCollections = loans
    .filter((l) => l.type === "COLLECTION")
    .reduce((acc, l) => acc + (l.amount - l.paidAmount), 0);

  const totalReceivables = pendingCollections;
  const totalPayables = pendingLoans;
  const liquidBalance = walletAggregate._sum.balance || 0;
  const netWorth = liquidBalance + totalReceivables - totalPayables;

  const monthlyAggregates = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: { amount: true },
  });

  const monthlyIncome =
    monthlyAggregates.find((a) => a.type === "INCOME")?._sum.amount || 0;
  const monthlyExpense =
    monthlyAggregates.find((a) => a.type === "EXPENSE")?._sum.amount || 0;

  return {
    balance: liquidBalance,
    netWorth,
    totalReceivables,
    totalPayables,
    monthlyIncome,
    monthlyExpense,
    savingRate:
      monthlyIncome > 0
        ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100
        : 0,
    recentTransactions,
    currency,
  };
}

export async function getCategories() {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const userId = session.user.id;

  let categories = await prisma.category.findMany({
    where: { userId },
  });

  if (categories.length === 0) {
    const defaultCategories = [
      { name: "Alimentación", color: "#ef4444", icon: "shopping-cart" },
      { name: "Salario", color: "#10b981", icon: "dollar-sign" },
      { name: "Transporte", color: "#f59e0b", icon: "car" },
      { name: "Salud", color: "#3b82f6", icon: "heart" },
      { name: "Educación", color: "#8b5cf6", icon: "book" },
      { name: "Entretenimiento", color: "#ec4899", icon: "film" },
      { name: "Servicios", color: "#06b6d4", icon: "zap" },
      { name: "Ventas", color: "#f97316", icon: "tag" },
      { name: "Inversiones", color: "#0ea5e9", icon: "trending-up" },
      { name: "Otros", color: "#64748b", icon: "grid" },
    ];

    await prisma.category.createMany({
      data: defaultCategories.map((c) => ({ ...c, userId })),
    });

    categories = await prisma.category.findMany({
      where: { userId },
    });
  }

  return categories;
}
