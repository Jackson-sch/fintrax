"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "./shared";

export async function getWallets() {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  return await prisma.wallet.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function addWallet(data: {
  name: string;
  balance?: number;
  currency?: string;
  color?: string;
  icon?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const wallet = await prisma.wallet.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  revalidatePath("/cuentas");
  revalidatePath("/dashboard");
  return wallet;
}

export async function updateWallet(
  id: string,
  data: {
    name?: string;
    balance?: number;
    currency?: string;
    color?: string;
    icon?: string;
  }
) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const wallet = await prisma.wallet.update({
    where: { id, userId: session.user.id },
    data,
  });

  revalidatePath("/cuentas");
  revalidatePath("/dashboard");
  return wallet;
}

export async function deleteWallet(id: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const wallet = await prisma.wallet.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/cuentas");
  revalidatePath("/dashboard");
  return wallet;
}
