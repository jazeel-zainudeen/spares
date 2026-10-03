"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { trackAction } from "@/lib/tracking"
import { getPublicPartsAction } from "@/app/actions/parts"
import Link from "next/link"
import { HighlightText } from "@/components/ui/HighlightText"

export function SearchBar({ initialValue = "" }: { initialValue?: string }) {
  const [query, setQuery] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([])
        return
      }

      setIsLoading(true)
      try {
        const { data } = await getPublicPartsAction({ search: query.trim(), page: 1, pageSize: 5 })
        if (data) {
          setSuggestions(data.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsFocused(false)
    if (query.trim()) {
      trackAction(`🔍 *Searched for:* \`${query.trim()}\``);
      router.push(`/spare-parts?search=${encodeURIComponent(query.trim())}`)
    } else {
      router.push(`/spare-parts`)
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <form onSubmit={handleSearch} className="w-full flex items-center gap-2 rounded-xl border border-border/80 bg-card p-1.5 shadow-xs transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
        <div className="flex-1 flex items-center px-3 gap-2.5 text-muted-foreground">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground/70" />
          <input
            type="text"
            placeholder="Search by part number, name, or vehicle..."
            className="bg-transparent border-none outline-hidden w-full text-foreground placeholder:text-muted-foreground/70 text-sm h-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/50 shrink-0" />}
        </div>
        <Button
          type="submit"
          size="sm"
          className="h-9 px-4 font-medium shadow-2xs"
        >
          Search
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {isFocused && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/80 rounded-xl shadow-lg overflow-hidden z-50 flex flex-col">
          {suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((part) => (
                <li key={part.id}>
                  <Link 
                    href={`/spare-parts/${part.categories?.slug || 'uncategorized'}/${part.car_models?.car_companies?.slug || 'unknown'}/${part.car_models?.slug || 'model'}/${part.id}`}
                    className="block px-4 py-2 hover:bg-muted/50 transition-colors"
                    onClick={() => setIsFocused(false)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-foreground">
                        <HighlightText text={part.item} highlight={query} />
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        <HighlightText text={`${part.car_models?.car_companies?.name} ${part.car_models?.name} • REF: ${part.ref_number}${part.oem_number ? ` • OEM: ${part.oem_number}` : ''}`} highlight={query} />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="border-t border-border/50 mt-1 pt-1">
                <button 
                  onClick={handleSearch}
                  className="w-full text-center px-4 py-2 text-sm text-primary hover:bg-muted/50 font-medium transition-colors"
                >
                  View all results for "{query}"
                </button>
              </li>
            </ul>
          ) : !isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
