"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: (date: Date) => boolean;
}

export function DatePicker({ date, onChange, placeholder = "Seleccionar fecha", className, disabled }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-medium h-12 rounded-xl bg-white/4 border border-white/8 text-white hover:bg-white/6 hover:border-white/20 transition-all shadow-xs",
              !date && "text-white/20",
              className
            )}
          >
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-4 w-4 text-white/30" />
              <span className="truncate">
                {date ? format(date, "d 'de' MMMM, yyyy", { locale: es }) : placeholder}
              </span>
            </div>
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0 bg-[#0c0e14]/95 backdrop-blur-xl border-white/10 shadow-2xl rounded-2xl overflow-hidden" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          initialFocus
          locale={es}
          className="rounded-xl"
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
