"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "./shared";

export async function getLoans() {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const userId = session.user.id;

  return await prisma.loan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function addLoan(data: {
  entityName: string;
  type: "LOAN" | "COLLECTION";
  amount: number;
  interestRate?: number;
  dueDate?: Date;
  notes?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const loan = await prisma.loan.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  revalidatePath("/prestamos");
  return loan;
}

export async function updateLoan(
  id: string,
  data: {
    entityName?: string;
    type?: "LOAN" | "COLLECTION";
    amount?: number;
    interestRate?: number;
    dueDate?: Date;
    paidAmount?: number;
    status?: "ACTIVE" | "PAID" | "OVERDUE" | "CANCELLED";
    notes?: string;
  },
) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const loan = await prisma.loan.update({
    where: {
      id,
      userId: session.user.id,
    },
    data,
  });

  revalidatePath("/prestamos");
  return loan;
}

export async function deleteLoan(id: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const loan = await prisma.loan.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/prestamos");
  revalidatePath("/dashboard");
  return loan;
}
