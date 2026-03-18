"use client";

import { useState } from "react";
import { Edit2, Wallet, Landmark, CreditCard, Banknote } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { CardActionMenu } from "@/components/comun/card-action-menu";
import { deleteWallet } from "@/actions/financial-actions";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/comun/confirm-delete-dialog";
import { GlowEffect } from "@/components/comun/glow-effect";

interface WalletCardProps {
  wallet: {
    id: string;
    name: string;
    balance: number;
    color: string;
    icon: string;
  };
  currency: string;
  onEdit: () => void;
}

export function WalletCard({ wallet, currency, onEdit }: WalletCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWallet(wallet.id);
      toast.success("Cuenta eliminada correctamente");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Error al eliminar la cuenta");
    } finally {
      setIsDeleting(false);
    }
  };

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "bank": return <Landmark className="h-5 w-5" />;
      case "card": return <CreditCard className="h-5 w-5" />;
      case "cash": return <Banknote className="h-5 w-5" />;
      default: return <Wallet className="h-5 w-5" />;
    }
  };

  return (
    <>
      <div className="group relative bg-white/3 border border-white/6 rounded-[32px] p-6 hover:bg-white/5 transition-all duration-500 overflow-hidden">
        <GlowEffect 
          color={wallet.color} 
          className="-right-10 -top-10 group-hover:opacity-20" 
          size="w-32 h-32"
          opacity={0.1}
        />

        <div className="relative z-10 flex items-start justify-between mb-6">
          <div 
            className="p-4 rounded-2xl border border-white/10 shadow-lg"
            style={{ backgroundColor: `${wallet.color}15`, color: wallet.color }}
          >
            {getIcon(wallet.icon)}
          </div>

          <CardActionMenu
            onEdit={onEdit}
            onDelete={() => setIsDeleteDialogOpen(true)}
            editIcon={Edit2}
          />
        </div>

        <div className="space-y-1 relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Nombre de la cuenta</p>
          <h3 className="text-xl font-bold text-white">{wallet.name}</h3>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-end justify-between relative z-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Balance Actual</p>
            <p className="text-2xl font-black text-white tabular-nums">
              {formatCurrency(wallet.balance, currency)}
            </p>
          </div>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="¿Eliminar cuenta?"
        description={`Estás a punto de eliminar la cuenta "${wallet.name}". Esta acción no se puede deshacer y perderás todos los registros asociados.`}
      />
    </>
  );
}
