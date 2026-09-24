import * as React from "react"
import { Table as RadixTable } from "@radix-ui/themes"

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto bg-card rounded-lg border border-border shadow-sm">
      <RadixTable.Root className={className} variant="surface" size="2" {...props as any} />
    </div>
  )
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <RadixTable.Header className={className} {...props as any} />
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <RadixTable.Body className={className} {...props as any} />
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <RadixTable.Row className={className} {...props as any} />
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <RadixTable.ColumnHeaderCell className={className} {...props as any} />
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <RadixTable.Cell className={className} {...props as any} />
}
