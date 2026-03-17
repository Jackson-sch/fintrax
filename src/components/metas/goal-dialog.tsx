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
  addSavingGoal, 
  updateSavingGoal 
} from "@/actions/financial-actions";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Target, CheckCircle2, Palette } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

const goalSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  targetAmount: z.coerce.number().min(0.01, "El objetivo debe ser mayor a 0"),
  currentAmount: z.coerce.number().min(0, "Monto inválido").optional(),
  deadline: z.date().optional(),
  color: z.string().default("#3b82f6"),
});

type FormValues = z.infer<typeof goalSchema>;

const PRESET_COLORS = [
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f39c12", // Orange
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#64748b", // Slate
];

interface GoalDialogProps {
  initialData?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
}

export function GoalDialog({
  initialData,
  open: controlledOpen,
  onOpenChange,
  trigger,
}: GoalDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const form = useForm<FormValues>({
    resolver: zodResolver(goalSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      targetAmount: initialData?.targetAmount || 0,
      currentAmount: initialData?.currentAmount || 0,
      deadline: initialData?.deadline ? new Date(initialData.deadline) : undefined,
      color: initialData?.color || "#3b82f6",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (initialData) {
        await updateSavingGoal(initialData.id, values);
        toast.success("Meta de ahorro actualizada");
      } else {
        await addSavingGoal(values);
        toast.success("Meta de ahorro creada");
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Error al guardar la meta");
    }
  };

  const inputCls = "bg-white/4 border border-white/8 text-white h-12 rounded-xl focus:bg-white/6 focus:border-white/20 transition-all placeholder:text-white/20";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[450px] bg-[#0c0e14] border-white/10 text-white p-0 overflow-hidden rounded-3xl">
        <div className="absolute top-0 left-0 w-full h-[2px]" style={{ backgroundColor: form.watch("color") }} />
        
        <div className="px-8 pt-8 pb-8 space-y-6">
          <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <div 
              className="p-3 rounded-2xl border transition-colors duration-500"
              style={{ 
                backgroundColor: `${form.watch("color")}15`,
                borderColor: `${form.watch("color")}30`,
                color: form.watch("color") 
              }}
            >
              <Target className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {initialData ? "Editar" : "Nueva"} Meta de Ahorro
              </DialogTitle>
              <p className="text-xs text-white/30 font-medium uppercase tracking-widest">
                Planificación del Futuro
              </p>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nombre de la Meta</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Viaje a Europa" {...field} className={inputCls} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40">Monto Objetivo</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className={inputCls} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40">Monto Inicial</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className={cn(inputCls, initialData && "opacity-50")} disabled={!!initialData} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40">Fecha Límite (Opcional)</FormLabel>
                    <FormControl>
                      <DatePicker 
                        date={field.value} 
                        onChange={field.onChange} 
                        placeholder="dd/mm/aaaa"
                      />
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
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                      <Palette className="h-3 w-3" /> Color Distintivo
                    </FormLabel>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => field.onChange(color)}
                          className={cn(
                            "h-8 w-8 rounded-full border-2 transition-all",
                            field.value === color 
                              ? "border-white scale-110 shadow-lg" 
                              : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 group"
                  style={{ 
                    backgroundColor: form.watch("color"),
                    boxShadow: `0 10px 20px ${form.watch("color")}30`
                  }}
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  {initialData ? "Actualizar" : "Crear"} Meta
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
