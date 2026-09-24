"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function SearchBar({ initialValue = "" }: { initialValue?: string }) {
  const [query, setQuery] = useState(initialValue)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/spare-parts?search=${encodeURIComponent(query.trim())}`)
    } else {
      router.push(`/spare-parts`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full flex items-center gap-2 rounded-xl border border-border/80 bg-card p-1.5 shadow-xs transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
      <div className="flex-1 flex items-center px-3 gap-2.5 text-muted-foreground">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground/70" />
        <input
          type="text"
          placeholder="Search by part number, name, or vehicle..."
          className="bg-transparent border-none outline-hidden w-full text-foreground placeholder:text-muted-foreground/70 text-sm h-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        size="sm"
        className="h-9 px-4 font-medium shadow-2xs"
      >
        Search
      </Button>
    </form>
  )
}
