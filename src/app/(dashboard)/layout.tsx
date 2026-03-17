import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-background": "transparent",
          "--sidebar": "transparent",
        } as React.CSSProperties
      }
    >
      <div className="mesh-bg flex min-h-screen w-full">
        <AppSidebar className="bg-transparent border-none" />
        <SidebarInset className="bg-[#020617] border border-white/5 md:m-2 md:ml-0 md:rounded-3xl shadow-2xl overflow-hidden shrink-0">
          <main className="flex-1 overflow-y-auto relative pb-24 md:pb-0">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
