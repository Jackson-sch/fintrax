"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle2, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNotifications, markNotificationAsRead, markAllAsRead } from "@/actions/notification-actions";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // In a real app, you might want to setup a poller or websocket here
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string, link?: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      if (link) router.push(link);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS": return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "WARNING": return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "ERROR": return <X className="h-4 w-4 text-rose-400" />;
      default: return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors relative outline-hidden">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-slate-950 animate-pulse"></span>
            )}
          </button>
        }
      />
      <DropdownMenuContent className="bg-slate-950/95 border-white/10 text-white w-80 p-0 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden mr-4">
        <div className="p-4 flex items-center justify-between bg-white/5">
          <h3 className="text-sm font-bold">Notificaciones</h3>
          {unreadCount > 0 && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleMarkAllAsRead(); }}
              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Marcar todo como leído
            </button>
          )}
        </div>
        
        <DropdownMenuSeparator className="bg-white/5 m-0" />

        <div className="max-h-[350px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Cargando...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-white/5">
                <Bell className="h-6 w-6 text-slate-600" />
              </div>
              <p className="text-xs text-slate-500">No tienes notificaciones</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id, notification.link)}
                className={cn(
                  "p-4 border-b border-white/5 last:border-0 cursor-pointer transition-colors hover:bg-white/3 group",
                  !notification.read && "bg-blue-500/3"
                )}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={cn(
                      "text-xs leading-none font-semibold",
                      !notification.read ? "text-white" : "text-slate-400"
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <DropdownMenuSeparator className="bg-white/5 m-0" />
        
        <button className="w-full p-3 text-center text-[11px] font-bold text-slate-500 hover:text-slate-300 transition-colors bg-white/5">
          Ver todas las alertas
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
