import { Header } from "@/components/sidebar/header";
import { AlertasClient } from "./alertas-client";
import { getAlertSettings } from "@/actions/financial-actions";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export const metadata = {
  title: "Alertas | Fintrax",
  description: "Gestiona tus notificaciones y preferencias de cuenta.",
};

export default async function AlertasPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  const alerts = await getAlertSettings();
  const currency = session?.data?.user?.currency || "USD";

  return (
    <>
      <Header
        title="Alertas & Configuración"
        subtitle="Gestiona tus notificaciones y preferencias de cuenta."
      />
      <AlertasClient initialAlerts={alerts as any} initialCurrency={currency} />
    </>
  );
}
