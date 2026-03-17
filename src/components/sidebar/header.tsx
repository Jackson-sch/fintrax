"use client";

import { useSession } from "@/lib/auth-client";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Bell, LogOut, User as UserIcon } from "lucide-react";
import { NotificationDropdown } from "./notification-dropdown";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

function SafeSidebarTrigger() {
  try {
    const context = useSidebar();
    if (!context) return null;
    return <SidebarTrigger className="text-white hover:bg-white/10" />;
  } catch (e) {
    return null;
  }
}

export function Header({ title, subtitle }: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-8 py-4 bg-transparent backdrop-blur-none border-none">
      <div className="flex items-center gap-4">
        <SafeSidebarTrigger />
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {subtitle && (
            <p className="text-slate-400 text-xs md:text-sm">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger 
            render={
              <button 
                type="button"
                className="h-10 w-10 rounded-full bg-slate-800 border-2 border-white/10 overflow-hidden shadow-xl ring-2 ring-blue-500/20 flex items-center justify-center cursor-pointer hover:border-blue-500/50 transition-all outline-hidden"
              >
                {session?.user?.image ? (
                  <img src={session.user.image} alt={session.user.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-white">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </button>
            }
          />
          <DropdownMenuContent className="bg-slate-950 border-white/10 text-white w-56 p-2 rounded-2xl shadow-2xl mr-4">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs leading-none text-slate-400">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={() => router.push("/configuracion")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white transition-all"
            >
              <UserIcon className="h-4 w-4 text-slate-400" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={async () => {
                await signOut();
                window.location.href = "/login";
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 cursor-pointer focus:bg-rose-500/10 focus:text-rose-400 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
