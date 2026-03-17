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

  const userId = session.user.id;
  const { tagIds, ...rest } = data;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Get existing transaction to know old amount and wallet
    const oldTransaction = await tx.transaction.findUnique({
      where: { id, userId },
    });

    if (!oldTransaction) throw new Error("Transaction not found");

    // 2. Revert old balance impact if it had a wallet
    if (oldTransaction.walletId) {
      await tx.wallet.update({
        where: { id: oldTransaction.walletId, userId },
        data: {
          balance: oldTransaction.type === "INCOME" 
            ? { decrement: oldTransaction.amount } 
            : { increment: oldTransaction.amount }
        }
      });
    }

    // 3. Update transaction
    const updatedTransaction = await tx.transaction.update({
      where: { id, userId },
      data: {
        ...rest,
        tags: tagIds ? {
          set: tagIds.map(tid => ({ id: tid }))
        } : undefined
      },
    });

    // 4. Apply new balance impact if it has a wallet
    if (updatedTransaction.walletId) {
      await tx.wallet.update({
        where: { id: updatedTransaction.walletId, userId },
        data: {
          balance: updatedTransaction.type === "INCOME" 
            ? { increment: updatedTransaction.amount } 
            : { decrement: updatedTransaction.amount }
        }
      });
    }

    return updatedTransaction;
  });

  revalidatePath("/dashboard");
  revalidatePath("/transacciones");
  revalidatePath("/cuentas");
  return result;
}

export async function deleteTransaction(id: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const userId = session.user.id;

  const result = await prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({
      where: { id, userId },
    });

    if (!transaction) throw new Error("Transaction not found");

    // Revert balance impact
    if (transaction.walletId) {
      await tx.wallet.update({
        where: { id: transaction.walletId, userId },
        data: {
          balance: transaction.type === "INCOME" 
            ? { decrement: transaction.amount } 
            : { increment: transaction.amount }
        }
      });
    }

    return await tx.transaction.delete({
      where: { id, userId },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/transacciones");
  revalidatePath("/cuentas");
  return result;
}
