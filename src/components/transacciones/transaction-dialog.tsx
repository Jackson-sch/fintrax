"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Sparkles,
  CheckCircle2,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addTransaction, updateTransaction } from "@/actions/financial-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { CategoryDialog } from "@/components/categorias/category-dialog";
import { WalletDialog } from "@/components/cuentas/wallet-dialog";
import { TagDialog } from "@/components/transacciones/tag-dialog";
import { formatCurrency } from "@/lib/formatters";

const formSchema = z.object({
  description: z.string().min(2, "Descripción requerida"),
  amount: z.coerce.number().gt(0, "El monto debe ser mayor a 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  walletId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  date: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionDialogProps {
  categories: { id: string; name: string }[];
  wallets?: { id: string; name: string; color: string; balance: number }[];
  tags?: { id: string; name: string; color: string }[];
  trigger?: React.ReactElement;
  defaultType?: "INCOME" | "EXPENSE";
  currency?: string;
  initialData?: {
    id: string;
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    categoryId: string;
    walletId?: string;
    tagIds?: string[];
    date: Date;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

export function TransactionDialog({
  categories,
  wallets,
  tags,
  trigger,
  defaultType = "EXPENSE",
  currency = "PEN",
  initialData,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  hideTrigger = false,
}: TransactionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories);
  const [localWallets, setLocalWallets] = useState(wallets || []);
  const [localTags, setLocalTags] = useState(tags || []);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    if (wallets) setLocalWallets(wallets);
  }, [wallets]);

  useEffect(() => {
    if (tags) setLocalTags(tags);
  }, [tags]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      description: initialData?.description || "",
      amount: initialData?.amount || 0,
      type: initialData?.type || defaultType,
      categoryId: initialData?.categoryId || "",
      walletId: initialData?.walletId || "",
      tagIds: initialData?.tagIds || [],
      date: initialData?.date || new Date(),
    },
  });

  // Sync form values when initialData changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        description: initialData?.description || "",
        amount: initialData?.amount || 0,
        type: initialData?.type || defaultType,
        categoryId: initialData?.categoryId || "",
        walletId: initialData?.walletId || "",
        tagIds: initialData?.tagIds || [],
        date: initialData?.date ? new Date(initialData.date) : new Date(),
      });
    }
  }, [open, initialData, form, defaultType]);

  const currentType = form.watch("type");
  const isIncome = currentType === "INCOME";

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await updateTransaction(initialData.id, values);
        toast.success("Transacción actualizada correctamente");
      } else {
        await addTransaction(values);
        toast.success("Transacción registrada correctamente");
      }
      setOpen(false);
      form.reset({
        description: "",
        amount: 0,
        type: values.type,
        categoryId: "",
        walletId: "",
        tagIds: [],
        date: new Date(),
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar la transacción");
    } finally {
      setIsSubmitting(false);
    }
  }

  const defaultTrigger = (
    <Button className="relative overflow-hidden bg-linear-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white rounded-2xl shadow-lg shadow-violet-900/40 px-6 py-5 font-semibold tracking-wide transition-all duration-300 group">
      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
      Nueva Transacción
    </Button>
  );

  // Dynamic accent colours based on type
  const accent = isIncome
    ? {
        glow: "shadow-emerald-500/20",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        ring: "focus-visible:ring-emerald-500/40",
        gradient: "from-emerald-500 to-teal-500",
        buttonBg: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-700/40",
        strip: "from-emerald-500 via-teal-400 to-emerald-600",
      }
    : {
        glow: "shadow-rose-500/20",
        border: "border-rose-500/30",
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        ring: "focus-visible:ring-rose-500/40",
        gradient: "from-rose-500 to-pink-500",
        buttonBg: "bg-rose-600 hover:bg-rose-500 shadow-rose-700/40",
        strip: "from-rose-500 via-pink-400 to-rose-600",
      };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {!hideTrigger && <DialogTrigger render={trigger || defaultTrigger} />}

        <DialogContent
          className={cn(
            "sm:max-w-[460px] bg-[#0c0e14] border border-white/6 text-white p-0 overflow-hidden rounded-3xl",
            "shadow-2xl",
            accent.glow,
          )}
        >

          {/* Subtle radial glow behind the form */}
          <div
            className={cn(
              "absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none",
              isIncome ? "bg-emerald-400" : "bg-rose-400",
            )}
          />
          <div
            className={cn(
              "absolute bottom-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none",
              isIncome ? "bg-emerald-400" : "bg-rose-400",
            )}
          />

          <div className="relative z-10 px-8 pt-8 pb-7 space-y-7">
            {/* Header */}
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <DialogTitle className="text-[1.6rem] font-bold tracking-tight text-white">
                    {initialData ? "Editar movimiento" : "Nuevo movimiento"}
                  </DialogTitle>
                  <p className="text-sm text-white/30 font-medium">
                    {initialData
                      ? "Modifica los detalles de la transacción"
                      : "Registra un ingreso o un gasto"}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-2.5 rounded-2xl border",
                    accent.bg,
                    accent.border,
                  )}
                >
                  <Sparkles className={cn("h-5 w-5", accent.text)} />
                </div>
              </div>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
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
                                "relative flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300",
                                active
                                  ? isInc
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-800/50"
                                    : "bg-rose-500 text-white shadow-lg shadow-rose-800/50"
                                  : "text-white/30 hover:text-white/60",
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

                {/* ── Amount ── */}
                <div className="grid grid-cols-2 gap-3">
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
                            {/* currency pill */}
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/25 bg-white/6 border border-white/8 px-2.5 py-1 rounded-lg pointer-events-none">
                              {currency}
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              className={cn(
                                "bg-white/4 border border-white/8 text-white h-14 text-3xl font-bold rounded-2xl pl-20 pr-4 transition-all",
                                "hover:bg-white/6 hover:border-white/12",
                                "focus:bg-white/7 focus:border-white/20",
                                "placeholder:text-white/15",
                                accent.ring,
                              )}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-rose-400 text-xs ml-1" />
                      </FormItem>
                    )}
                  />
                  {/* Category */}
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
                            <SelectTrigger
                              className={cn(
                                "bg-white/4 border border-white/8 text-white h-14! w-full rounded-2xl px-4 transition-all",
                                "hover:bg-white/6 hover:border-white/12",
                                !field.value && "text-white/30",
                                accent.ring,
                              )}
                            >
                              <SelectValue placeholder="Elegir">
                                {field.value
                                  ? localCategories.find(
                                      (c) => c.id === field.value,
                                    )?.name
                                  : "Elegir"}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#111318] border border-white/8 text-white rounded-xl p-2 overflow-hidden shadow-2xl max-h-[300px]">
                            {localCategories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id}
                                className={cn(
                                  "rounded-xl my-0.5 cursor-pointer transition-colors",
                                  isIncome
                                    ? "focus:bg-emerald-600/30"
                                    : "focus:bg-rose-600/30",
                                  "focus:text-white hover:text-white",
                                )}
                              >
                                {category.name}
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
                </div>

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
                            placeholder="¿En qué consistió?"
                            {...field}
                            className={cn(
                              "bg-white/4 border border-white/8 text-white h-14 rounded-2xl px-4 transition-all",
                              "hover:bg-white/6 hover:border-white/12",
                              "focus:bg-white/7 focus:border-white/20",
                              "placeholder:text-white/20",
                              accent.ring,
                            )}
                          />
                          <div
                            className={cn(
                              "absolute bottom-0 left-4 right-4 h-[1px] bg-linear-to-r opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 rounded-full",
                              accent.gradient,
                            )}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs ml-1" />
                    </FormItem>
                  )}
                />

                {/* Wallet */}
                <FormField
                  control={form.control}
                  name="walletId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                        Cuenta / Wallet
                      </FormLabel>
                      <Select
                        onValueChange={(val) => {
                          if (val === "NEW_WALLET") {
                            setIsWalletDialogOpen(true);
                          } else {
                            field.onChange(val);
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(
                              "bg-white/4 border border-white/8 text-white h-14! w-full rounded-2xl px-4 transition-all",
                              "hover:bg-white/6 hover:border-white/12",
                              !field.value && "text-white/30",
                              accent.ring,
                            )}
                          >
                            <SelectValue placeholder="Efectivo, Banco...">
                              {field.value
                                ? localWallets?.find(
                                    (w) => w.id === field.value,
                                  )?.name
                                : "Elegir"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#111318] border border-white/8 text-white rounded-xl p-2 shadow-2xl overflow-hidden max-h-[300px]">
                          {localWallets?.map((wallet: any) => (
                            <SelectItem
                              key={wallet.id}
                              value={wallet.id}
                              className="rounded-xl my-0.5 focus:bg-white/10"
                            >
                              <div className="flex items-center justify-between w-full gap-4">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-2.5 h-2.5 rounded-full shadow-lg"
                                    style={{
                                      backgroundColor: wallet.color,
                                      boxShadow: `0 0 8px ${wallet.color}40`,
                                    }}
                                  />
                                  <span className="font-medium">
                                    {wallet.name}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold opacity-40 px-1.5 py-0.5 bg-white/5 rounded-md text-white">
                                  {formatCurrency(wallet.balance, currency)}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                          {(!localWallets || localWallets.length === 0) && (
                            <p className="p-3 text-xs text-white/20 italic text-center">
                              No hay cuentas
                            </p>
                          )}
                          <div className="h-px bg-white/5 my-1 mx-2" />
                          <SelectItem
                            value="NEW_WALLET"
                            className="rounded-xl my-0.5 cursor-pointer text-indigo-400 focus:bg-indigo-500/10 focus:text-indigo-300 font-bold justify-center"
                          >
                            + Nueva Cuenta
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-rose-400 text-xs ml-1" />
                    </FormItem>
                  )}
                />

                  {/* Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                          Fecha
                        </FormLabel>
                        <DatePicker
                          date={field.value}
                          onChange={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                        <FormMessage className="text-rose-400 text-xs ml-1" />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tagIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                          Etiquetas
                        </FormLabel>
                        <div className="flex flex-wrap gap-1.5 min-h-[56px] p-3 bg-white/4 border border-white/8 rounded-2xl overflow-y-auto max-h-32 transition-all hover:border-white/12">
                          {localTags?.map((tag) => {
                            const isSelected = field.value?.includes(tag.id);
                            return (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() => {
                                  const newValue = isSelected
                                    ? field.value?.filter((id) => id !== tag.id)
                                    : [...(field.value || []), tag.id];
                                  field.onChange(newValue);
                                }}
                                className={cn(
                                  "px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1.5",
                                  isSelected
                                    ? "bg-white/20 border-white/30 text-white shadow-sm"
                                    : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10 hover:text-white/50",
                                )}
                              >
                                <div 
                                  className="w-1.5 h-1.5 rounded-full" 
                                  style={{ backgroundColor: tag.color }}
                                />
                                {tag.name}
                              </button>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => setIsTagDialogOpen(true)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-dashed border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-all flex items-center gap-1"
                          >
                            <Plus className="h-2.5 w-2.5" />
                            Nueva
                          </button>
                        </div>
                      </FormItem>
                    )}
                  />

                {/* ── Divider ── */}
                <div className="border-t border-white/5" />

                {/* ── Submit ── */}
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
                  {/* Shimmer on hover */}
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        {initialData ? "Actualizando…" : "Registrando…"}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        {initialData
                          ? "Guardar Cambios"
                          : `Confirmar ${isIncome ? "Ingreso" : "Gasto"}`}
                      </>
                    )}
                  </span>
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onSuccess={(newCat) => {
          setLocalCategories((prev) => [...prev, newCat as any]);
          form.setValue("categoryId", newCat.id);
        }}
      />
      <WalletDialog
        open={isWalletDialogOpen}
        onOpenChange={setIsWalletDialogOpen}
        currency={currency}
        onSuccess={(newWallet) => {
          setLocalWallets((prev) => [...prev, newWallet]);
          form.setValue("walletId", newWallet.id);
        }}
      />
      <TagDialog
        open={isTagDialogOpen}
        onOpenChange={setIsTagDialogOpen}
        onSuccess={(newTag) => {
          setLocalTags((prev) => [...prev, newTag]);
          const currentTags = form.getValues("tagIds") || [];
          form.setValue("tagIds", [...currentTags, newTag.id]);
        }}
      />
    </>
  );
}
