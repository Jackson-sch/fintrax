"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addRecurringTransaction,
  updateRecurringTransaction,
} from "@/actions/financial-actions";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CategoryDialog } from "@/components/categorias/category-dialog";
import { Repeat, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

const recurringSchema = z.object({
  description: z.string().min(1, "La descripción es requerida"),
  amount: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  frequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "YEARLY"]),
  categoryId: z.string().min(1, "La categoría es requerida"),
  startDate: z.date().optional(),
});

type FormValues = z.infer<typeof recurringSchema>;

interface RecurringDialogProps {
  categories: { id: string; name: string }[];
  initialData?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  currency?: string;
}

const FREQUENCIES = [
  { value: "DAILY", label: "Diario" },
  { value: "WEEKLY", label: "Semanal" },
  { value: "BIWEEKLY", label: "Quincenal" },
  { value: "MONTHLY", label: "Mensual" },
  { value: "YEARLY", label: "Anual" },
] as const;

export function RecurringDialog({
  categories,
  initialData,
  open: controlledOpen,
  onOpenChange,
  trigger,
  currency = "PEN",
}: RecurringDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const form = useForm<FormValues>({
    resolver: zodResolver(recurringSchema) as any,
    defaultValues: {
      description: initialData?.description || "",
      amount: initialData?.amount || 0,
      type: initialData?.type || "EXPENSE",
      frequency: initialData?.frequency || "MONTHLY",
      categoryId: initialData?.categoryId || "",
      startDate: initialData?.startDate
        ? new Date(initialData.startDate)
        : new Date(),
    },
  });

  // Sync form values when initialData changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        description: initialData?.description || "",
        amount: initialData?.amount || 0,
        type: initialData?.type || "EXPENSE",
        frequency: initialData?.frequency || "MONTHLY",
        categoryId: initialData?.categoryId || "",
        startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
      });
    }
  }, [open, initialData, form]);

  const currentType = form.watch("type");
  const isIncome = currentType === "INCOME";

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const data = { ...values, startDate: values.startDate || new Date() };
      if (initialData) {
        await updateRecurringTransaction(initialData.id, data);
        toast.success("Recurrencia actualizada correctamente");
      } else {
        await addRecurringTransaction(data);
        toast.success("Recurrencia creada correctamente");
      }
      setOpen(false);
      form.reset();
    } catch {
      toast.error("Error al guardar la recurrencia");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared input style — no colored borders
  const inputCls = cn(
    "bg-white/6 border border-white/10 text-white h-14! w-full rounded-2xl transition-all outline-none",
    "hover:bg-white/10 hover:border-white/15",
    "focus:bg-white/12 focus:border-white/25",
    "placeholder:text-white/20",
  );

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger} />}

      <DialogContent className="sm:max-w-[460px] bg-[#0c0e14] border border-white/6 text-white p-0 overflow-hidden rounded-3xl shadow-2xl">


        {/* Subtle radial glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none bg-violet-400" />
        <div className="absolute -bottom-24 left-1/8 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none bg-indigo-500" />

        <div className="relative z-10 px-5 pt-6 pb-6 md:px-8 md:pt-8 md:pb-7 space-y-6">
          {/* Header */}
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-xl md:text-[1.6rem] font-bold tracking-tight text-white">
                  {initialData ? "Editar recurrencia" : "Nueva recurrencia"}
                </DialogTitle>
                <p className="text-sm text-white/30 font-medium">
                  Transacciones automáticas periódicas
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/6 border border-white/8">
                <Repeat className="h-5 w-5 text-violet-400" />
              </div>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* ── Type toggle ── */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-white/4 rounded-2xl border border-white/6">
                      {(["INCOME", "EXPENSE"] as const).map((t) => {
                        const active = field.value === t;
                        const isInc = t === "INCOME";
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => field.onChange(t)}
                            className={cn(
                              "flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
                              active
                                ? isInc
                                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/40"
                                  : "bg-rose-500 text-white shadow-lg shadow-rose-900/40"
                                : "text-white/25 hover:text-white/50",
                            )}
                          >
                            {isInc ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            {isInc ? "Ingreso" : "Gasto"}
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ── Description ── */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                      Descripción
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="Ej. Suscripción Netflix"
                          {...field}
                          className={cn(inputCls, "px-4")}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs ml-1" />
                  </FormItem>
                )}
              />

              {/* ── Amount + Frequency ── */}
              <div className="grid md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                        Monto
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
                            className={cn(inputCls, "pl-16 pr-4 text-lg font-bold")}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs ml-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                        Frecuencia
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn(inputCls, "px-4")}>
                            <SelectValue placeholder="Frecuencia">
                              {field.value
                                ? FREQUENCIES.find((f) => f.value === field.value)?.label
                                : "Frecuencia"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#111318] border border-white/8 text-white rounded-2xl shadow-2xl">
                          {FREQUENCIES.map(({ value, label }) => (
                            <SelectItem
                              key={value}
                              value={value}
                              className="rounded-xl my-0.5 cursor-pointer focus:bg-white/8 focus:text-white"
                            >
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-rose-400 text-xs ml-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* ── Category + Start date ── */}
              <div className="grid md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                        Categoría
                      </FormLabel>
                      <Select 
                        onValueChange={(val) => {
                          if (val === "NEW_CATEGORY") {
                            setIsCategoryDialogOpen(true);
                          } else {
                            field.onChange(val);
                          }
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={cn(inputCls, "px-4")}>
                            <SelectValue placeholder="Elegir">
                              {field.value
                                ? localCategories.find((c) => c.id === field.value)?.name
                                : "Elegir"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#111318] border border-white/8 text-white rounded-2xl shadow-2xl max-h-[300px]">
                          {localCategories.map((cat) => (
                            <SelectItem
                              key={cat.id}
                              value={cat.id}
                              className="rounded-xl my-0.5 cursor-pointer focus:bg-white/8 focus:text-white"
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                          <div className="h-px bg-white/5 my-1 mx-2" />
                          <SelectItem
                            value="NEW_CATEGORY"
                            className="rounded-xl my-0.5 cursor-pointer text-violet-400 focus:bg-violet-500/10 focus:text-violet-300 font-bold justify-center"
                          >
                            + Nueva Categoría
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-rose-400 text-xs ml-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                        Fecha de inicio
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onChange={field.onChange}
                          placeholder="dd/mm/aaaa"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs ml-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* ── Divider ── */}
              <div className="border-t border-white/8" />

              {/* ── Submit ── */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white font-bold py-7 rounded-2xl text-base tracking-wide transition-all duration-300 border border-white/8 shadow-xl bg-linear-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 shadow-violet-900/30 relative overflow-hidden group"
              >
                {/* Shimmer */}
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg fill="none" className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 0 1 8-8v8z" className="opacity-75"/></svg>
                      Guardando…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      {initialData ? "Actualizar regla" : "Crear regla"}
                    </>
                  )}
                </span>
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>

    {/* Nested Category Dialog */}
    <CategoryDialog
      open={isCategoryDialogOpen}
      onOpenChange={setIsCategoryDialogOpen}
      onSuccess={(newCat) => {
        setLocalCategories((prev) => [...prev, newCat]);
        form.setValue("categoryId", newCat.id);
      }}
    />
    </>
  );
}