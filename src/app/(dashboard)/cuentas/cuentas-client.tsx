"use client";

import { useState } from "react";
import { Header } from "@/components/sidebar/header";
import { Plus, Wallet, TrendingUp, CreditCard, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { WalletCard } from "@/components/cuentas/wallet-card";
import { WalletDialog } from "@/components/cuentas/wallet-dialog";

interface WalletItem {
  id: string;
  name: string;
  balance: number;
  currency: string;
  color: string;
  icon: string;
}

interface CuentasClientProps {
  initialWallets: WalletItem[];
  currency: string;
}

export function CuentasClient({
  initialWallets,
  currency,
}: CuentasClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editWallet, setEditWallet] = useState<WalletItem | null>(null);

  const totalBalance = initialWallets.reduce(
    (acc, curr) => acc + curr.balance,
    0,
  );

  return (
    <>
      <Header
        title="Mis Cuentas"
        subtitle="Gestiona tus bancos, tarjetas y efectivo"
      />

      <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-linear-to-br from-indigo-600/20 via-violet-600/10 to-transparent border border-white/6 rounded-[40px] p-10 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-indigo-400">
                <TrendingUp className="h-3.5 w-3.5" /> Balance Consolidado
              </div>
              <h2 className="text-5xl font-black text-white tracking-tighter">
                {new Intl.NumberFormat("es-PE", {
                  style: "currency",
                  currency,
                }).format(totalBalance)}
              </h2>
              <p className="text-sm text-white/40 font-medium">
                Suma total de todas tus cuentas activas.
              </p>
            </div>

            <div className="relative z-10">
              <button
                onClick={() => {
                  setEditWallet(null);
                  setIsDialogOpen(true);
                }}
                className="h-14 px-8 bg-indigo-500 text-white font-bold rounded-[22px] hover:bg-indigo-400 transition-all flex items-center gap-3 shadow-2xl shadow-indigo-500/20"
              >
                <Plus className="h-5 w-5" /> Nueva Cuenta
              </button>
            </div>

            <div className="absolute right-[-5%] bottom-[-10%] text-white/5 scale-[4] rotate-12 pointer-events-none">
              <Wallet className="h-40 w-40" />
            </div>
          </div>

          <div className="bg-white/3 border border-white/6 rounded-[40px] p-8 flex flex-col justify-center gap-6">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                Distribución
              </p>
              <div className="space-y-3">
                {initialWallets.slice(0, 3).map((w) => (
                  <div key={w.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: w.color }}
                      />
                      <span className="text-xs text-white/60 font-medium">
                        {w.name}
                      </span>
                    </div>
                    <span className="text-xs text-white font-bold">
                      {Math.round((w.balance / (totalBalance || 1)) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialWallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              currency={currency}
              onEdit={() => {
                setEditWallet(wallet);
                setIsDialogOpen(true);
              }}
            />
          ))}

          {initialWallets.length === 0 && (
            <div className="col-span-full py-20 bg-white/2 border border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-center">
              <div className="p-6 bg-white/5 rounded-3xl mb-4">
                <Landmark className="h-10 w-10 text-white/10" />
              </div>
              <p className="text-white/20 font-bold">
                No tienes cuentas registradas todavía
              </p>
            </div>
          )}
        </div>
      </div>

      <WalletDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editWallet || undefined}
        currency={currency}
      />
    </>
  );
}
