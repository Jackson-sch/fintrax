"use client";

import { useState } from "react";
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
import { addCategory } from "@/actions/financial-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, ShoppingCart, DollarSign, Car, Heart, 
  Book, Film, Zap, Tag, TrendingUp, Grid, Circle 
} from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  color: z.string().min(1, "Selecciona un color"),
  icon: z.string().min(1, "Selecciona un icono"),
});

type FormValues = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (category: { id: string; name: string; color: string; icon: string }) => void;
}


const COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#10b981", "#0ea5e9", 
  "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#64748b"
];

const ICONS = [
  { id: "shopping-cart", icon: ShoppingCart },
  { id: "dollar-sign", icon: DollarSign },
  { id: "car", icon: Car },
  { id: "heart", icon: Heart },
  { id: "book", icon: Book },
  { id: "film", icon: Film },
  { id: "zap", icon: Zap },
  { id: "tag", icon: Tag },
  { id: "trending-up", icon: TrendingUp },
  { id: "grid", icon: Grid },
  { id: "circle", icon: Circle },
];

export function CategoryDialog({ open, onOpenChange, onSuccess }: CategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: "",
      color: COLORS[0],
      icon: "shopping-cart",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const newCat = await addCategory(values);
      toast.success("Categoría creada exitosamente");
      if (onSuccess) onSuccess({ id: newCat.id, name: newCat.name, color: newCat.color, icon: newCat.icon });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Error al crear la categoría");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "bg-white/4 border border-white/8 text-white h-12 rounded-xl focus:bg-white/6 focus:border-white/20 transition-all placeholder:text-white/20";

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) form.reset();
    }}>
      <DialogContent className="sm:max-w-[450px] bg-[#0c0e14] border-white/10 text-white p-0 overflow-hidden rounded-3xl z-100">

       {/* Subtle radial glow behind the form */}
          <div
            className={cn(
              "absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none",
              "bg-sky-400",
            )}
          />
        
        <div className="px-5 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight">Nueva Categoría</DialogTitle>
            <p className="text-sm text-white/30">Crea una categoría personalizada</p>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Suscripciones" {...field} className={inputCls} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40">Icono</FormLabel>
                      <div className="flex gap-2 flex-wrap mt-1">
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
                      <div className="flex gap-2 flex-wrap mt-1">
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
                className="w-full h-14 bg-sky-400 text-black hover:bg-sky-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all mt-4 relative overflow-hidden group"
              >
                {/* Shimmer on hover */}
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? "Guardando..." : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Crear Categoría
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
