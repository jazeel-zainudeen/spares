"use client"

import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import { TableHead } from "@/components/ui/Table"
import { cn } from "@/lib/utils"

interface SortableHeaderProps {
  label: string
  columnKey: string
  currentSortColumn: string
  currentSortDirection: "asc" | "desc"
  onSort: (columnKey: string) => void
  className?: string
  align?: "left" | "center" | "right"
}

export function SortableHeader({
  label,
  columnKey,
  currentSortColumn,
  currentSortDirection,
  onSort,
  className,
  align = "left",
}: SortableHeaderProps) {
  const isActive = currentSortColumn === columnKey

  return (
    <TableHead
      className={cn(
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className={cn(
          "inline-flex items-center gap-1.5 py-1 text-xs font-medium cursor-pointer transition-colors hover:text-foreground focus:outline-hidden group",
          align === "center" && "mx-auto justify-center",
          align === "right" && "ml-auto justify-end",
          isActive ? "text-primary font-bold" : "text-muted-foreground"
        )}
      >
        <span>{label}</span>
        {isActive ? (
          currentSortDirection === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-primary shrink-0" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-40 shrink-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>
    </TableHead>
  )
}
