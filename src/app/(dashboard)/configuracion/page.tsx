import { Header } from "@/components/sidebar/header";
import { ConfiguracionClient } from "./configuracion-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Configuración y Perfil | Fintrax",
  description:
    "Administra tu perfil, moneda principal y configuración general.",
};

export default async function ConfiguracionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  // Reload user from db to get the exact latest name and currency
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return null;

  return (
    <>
      <Header
        title="Configuración"
        subtitle="Administra tu perfil de usuario y preferencias"
      />
      <ConfiguracionClient user={user} />
    </>
  );
}
