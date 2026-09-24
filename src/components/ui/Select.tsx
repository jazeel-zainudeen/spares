"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { ChevronDown, Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectProps {
  options: { value: string; label: string }[]
  value?: string
  onChange?: (e: { target: { value: string } }) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ className, options, value, onChange, disabled, placeholder = "Select an option" }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const filteredOptions = options.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    )

    const selectedOption = options.find(opt => opt.value === value)

    const handleSelect = (val: string) => {
      if (onChange) {
        onChange({ target: { value: val } })
      }
      setIsOpen(false)
      setSearch("")
    }

    return (
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-9 w-full items-center justify-between rounded-lg border border-border/80 bg-background px-3 py-1.5 text-sm text-foreground shadow-2xs transition-all hover:bg-muted/40 focus-visible:border-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
          >
            <span className={cn("truncate text-left", !selectedOption && "text-muted-foreground/70")}>
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/70 transition-transform duration-200" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={6}
            className="z-50 w-(--radix-popover-trigger-width) min-w-48 overflow-hidden rounded-xl border border-border/80 bg-popover p-1.5 text-popover-foreground shadow-lg shadow-black/5 outline-hidden animate-in fade-in-0 zoom-in-95"
          >
            <div className="flex items-center rounded-md bg-muted/40 px-2.5 py-1.5 mb-1 border border-border/50">
              <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-6 w-full rounded-none bg-transparent text-xs text-foreground outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="max-h-60 overflow-y-auto py-0.5 space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="py-4 text-center text-xs text-muted-foreground">
                  No results found.
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = value === opt.value
                  return (
                    <div
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-3 text-xs outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
                        isSelected && "bg-accent/80 font-medium text-accent-foreground"
                      )}
                    >
                      <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                      </span>
                      <span className="truncate">{opt.label}</span>
                    </div>
                  )
                })
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    )
  }
)
Select.displayName = "Select"
