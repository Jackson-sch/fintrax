"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "./shared";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await getSession();
  if (!session?.user?.id) return [];

  return await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function markNotificationAsRead(id: string) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.update({
    where: { id, userId: session.user.id },
    data: { read: true },
  });

  revalidatePath("/dashboard");
}

export async function markAllAsRead() {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/dashboard");
}

export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
}) {
  return await prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || "INFO",
      link: data.link,
    },
  });
}
