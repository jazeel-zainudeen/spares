import * as React from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
  buildLink?: (page: number) => string
  className?: string
  totalItems?: number
  pageSize?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  buildLink,
  className,
  totalItems,
  pageSize,
}: PaginationProps) {
  if (totalPages <= 1) return null

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const delta = 1
    const range: (number | "...")[] = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i)
      } else if (range[range.length - 1] !== "...") {
        range.push("...")
      }
    }
    return range
  }

  const pages = getPageNumbers()

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/60 text-xs text-muted-foreground",
        className
      )}
    >
      {totalItems !== undefined && pageSize !== undefined ? (
        <div>
          Showing{" "}
          <span className="font-medium text-foreground">
            {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
          </span>{" "}
          to{" "}
          <span className="font-medium text-foreground">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{" "}
          of <span className="font-medium text-foreground">{totalItems}</span> results
        </div>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-1">
        {buildLink ? (
          <Button
            variant="outline"
            size="sm"
            asChild={currentPage > 1}
            disabled={currentPage <= 1}
            className="h-8 px-2 gap-1"
          >
            {currentPage > 1 ? (
              <Link href={buildLink(currentPage - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </Link>
            ) : (
              <span>
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </span>
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-8 px-2 gap-1"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
        )}

        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </span>
            )
          }

          const isCurrent = p === currentPage

          if (buildLink) {
            return (
              <Button
                key={p}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                asChild={!isCurrent}
                className={cn(
                  "h-8 w-8 p-0 text-xs",
                  isCurrent && "pointer-events-none"
                )}
              >
                {isCurrent ? (
                  <span>{p}</span>
                ) : (
                  <Link href={buildLink(p as number)}>{p}</Link>
                )}
              </Button>
            )
          }

          return (
            <Button
              key={p}
              variant={isCurrent ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange?.(p as number)}
              className={cn(
                "h-8 w-8 p-0 text-xs",
                isCurrent && "pointer-events-none"
              )}
            >
              {p}
            </Button>
          )
        })}

        {buildLink ? (
          <Button
            variant="outline"
            size="sm"
            asChild={currentPage < totalPages}
            disabled={currentPage >= totalPages}
            className="h-8 px-2 gap-1"
          >
            {currentPage < totalPages ? (
              <Link href={buildLink(currentPage + 1)}>
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span>
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-8 px-2 gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
