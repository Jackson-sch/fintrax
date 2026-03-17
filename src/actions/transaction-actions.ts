"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "./shared";

export async function getTransactions(filters?: {
  search?: string;
  type?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const userId = session.user.id;

  const where: any = { userId };
  if (filters?.search) {
    where.description = { contains: filters.search, mode: "insensitive" };
  }
  if (filters?.type && filters.type !== "ALL") {
    where.type = filters.type;
  }

  return await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    include: { 
      category: true,
      wallet: true,
      tags: true
    },
  });
}

export async function addTransaction(data: {
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  walletId?: string;
  tagIds?: string[];
  date?: Date;
}) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const { tagIds, ...rest } = data;

  const transaction = await prisma.transaction.create({
    data: {
      ...rest,
      userId: session.user.id,
      date: data.date || new Date(),
      tags: tagIds ? {
        connect: tagIds.map(id => ({ id }))
      } : undefined
    },
  });

  if (data.walletId) {
    await prisma.wallet.update({
      where: { id: data.walletId, userId: session.user.id },
      data: {
        balance: data.type === "INCOME" 
          ? { increment: data.amount } 
          : { decrement: data.amount }
      }
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/transacciones");
  revalidatePath("/cuentas");
  return transaction;
}

export async function updateTransaction(
  id: string,
  data: {
    description?: string;
    amount?: number;
    type?: "INCOME" | "EXPENSE";
    categoryId?: string;
    walletId?: string;
    tagIds?: string[];
    date?: Date;
  },
) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const { tagIds, ...rest } = data;

  // For simplicity in this phase, we're not recalculating balances on update 
  // unless we specifically want to handle complex logic. 
  // We'll focus on getting the relations working.

  const transaction = await prisma.transaction.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      ...rest,
      tags: tagIds ? {
        set: tagIds.map(tid => ({ id: tid }))
      } : undefined
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transacciones");
  revalidatePath("/cuentas");
  return transaction;
}

export async function deleteTransaction(id: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const transaction = await prisma.transaction.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transacciones");
  return transaction;
}
