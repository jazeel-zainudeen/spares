import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, Search, Check } from "lucide-react"

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  options: { value: string; label: string }[]
  value?: string
  onChange?: (e: any) => void
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, options, value, onChange, disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredOptions = options.filter(opt => 
      opt.label.toLowerCase().includes(search.toLowerCase())
    )

    const selectedOption = options.find(opt => opt.value === value) || options[0]

    const handleSelect = (val: string) => {
      if (onChange) {
        onChange({ target: { value: val } })
      }
      setIsOpen(false)
      setSearch("")
    }

    return (
      <div className="relative w-full text-left" ref={containerRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span className="truncate">{selectedOption?.label || "Select an option"}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200/60 bg-white/90 backdrop-blur-xl py-1 text-base shadow-xl focus:outline-none sm:text-sm">
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl px-2 pb-2 pt-1 border-b border-slate-100/50">
              <div className="relative">
                <Search className="absolute left-2 top-1.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  className="w-full rounded-sm border border-slate-200 py-1 pl-8 pr-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-transparent text-foreground"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            {filteredOptions.length === 0 ? (
              <div className="relative cursor-default select-none px-4 py-2 text-sm text-slate-500">
                No results found.
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={cn(
                    "relative cursor-pointer select-none py-2 pl-8 pr-4 text-sm hover:bg-slate-100",
                    value === opt.value ? "bg-slate-50 text-slate-900 font-medium" : "text-slate-700"
                  )}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span className="block truncate">{opt.label}</span>
                  {value === opt.value && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-primary">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"
