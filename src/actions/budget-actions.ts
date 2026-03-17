"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "./shared";

export async function getBudgets(month?: number, year?: number) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();

  const firstDay = new Date(targetYear, targetMonth - 1, 1);
  const lastDay = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

  const budgets = await prisma.budget.findMany({
    where: {
      userId: session.user.id,
      month: targetMonth,
      year: targetYear,
    },
    include: {
      category: {
        include: {
          transactions: {
            where: {
              userId: session.user.id,
              type: "EXPENSE",
              date: { gte: firstDay, lte: lastDay },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return budgets.map((b) => ({
    id: b.id,
    amount: b.amount,
    month: b.month,
    year: b.year,
    categoryId: b.categoryId,
    categoryName: b.category.name,
    categoryColor: b.category.color,
    categoryIcon: b.category.icon,
    spent: b.category.transactions.reduce((sum, t) => sum + t.amount, 0),
  }));
}

export async function addBudget(data: {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.budget.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  revalidatePath("/presupuestos");
  revalidatePath("/dashboard");
}

export async function updateBudget(id: string, data: { amount: number }) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.budget.update({
    where: { id, userId: session.user.id },
    data: { amount: data.amount },
  });

  revalidatePath("/presupuestos");
  revalidatePath("/dashboard");
}

export async function deleteBudget(id: string) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.budget.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/presupuestos");
  revalidatePath("/dashboard");
}
