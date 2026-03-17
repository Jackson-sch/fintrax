"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "./shared";
import { format } from "date-fns";

export async function exportTransactionsCSV() {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    include: {
      category: true,
      wallet: true,
      tags: true,
    },
    orderBy: { date: "desc" },
  });

  const header = ["Fecha", "Descripción", "Monto", "Tipo", "Categoría", "Cuenta", "Etiquetas"];
  const rows = transactions.map((t) => [
    format(t.date, "yyyy-MM-dd"),
    t.description,
    t.amount.toString(),
    t.type,
    t.category?.name || "",
    t.wallet?.name || "",
    t.tags.map((tag) => tag.name).join("; "),
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return csvContent;
}

export async function importTransactionsCSV(records: any[]) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const results = await prisma.$transaction(
    records.map((r) =>
      prisma.transaction.create({
        data: {
          description: r.description,
          amount: parseFloat(r.amount),
          type: r.type,
          date: new Date(r.date),
          userId: session.user.id,
          categoryId: r.categoryId || null,
          walletId: r.walletId || null,
        },
      })
    )
  );

  return results.length;
}
