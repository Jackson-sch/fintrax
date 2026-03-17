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
import { addTag } from "@/actions/financial-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const tagSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  color: z.string().min(1, "Selecciona un color"),
});

type FormValues = z.infer<typeof tagSchema>;

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (tag: { id: string; name: string; color: string }) => void;
}

const COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#10b981", "#0ea5e9", 
  "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#64748b"
];

export function TagDialog({ open, onOpenChange, onSuccess }: TagDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(tagSchema) as any,
    defaultValues: {
      name: "",
      color: COLORS[0],
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const newTag = await addTag(values);
      toast.success("Etiqueta creada exitosamente");
      if (onSuccess) onSuccess({ id: newTag.id, name: newTag.name, color: newTag.color });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Error al crear la etiqueta");
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
      <DialogContent className="sm:max-w-[400px] bg-[#0c0e14] border-white/10 text-white p-0 overflow-hidden rounded-3xl z-110">
        
        {/* Subtle radial glow */}
        <div
          className={cn(
            "absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none",
            "bg-indigo-400",
          )}
        />
        
        <div className="px-8 pt-8 pb-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">Nueva Etiqueta</DialogTitle>
            <p className="text-sm text-white/30">Crea una etiqueta para organizar tus movimientos</p>
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
                      <Input placeholder="Ej. Viajes, Trabajo..." {...field} className={inputCls} />
                    </FormControl>
                    <FormMessage />
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

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 bg-indigo-500 text-white hover:bg-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all mt-4 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? "Guardando..." : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Crear Etiqueta
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
