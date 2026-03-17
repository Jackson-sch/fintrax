"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { addBudget, updateBudget } from "@/actions/financial-actions";
import { toast } from "sonner";
import { Plus, Target, CheckCircle2, PencilLine, Loader2 } from "lucide-react";
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
import { CategoryDialog } from "@/components/categorias/category-dialog";

const budgetSchema = z.object({
  categoryId: z.string().min(1, "Selecciona una categoría"),
  amount: z.coerce.number().min(1, "El monto debe ser mayor a 0"),
});

type FormValues = z.infer<typeof budgetSchema>;

interface BudgetDialogProps {
  categories: { id: string; name: string; color: string }[];
  currency: string;
  initialData?: {
    id: string;
    categoryId: string;
    amount: number;
    month: number;
    year: number;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  trigger?: React.ReactElement;
}

export function BudgetDialog({
  categories,
  currency,
  initialData,
  open: controlledOpen,
  onOpenChange,
  hideTrigger,
  trigger,
}: BudgetDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories);

  useEffect(() => { setLocalCategories(categories); }, [categories]);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const form = useForm<FormValues>({
    resolver: zodResolver(budgetSchema) as any,
    defaultValues: {
      categoryId: initialData?.categoryId || "",
      amount: initialData?.amount || 0,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        categoryId: initialData?.categoryId || "",
        amount: initialData?.amount || 0,
      });
    }
  }, [open, initialData, form]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const now = new Date();
      if (initialData) {
        await updateBudget(initialData.id, { amount: values.amount });
        toast.success("Presupuesto actualizado");
      } else {
        await addBudget({
          categoryId: values.categoryId,
          amount: values.amount,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        });
        toast.success("Presupuesto creado");
      }
      setOpen(false);
      form.reset({ categoryId: "", amount: 0 });
    } catch {
      toast.error("Error al guardar el presupuesto");
    } finally {
      setIsSubmitting(false);
    }
  }

  const defaultTrigger = (
    <Button className="relative overflow-hidden bg-linear-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white rounded-2xl shadow-lg shadow-violet-900/40 px-6 py-5 font-semibold tracking-wide transition-all duration-300 group">
      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
      Nuevo Presupuesto
    </Button>
  );

  const selectedCategory = localCategories.find(
    (c) => c.id === form.watch("categoryId"),
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {!hideTrigger && <DialogTrigger render={trigger || defaultTrigger} />}

        <DialogContent className="sm:max-w-[440px] bg-[#0c0e14] border border-white/5 text-white p-0 overflow-hidden rounded-3xl shadow-2xl shadow-violet-500/10">

          {/* Radial glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none bg-violet-400" />

          <div className="relative z-10 px-8 pt-8 pb-7 space-y-6">
            {/* Header */}
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <DialogTitle className="text-[1.6rem] font-bold tracking-tight text-white">
                    {initialData ? "Editar presupuesto" : "Nuevo presupuesto"}
                  </DialogTitle>
                  <p className="text-sm text-white/30 font-medium">
                    Límite de gasto mensual por categoría
                  </p>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/8">
                  {initialData
                    ? <PencilLine className="h-5 w-5 text-violet-400" />
                    : <Target className="h-5 w-5 text-violet-400" />
                  }
                </div>
              </div>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                {/* ── Category grid ── */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-2">
                        <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                          Categoría
                        </FormLabel>
                        {selectedCategory && (
                          <span className="text-[11px] text-white/25 font-medium flex items-center gap-1.5">
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: selectedCategory.color }}
                            />
                            {selectedCategory.name} seleccionada
                          </span>
                        )}
                      </div>
                      <FormControl>
                        {/* Scrollable — shows ~3 rows max before scrolling */}
                        <div className="max-h-44 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                          <div className="grid grid-cols-2 gap-2">
                            {localCategories.map((cat) => {
                              const isSelected = field.value === cat.id;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() =>
                                    !initialData && field.onChange(cat.id)
                                  }
                                  disabled={!!initialData}
                                  className={cn(
                                    "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left",
                                    isSelected
                                      ? "bg-white/8 text-white"
                                      : "bg-white/3 text-white/35 hover:bg-white/5 hover:text-white/60",
                                    initialData && "cursor-not-allowed opacity-50",
                                  )}
                                >
                                  {/* Color swatch */}
                                  <span
                                    className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform duration-150"
                                    style={{
                                      backgroundColor: cat.color,
                                      boxShadow: isSelected
                                        ? `0 0 6px 1px ${cat.color}50`
                                        : "none",
                                      transform: isSelected
                                        ? "scale(1.15)"
                                        : "scale(1)",
                                    }}
                                  />
                                  <span className="truncate">{cat.name}</span>

                                  {/* Selected dot indicator */}
                                  {isSelected && (
                                    <span className="ml-auto shrink-0 h-4 w-4 rounded-full bg-white/10 flex items-center justify-center">
                                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </span>
                                  )}
                                </button>
                              );
                            })}

                            {/* Add new category */}
                            {!initialData && (
                              <button
                                type="button"
                                onClick={() => setIsCategoryDialogOpen(true)}
                                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-white/10 text-white/25 text-sm font-semibold transition-all hover:bg-white/3 hover:text-white/45 hover:border-white/20"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Nueva
                              </button>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs ml-1" />
                    </FormItem>
                  )}
                />

                {/* ── Amount ── */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/30">
                        Límite mensual
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/25 bg-white/5 border border-white/8 px-2 py-0.5 rounded-md pointer-events-none">
                            {currency}
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            className={cn(
                              "bg-white/4 border border-white/8 text-white h-[60px] rounded-2xl transition-all",
                              "hover:bg-white/5 hover:border-white/10",
                              "focus:bg-white/6 focus:border-white/15",
                              "placeholder:text-white/15",
                              "pl-14 text-2xl font-bold",
                            )}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-rose-400 text-xs ml-1" />
                    </FormItem>
                  )}
                />

                <div className="border-t border-white/5" />

                {/* ── Submit ── */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white font-bold py-7 rounded-2xl text-base tracking-wide transition-all duration-300 border border-white/8 shadow-xl bg-linear-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 shadow-violet-900/30 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Guardando…
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        {initialData ? "Guardar cambios" : "Crear presupuesto"}
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
    </>
  );
}