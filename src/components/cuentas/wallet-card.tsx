"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Edit2, MoreVertical, Wallet, Landmark, CreditCard, Banknote, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteWallet } from "@/actions/financial-actions";
import { toast } from "sonner";

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
        {/* Decorative background glow */}
        <div 
          className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[60px] opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none"
          style={{ backgroundColor: wallet.color }}
        />

        <div className="relative z-10 flex items-start justify-between mb-6">
          <div 
            className="p-4 rounded-2xl border border-white/10 shadow-lg"
            style={{ backgroundColor: `${wallet.color}15`, color: wallet.color }}
          >
            {getIcon(wallet.icon)}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 rounded-xl text-white/20 hover:text-white/60 hover:bg-white/5 transition-all outline-none cursor-pointer">
              <MoreVertical className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0c0e14] border-white/10 text-white min-w-[160px]">
              <DropdownMenuItem onClick={onEdit} className="gap-2 focus:bg-white/5 cursor-pointer py-3">
                <Edit2 className="h-4 w-4 text-indigo-400" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="gap-2 focus:bg-red-500/10 text-red-500 focus:text-red-400 cursor-pointer py-3">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-[#0c0e14] border-white/10 text-white rounded-3xl p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold text-white">¿Eliminar cuenta?</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-white/60 text-sm leading-relaxed">
              Estás a punto de eliminar la cuenta <strong className="text-white">{wallet.name}</strong>. Esta acción no se puede deshacer y perderás todos los registros asociados.
            </p>
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="hover:bg-white/5 text-white/60 hover:text-white rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
