"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addWallet, updateWallet } from "@/actions/financial-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CheckCircle2, Wallet, Landmark, CreditCard, Banknote } from "lucide-react";

const walletSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  balance: z.coerce.number(),
  color: z.string().min(1, "Selecciona un color"),
  icon: z.string().min(1, "Selecciona un icono"),
});

type FormValues = z.infer<typeof walletSchema>;

interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id: string;
    name: string;
    balance: number;
    color: string;
    icon: string;
  };
  currency: string;
  onSuccess?: (wallet: { id: string; name: string; color: string; balance: number }) => void;
}

const COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", 
  "#f59e0b", "#10b981", "#06b6d4", "#6366f1"
];

const ICONS = [
  { id: "wallet", icon: Wallet },
  { id: "bank", icon: Landmark },
  { id: "card", icon: CreditCard },
  { id: "cash", icon: Banknote },
];

export function WalletDialog({ open, onOpenChange, initialData, currency, onSuccess }: WalletDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(walletSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      balance: initialData?.balance || 0,
      color: initialData?.color || COLORS[0],
      icon: initialData?.icon || "wallet",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name || "",
        balance: initialData?.balance || 0,
        color: initialData?.color || COLORS[0],
        icon: initialData?.icon || "wallet",
      });
    }
  }, [open, initialData, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateWallet(initialData.id, values);
        toast.success("Cuenta actualizada correctamente");
      } else {
        const wallet = await addWallet(values);
        toast.success("Cuenta creada correctamente");
        onSuccess?.(wallet as any);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Error al guardar la cuenta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "bg-white/6 border border-white/10 text-white h-12 rounded-xl focus:bg-white/12 focus:border-white/25 transition-all outline-none placeholder:text-white/10";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-[#0c0e14] border-white/10 text-white p-0 overflow-hidden rounded-3xl">

        {/* Subtle radial glow behind the form */}
          <div
            className={cn(
              "absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none",
              "bg-amber-400",
            )}
          />
        
        <div className="px-5 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight">
              {initialData ? "Editar Cuenta" : "Nueva Cuenta"}
            </DialogTitle>
            <p className="text-sm text-white/30">Registra tus medios de pago y ahorros</p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nombre de la cuenta</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. BCP Debito, Efectivo..." {...field} className={inputCls} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40">Balance Inicial ({currency})</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/25 bg-white/6 border border-white/8 px-2 py-1 rounded-lg pointer-events-none">
                          {currency}
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          className={cn(inputCls, "pl-16")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40">Icono</FormLabel>
                      <div className="flex gap-2 flex-wrap">
                        {ICONS.map((item) => {
                          const IconComp = item.icon;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => field.onChange(item.id)}
                              className={cn(
                                "p-2.5 rounded-xl border transition-all",
                                field.value === item.id 
                                  ? "bg-white/10 border-white/20 text-white" 
                                  : "bg-white/2 border-white/5 text-white/20 hover:text-white/40"
                              )}
                            >
                              <IconComp className="h-4 w-4" />
                            </button>
                          );
                        })}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40">Color</FormLabel>
                      <div className="flex gap-2 flex-wrap">
                        {COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => field.onChange(c)}
                            className={cn(
                              "w-6 h-6 rounded-full border-2 transition-all",
                              field.value === c ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-100"
                            )}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 bg-amber-400 text-black hover:bg-amber-500 rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all relative overflow-hidden"
              >
                {/* Shimmer on hover */}
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? "Guardando..." : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    {initialData ? "Actualizar Cuenta" : "Crear Cuenta"}
                  </>
                )}
                </span>
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
