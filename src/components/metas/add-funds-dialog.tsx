"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addFundsToGoal } from "@/actions/financial-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PiggyBank, ArrowUpRight } from "lucide-react";
import { WalletSelect } from "@/components/cuentas/wallet-select";

const fundsSchema = z.object({
  amount: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
  walletId: z.string().optional(),
});

type FormValues = z.infer<typeof fundsSchema>;

interface AddFundsDialogProps {
  goalId: string | null;
  goalName: string | null;
  currency?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFundsDialog({
  goalId,
  goalName,
  currency = "PEN",
  open,
  onOpenChange,
}: AddFundsDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(fundsSchema) as any,
    defaultValues: {
      amount: 0,
      walletId: "NO_WALLET",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!goalId) return;

    try {
      await addFundsToGoal(goalId, values.amount, values.walletId);
      toast.success(`Se agregaron fondos a ${goalName}`);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Error al agregar fondos");
    }
  };

  const inputCls =
    "bg-white/6 border border-white/10 text-white h-14! rounded-2xl focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-white/10 outline-none";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-[#0c0e14] border-white/10 text-white p-0 overflow-hidden rounded-3xl shadow-2xl shadow-emerald-900/10">
        {/* Linear glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-full h-72 bg-linear-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl" />

        <div className="px-8 pt-8 pb-8 space-y-6">
          <DialogHeader className="flex flex-row items-center gap-4 space-y-0 text-left">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <PiggyBank className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <DialogTitle className="text-xl font-bold tracking-tight">
                Abonar Capital
              </DialogTitle>
              <p className="text-sm text-white/40 truncate max-w-full">
                {goalName}
              </p>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                        Monto a depositar
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/25 bg-white/6 border border-white/8 px-2 py-1 rounded-lg pointer-events-none">
                            {currency}
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            className={cn(inputCls, "pl-16 text-xl font-black tabular-nums")}
                            autoFocus
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="walletId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                        Desde cuenta (opcional)
                      </FormLabel>
                      <WalletSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        currency={currency}
                        allowNone={true}
                        noneLabel="Solo meta (no descuenta)"
                        noneValue="NO_WALLET"
                        showBalance={true}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-900/20 transition-all duration-300 group mt-2"
              >
                Confirmar Depósito
                <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
