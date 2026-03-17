"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "./shared";

export async function getSavingGoals() {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  return await prisma.savingGoal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function addSavingGoal(data: {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  deadline?: Date;
  color?: string;
  icon?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const goal = await prisma.savingGoal.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  revalidatePath("/metas");
  revalidatePath("/dashboard");
  return goal;
}

export async function updateSavingGoal(
  id: string,
  data: {
    name?: string;
    targetAmount?: number;
    currentAmount?: number;
    deadline?: Date;
    color?: string;
    icon?: string;
  }
) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const goal = await prisma.savingGoal.update({
    where: { id, userId: session.user.id },
    data,
  });

  revalidatePath("/metas");
  revalidatePath("/dashboard");
  return goal;
}

export async function addFundsToGoal(id: string, amount: number, walletId?: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const userId = session.user.id;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Update Goal
    const goal = await tx.savingGoal.update({
      where: { id, userId },
      data: {
        currentAmount: { increment: amount },
      },
    });

    // 2. Update Wallet if provided
    if (walletId) {
      await tx.wallet.update({
        where: { id: walletId, userId },
        data: {
          balance: { decrement: amount },
        },
      });
    }

    return goal;
  });

  revalidatePath("/metas");
  revalidatePath("/dashboard");
  revalidatePath("/cuentas");
  return result;
}

export async function deleteSavingGoal(id: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const goal = await prisma.savingGoal.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/metas");
  revalidatePath("/dashboard");
  return goal;
}
