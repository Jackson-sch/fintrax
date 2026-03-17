"use client";

import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard as LayoutDashboardIcon,
  List as ListIcon,
  ChartBar as ChartBarIcon,
  DollarSign as DollarSignIcon,
  Bell as BellIcon,
  Settings2 as Settings2Icon,
  CircleHelp as CircleHelpIcon,
  Command as CommandIcon,
  Repeat,
  Target,
  Wallet,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Transacciones",
      url: "/transacciones",
      icon: <ListIcon />,
    },
    {
      title: "Recurrentes",
      url: "/recurrentes",
      icon: <Repeat className="h-4 w-4" />,
    },
    {
      title: "Préstamos",
      url: "/prestamos",
      icon: <DollarSignIcon />,
    },
    {
      title: "Metas",
      url: "/metas",
      icon: <Target className="h-4 w-4" />,
    },
    {
      title: "Cuentas",
      url: "/cuentas",
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      title: "Presupuestos",
      url: "/presupuestos",
      icon: <ChartBarIcon />,
    },
    {
      title: "Reportes",
      url: "/reportes",
      icon: <ChartBarIcon />,
    },
    {
      title: "Alertas",
      url: "/alertas",
      icon: <BellIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "/configuracion",
      icon: <Settings2Icon />,
    },
    {
      title: "Ayuda",
      url: "/ayuda",
      icon: <CircleHelpIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const user = {
    name: session?.user?.name || "Usuario",
    email: session?.user?.email || "",
    image: session?.user?.image || "",
  };

  return (
    <Sidebar
      variant="inset"
      collapsible="offcanvas"
      className="bg-transparent border-none"
      {...props}
    >
      <SidebarHeader className="p-0 border-none">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-4!"
              render={
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden shadow-lg shadow-blue-500/20">
                    <Image
                      src="/icon-fintrax.png"
                      alt="Fintrax"
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight text-white">
                    <span className="truncate font-bold">Fintrax</span>
                    <span className="truncate text-xs text-slate-400">
                      Premium Dashboard
                    </span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-transparent text-white">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
