import * as React from "react"
import { Popover, TextField, ScrollArea, Box, Flex, Text } from "@radix-ui/themes"
import { ChevronDown, Search, Check } from "lucide-react"

export interface SelectProps {
  options: { value: string; label: string }[]
  value?: string
  onChange?: (e: any) => void
  disabled?: boolean
  className?: string
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, options, value, onChange, disabled }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

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
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger disabled={disabled}>
          <button
            type="button"
            disabled={disabled}
            className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
          >
            <span className="truncate">{selectedOption?.label || "Select an option"}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </Popover.Trigger>
        <Popover.Content width="100%" style={{ padding: 0 }} size="1">
          <Box p="2" style={{ borderBottom: '1px solid var(--gray-a4)' }}>
            <TextField.Root
              size="1"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            >
              <TextField.Slot>
                <Search height="14" width="14" />
              </TextField.Slot>
            </TextField.Root>
          </Box>
          <ScrollArea type="auto" scrollbars="vertical" style={{ maxHeight: 200 }}>
            <Flex direction="column" p="1">
              {filteredOptions.length === 0 ? (
                <Box p="2">
                  <Text size="2" color="gray">No results found.</Text>
                </Box>
              ) : (
                filteredOptions.map((opt) => (
                  <Box
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    style={{
                      padding: '6px 24px 6px 24px',
                      cursor: 'pointer',
                      position: 'relative',
                      borderRadius: 'var(--radius-1)',
                      backgroundColor: value === opt.value ? 'var(--accent-a3)' : 'transparent',
                      color: value === opt.value ? 'var(--accent-11)' : 'var(--gray-12)'
                    }}
                    onMouseEnter={(e) => {
                       if (value !== opt.value) e.currentTarget.style.backgroundColor = 'var(--gray-a3)'
                    }}
                    onMouseLeave={(e) => {
                       if (value !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <Text size="2" style={{ display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {opt.label}
                    </Text>
                    {value === opt.value && (
                      <Box position="absolute" style={{ left: 6, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-11)' }}>
                        <Check height="14" width="14" />
                      </Box>
                    )}
                  </Box>
                ))
              )}
            </Flex>
          </ScrollArea>
        </Popover.Content>
      </Popover.Root>
    )
  }
)
Select.displayName = "Select"
