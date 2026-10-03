"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { ChevronDown, Search, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { HighlightText } from "@/components/ui/HighlightText"

export interface MultiSelectProps {
  options: { value: string; label: string; count?: number; group?: string }[]
  value?: string[]
  onChange?: (selected: string[]) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ className, options, value = [], onChange, disabled, placeholder = "Select options" }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const uniqueOptions = options.filter((opt, i, arr) => 
      arr.findIndex(o => o.value === opt.value) === i
    )

    const filteredOptions = uniqueOptions.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    )

    const toggleOption = (val: string) => {
      let next: string[]
      if (value.includes(val)) {
        next = value.filter(v => v !== val)
      } else {
        next = [...value, val]
      }
      if (onChange) {
        onChange(next)
      }
    }

    const clearSelection = () => {
      if (onChange) {
        onChange([])
      }
    }

    // Determine label for trigger button
    let displayText = placeholder
    if (value.length === 1) {
      const found = uniqueOptions.find(o => o.value === value[0])
      displayText = found ? found.label : value[0]
    } else if (value.length > 1) {
      const firstTwo = value
        .slice(0, 2)
        .map(v => uniqueOptions.find(o => o.value === v)?.label || v)
        .join(", ")
      displayText = value.length === 2 ? firstTwo : `${value.length} selected (${firstTwo}, ...)`
    }

    return (
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen} modal={true}>
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
            <span className={cn("truncate text-left", value.length === 0 && "text-muted-foreground/70")}>
              {displayText}
            </span>
            <div className="flex items-center gap-1.5 ml-2 shrink-0">
              {value.length > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {value.length}
                </span>
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground/70 transition-transform duration-200" />
            </div>
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={6}
            className="z-50 w-(--radix-popover-trigger-width) min-w-56 overflow-hidden rounded-xl border border-border/80 bg-popover p-1.5 text-popover-foreground shadow-lg shadow-black/5 outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
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
              {value.length > 0 && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="ml-1 text-[10px] font-medium text-destructive hover:underline shrink-0"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto py-0.5 space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="py-4 text-center text-xs text-muted-foreground">
                  No options found.
                </div>
              ) : (
                (() => {
                  const groups: Record<string, typeof filteredOptions> = {}
                  const ungrouped: typeof filteredOptions = []

                  filteredOptions.forEach(opt => {
                    if (opt.group) {
                      if (!groups[opt.group]) groups[opt.group] = []
                      groups[opt.group].push(opt)
                    } else {
                      ungrouped.push(opt)
                    }
                  })

                  const renderOption = (opt: typeof filteredOptions[0]) => {
                    const isChecked = value.includes(opt.value)
                    return (
                      <div
                        key={opt.value}
                        onClick={() => toggleOption(opt.value)}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-3 text-xs outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
                          isChecked && "bg-accent/80 font-medium text-accent-foreground"
                        )}
                      >
                        <div className={cn(
                          "absolute left-2.5 flex h-4 w-4 items-center justify-center rounded-sm border border-border transition-colors",
                          isChecked && "bg-primary border-primary text-primary-foreground"
                        )}>
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="flex flex-col min-w-0 gap-0.5">
                          <span className="truncate">
                            <HighlightText text={opt.label} highlight={search} />
                          </span>
                          {opt.count !== undefined && (
                            <span className="text-[10px] text-muted-foreground/70 font-normal leading-none">
                              {opt.count === 1 ? '1 Part' : `${opt.count} Parts`}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  }

                  return (
                    <>
                      {ungrouped.map(renderOption)}
                      {Object.entries(groups).map(([groupName, opts]) => (
                        <div key={groupName} className="mt-1 first:mt-0">
                          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 bg-muted/20">
                            {groupName}
                          </div>
                          {opts.map(renderOption)}
                        </div>
                      ))}
                    </>
                  )
                })()
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    )
  }
)
MultiSelect.displayName = "MultiSelect"
