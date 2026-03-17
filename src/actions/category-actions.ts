"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "./shared";

export async function addCategory(data: {
  name: string;
  color?: string;
  icon?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const category = await prisma.category.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/transacciones");
  revalidatePath("/recurrentes");
  revalidatePath("/presupuestos");

  return category;
}
