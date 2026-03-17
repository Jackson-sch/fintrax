"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "./shared";
import { RecurrenceFrequency, TransactionType } from "@prisma-client";

export async function getRecurringTransactions() {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  return await prisma.recurringTransaction.findMany({
    where: { userId: session.user.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function addRecurringTransaction(data: {
  description: string;
  amount: number;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  categoryId: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const recurring = await prisma.recurringTransaction.create({
    data: {
      ...data,
      userId: session.user.id,
      startDate: data.startDate || new Date(),
    },
  });

  revalidatePath("/recurrentes");
  revalidatePath("/dashboard");
  return recurring;
}

export async function updateRecurringTransaction(
  id: string,
  data: {
    description?: string;
    amount?: number;
    type?: TransactionType;
    frequency?: RecurrenceFrequency;
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const recurring = await prisma.recurringTransaction.update({
    where: { id, userId: session.user.id },
    data,
  });

  revalidatePath("/recurrentes");
  revalidatePath("/dashboard");
  return recurring;
}

export async function deleteRecurringTransaction(id: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const recurring = await prisma.recurringTransaction.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/recurrentes");
  revalidatePath("/dashboard");
  return recurring;
}
