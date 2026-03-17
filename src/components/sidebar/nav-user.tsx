"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  EllipsisVerticalIcon,
  CircleUserRoundIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    image: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-white/5 hover:bg-white/5 text-white transition-colors"
              >
                <Avatar className="size-8 rounded-lg border border-white/10">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-blue-600 font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-slate-400">
                    {user.email}
                  </span>
                </div>
                <EllipsisVerticalIcon className="ml-auto size-4 text-slate-400" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="min-w-56 bg-slate-950 border-white/10 text-white p-2 rounded-2xl shadow-2xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                  <Avatar className="size-8 rounded-lg border border-white/10">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-blue-600 font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-slate-400">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/configuracion")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white transition-all"
              >
                <CircleUserRoundIcon className="size-4 text-slate-400" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/alertas")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white transition-all"
              >
                <BellIcon className="size-4 text-slate-400" />
                <span>Notificaciones</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 cursor-pointer focus:bg-rose-500/10 focus:text-rose-400 transition-all"
            >
              <LogOutIcon className="size-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
