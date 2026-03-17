"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "./shared";

const DEFAULT_TAGS = [
  { name: "Importante", color: "#ef4444" },
  { name: "Trabajo", color: "#3b82f6" },
  { name: "Ocio", color: "#ec4899" },
  { name: "Viajes", color: "#f97316" },
  { name: "Salud", color: "#10b981" },
  { name: "Suscripción", color: "#8b5cf6" },
];

export async function getTags() {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const tags = await prisma.tag.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });

  if (tags.length === 0) {
    // Seed default tags safely using upsert to prevent duplicates
    for (const tag of DEFAULT_TAGS) {
      await prisma.tag.upsert({
        where: {
          name_userId: {
            name: tag.name,
            userId: session.user.id
          }
        },
        update: {}, // Don't update if already exists
        create: {
          ...tag,
          userId: session.user.id,
        },
      });
    }

    return await prisma.tag.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    });
  }

  return tags;
}

export async function addTag(data: {
  name: string;
  color?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const tag = await prisma.tag.upsert({
    where: {
      name_userId: {
        name: data.name,
        userId: session.user.id,
      },
    },
    update: {
      color: data.color,
    },
    create: {
      ...data,
      userId: session.user.id,
    },
  });

  revalidatePath("/transacciones");
  return tag;
}

export async function deleteTag(id: string) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const tag = await prisma.tag.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/transacciones");
  return tag;
}
