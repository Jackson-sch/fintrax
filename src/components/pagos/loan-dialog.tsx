"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  HandCoins,
  TrendingDown,
  TrendingUp,
  User,
  Percent,
  FileText,
  CheckCircle2,
  PencilLine,
  Wallet as WalletIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { addLoan, updateLoan } from "@/actions/financial-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { WalletSelect } from "@/components/cuentas/wallet-select";

const formSchema = z.object({
  entityName: z.string().min(2, "Nombre de la entidad requerido"),
  amount: z.coerce.number().gt(0, "El monto debe ser mayor a 0"),
  type: z.enum(["LOAN", "COLLECTION"]),
  interestRate: z.coerce
    .number()
    .min(0, "El interés no puede ser negativo")
    .optional(),
  dueDate: z.date().optional(),
  notes: z.string().optional(),
  walletId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LoanDialogProps {
  trigger?: React.ReactElement;
  defaultType?: "LOAN" | "COLLECTION";
  currency?: string;
  initialData?: {
    id: string;
    entityName: string;
    amount: number;
    type: "LOAN" | "COLLECTION";
    interestRate: number;
    dueDate?: Date | null;
    notes?: string | null;
    walletId?: string | null;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

export function LoanDialog({
  trigger,
  defaultType = "COLLECTION",
  currency = "USD",
  initialData,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  hideTrigger = false,
}: LoanDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      entityName: initialData?.entityName || "",
      amount: initialData?.amount || 0,
      type: initialData?.type || defaultType,
      interestRate: initialData?.interestRate || 0,
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
      notes: initialData?.notes || "",
      walletId: initialData?.walletId || "NO_WALLET",
    },
  });

  const isCollection = form.watch("type") === "COLLECTION";

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...values,
        walletId: values.walletId === "NO_WALLET" ? null : values.walletId,
      };

      if (initialData) {
        await updateLoan(initialData.id, submitData as any);
      } else {
        await addLoan(submitData as any);
      }
      toast.success(
        values.type === "COLLECTION"
          ? initialData
            ? "Cobro actualizado correctamente"
            : "Cobro registrado correctamente"
          : initialData
            ? "Préstamo actualizado correctamente"
            : "Préstamo registrado correctamente",
      );
      setOpen(false);
      form.reset({
        entityName: "",
        amount: 0,
        type: values.type,
        interestRate: 0,
        notes: "",
        dueDate: undefined,
        walletId: "NO_WALLET",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar el movimiento");
    } finally {
      setIsSubmitting(false);
    }
  }

  const defaultTrigger = (
    <Button className="relative overflow-hidden bg-linear-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white rounded-2xl shadow-lg shadow-violet-900/40 px-6 py-5 font-semibold tracking-wide transition-all duration-300 group">
      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
      Nuevo Registro
    </Button>
  );

  const accent = isCollection
    ? {
        glow: "shadow-emerald-500/20",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        gradient: "from-emerald-500 to-teal-500",
        buttonBg: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-700/40",
        glowColor: "bg-emerald-400",
      }
    : {
        glow: "shadow-amber-500/20",
        border: "border-amber-500/30",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        gradient: "from-amber-500 to-orange-500",
        buttonBg: "bg-amber-600 hover:bg-amber-500 shadow-amber-700/40",
        glowColor: "bg-amber-400",
      };

  const inputCls = cn(
    "bg-white/6 border border-white/10 text-white h-14 rounded-2xl transition-all outline-none",
    "hover:bg-white/10 hover:border-white/15",
    "focus:bg-white/12 focus:border-white/25",
    "placeholder:text-white/20",
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger render={trigger || defaultTrigger} />
      )}

      <DialogContent
        className={cn(
          "sm:max-w-[480px] bg-[#0c0e14] border border-white/6 text-white p-0 overflow-hidden rounded-3xl shadow-2xl",
          accent.glow,
        )}
      >
        <div
          className={cn(
            "absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none",
            accent.glowColor,
          )}
        />

        <div className="relative z-10 px-5 pt-6 pb-6 md:px-8 md:pt-8 md:pb-7 space-y-6">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-xl md:text-[1.6rem] font-bold tracking-tight text-white">
                  {initialData ? "Editar registro" : "Nuevo registro"}
                </DialogTitle>
                <p className="text-sm text-white/30 font-medium">
                  {isCollection
                    ? "Dinero que te deben cobrar"
                    : "Dinero que debes pagar"}
                </p>
              </div>
              <div
                className={cn(
                  "p-2.5 rounded-2xl border",
                  accent.bg,
                  accent.border,
                )}
              >
                {initialData ? (
                  <PencilLine className={cn("h-5 w-5", accent.text)} />
                ) : (
                  <HandCoins className={cn("h-5 w-5", accent.text)} />
                )}
              </div>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-white/4 rounded-2xl border border-white/6">
                      {(["COLLECTION", "LOAN"] as const).map((t) => {
                        const active = field.value === t;
                        const isCol = t === "COLLECTION";
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => field.onChange(t)}
                            className={cn(
                              "relative flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300",
                              active
                                ? isCol
                                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-800/50"
                                  : "bg-amber-500 text-white shadow-lg shadow-amber-800/50"
                                : "text-white/30 hover:text-white/60",
                            )}
                          >
                            {isCol ? (
                              <TrendingDown className="h-4 w-4" />
                            ) : (
                              <TrendingUp className="h-4 w-4" />
                            )}
                            {isCol ? "Cobro" : "Préstamo"}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-white/25 text-center mt-1.5">
                      {isCollection
                        ? "↙ Alguien te debe a ti"
                        : "↗ Tú le debes a alguien"}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                      Nombre / Entidad
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
                        <Input
                          placeholder="Ej. Banco, Carlos, María…"
                          {...field}
                          className={cn(inputCls, "pl-11")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs ml-1" />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                        Monto principal
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/25 bg-white/6 border border-white/8 px-2 py-1 rounded-lg pointer-events-none">
                            {currency}
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            className={cn(inputCls, "pl-16 text-xl font-bold")}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs ml-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                        Interés
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            {...field}
                            className={cn(inputCls, "pl-11")}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs ml-1" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                      Fecha de vencimiento
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value ?? undefined}
                        onChange={field.onChange}
                        placeholder="Seleccionar fecha (opcional)"
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs ml-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="walletId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                      Cuenta asociada
                    </FormLabel>
                    <WalletSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      currency={currency}
                      allowNone={true}
                      showBalance={false}
                    />
                    <FormMessage className="text-rose-400 text-xs ml-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                      Notas
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
                        <Input
                          placeholder="Información adicional… (opcional)"
                          {...field}
                          className={cn(inputCls, "pl-11")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs ml-1" />
                  </FormItem>
                )}
              />

              <div className="border-t border-white/5" />

              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full text-white font-bold py-7 rounded-2xl text-base tracking-wide transition-all duration-300",
                  "border border-white/8 shadow-xl",
                  accent.buttonBg,
                  "relative overflow-hidden group",
                )}
              >
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    "Registrando…"
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      {initialData
                        ? "Guardar cambios"
                        : isCollection
                        ? "Confirmar cobro"
                        : "Confirmar préstamo"}
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
