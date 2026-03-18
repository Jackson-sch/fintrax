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
    include: { wallet: true },
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
  walletId?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const userId = session.user.id;

  const loan = await prisma.$transaction(async (tx) => {
    const newLoan = await tx.loan.create({
      data: {
        ...data,
        userId,
      },
    });

    if (data.walletId) {
      // LOAN (borrowing) increases wallet (+cash)
      // COLLECTION (lending) decreases wallet (-cash)
      const balanceChange = data.type === "LOAN" ? data.amount : -data.amount;
      await tx.wallet.update({
        where: { id: data.walletId, userId },
        data: {
          balance: { increment: balanceChange },
        },
      });
    }

    return newLoan;
  });

  revalidatePath("/prestamos");
  revalidatePath("/dashboard");
  revalidatePath("/cuentas");
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
    walletId?: string;
  },
) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const userId = session.user.id;

  const result = await prisma.$transaction(async (tx) => {
    const existingLoan = await tx.loan.findUnique({
      where: { id, userId },
    });

    if (!existingLoan) throw new Error("Loan not found");

    const updatedLoan = await tx.loan.update({
      where: { id, userId },
      data,
    });

    // Handle paidAmount changes
    if (data.paidAmount !== undefined && data.paidAmount !== existingLoan.paidAmount && updatedLoan.walletId) {
      const diff = data.paidAmount - existingLoan.paidAmount;
      // If I borrowed (LOAN), paying money (increment paidAmount) decreases my wallet balance
      // If I lent (COLLECTION), receiving money (increment paidAmount) increases my wallet balance
      const balanceChange = updatedLoan.type === "LOAN" ? -diff : diff;

      await tx.wallet.update({
        where: { id: updatedLoan.walletId, userId },
        data: {
          balance: { increment: balanceChange },
        },
      });
    }

    return updatedLoan;
  });

  revalidatePath("/prestamos");
  revalidatePath("/dashboard");
  revalidatePath("/cuentas");
  return result;
}

export async function deleteLoan(id: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const userId = session.user.id;

  const result = await prisma.$transaction(async (tx) => {
    const loan = await tx.loan.findUnique({
      where: { id, userId },
    });

    if (!loan) throw new Error("Loan not found");

    // Revert balance effects if it had a wallet associated
    if (loan.walletId) {
      // Revert initial creation:
      // If LOAN (+amount), revert is -amount. If COLLECTION (-amount), revert is +amount.
      const initialRevert = loan.type === "LOAN" ? -loan.amount : loan.amount;
      
      // Revert payments:
      // If LOAN (payments were -paidAmount), revert is +paidAmount.
      // If COLLECTION (payments were +paidAmount), revert is -paidAmount.
      const paymentsRevert = loan.type === "LOAN" ? loan.paidAmount : -loan.paidAmount;
      
      await tx.wallet.update({
        where: { id: loan.walletId, userId },
        data: {
          balance: { increment: initialRevert + paymentsRevert },
        },
      });
    }

    return await tx.loan.delete({
      where: { id, userId },
    });
  });

  revalidatePath("/prestamos");
  revalidatePath("/dashboard");
  revalidatePath("/cuentas");
  return result;
}
