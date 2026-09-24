import * as React from "react"
import { cn } from "@/lib/utils"

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full rounded-lg border border-slate-200 glass shadow-sm">
      <div className="w-full overflow-x-auto">
        <table 
          className={cn(
            "w-full text-sm text-left",
            "[&_thead]:bg-slate-50/50 [&_thead]:border-b [&_thead]:border-slate-200",
            "[&_th]:h-12 [&_th]:px-4 [&_th]:align-middle [&_th]:font-medium [&_th]:text-slate-600 [&_th]:whitespace-nowrap",
            "[&_td]:p-4 [&_td]:align-middle",
            "[&_tbody_tr]:border-b [&_tbody_tr]:border-slate-100 [&_tbody_tr:last-child]:border-0",
            "[&_tbody_tr]:transition-colors hover:[&_tbody_tr]:bg-slate-50/50",
            // Mobile card layout
            "max-md:block max-md:w-full",
            "max-md:[&_thead]:hidden",
            "max-md:[&_tbody]:block max-md:[&_tbody]:w-full",
            "max-md:[&_tr]:block max-md:[&_tr]:w-full max-md:[&_tr]:border-b max-md:[&_tr]:border-slate-200 max-md:[&_tr]:p-4 max-md:[&_tr]:space-y-3",
            "max-md:[&_td]:flex max-md:[&_td]:flex-col max-md:[&_td]:items-start max-md:[&_td]:gap-1 max-md:[&_td]:p-0 max-md:[&_td]:border-0",
            "max-md:[&_td::before]:content-[attr(data-label)] max-md:[&_td::before]:font-medium max-md:[&_td::before]:text-xs max-md:[&_td::before]:text-slate-500 max-md:[&_td::before]:uppercase max-md:[&_td::before]:tracking-wider",
            className
          )} 
          {...props} 
        />
      </div>
    </div>
  )
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b border-slate-200", className)} {...props} />
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-slate-100 transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-50/50",
        className
      )}
      {...props}
    />
  )
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground has-[[role=checkbox]]:pr-0",
        className
      )}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("p-4 align-middle has-[[role=checkbox]]:pr-0", className)}
      {...props}
    />
  )
}
