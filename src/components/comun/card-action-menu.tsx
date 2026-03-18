"use client";

import { MoreVertical, Edit2, Trash2, LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CardActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  editIcon?: LucideIcon;
  className?: string;
}

export function CardActionMenu({
  onEdit,
  onDelete,
  editLabel = "Editar",
  deleteLabel = "Eliminar",
  editIcon: EditIcon = Edit2,
  className,
}: CardActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        "p-2 rounded-xl text-white/20 hover:text-white/60 hover:bg-white/5 transition-all outline-none cursor-pointer",
        className
      )}>
        <MoreVertical className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#0c0e14] border-white/10 text-white min-w-[160px]"
      >
        <DropdownMenuItem
          onClick={onEdit}
          className="gap-2 focus:bg-white/5 cursor-pointer py-3"
        >
          <EditIcon className="h-4 w-4 text-indigo-400" />
          {editLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="gap-2 focus:bg-rose-500/10 text-rose-500 focus:text-rose-400 cursor-pointer py-3"
        >
          <Trash2 className="h-4 w-4" />
          {deleteLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
