"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

/**
 * Fetches the user's preferred currency.
 */
export async function getUserCurrency(): Promise<string> {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { currency: true },
  });

  return user?.currency || "USD";
}
