"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export function SearchBar({ initialValue = "" }: { initialValue?: string }) {
  const [query, setQuery] = useState(initialValue)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/parts?search=${encodeURIComponent(query)}`)
    } else {
      router.push(`/parts`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto p-2 glass rounded-2xl flex items-center gap-2 transition-shadow focus-within:ring-2 focus-within:ring-primary/50">
      <div className="flex-1 flex items-center px-4 gap-3 text-muted-foreground">
        <Search className="h-5 w-5" />
        <input 
          type="text" 
          placeholder="Search by part number, name, or vehicle..." 
          className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground/60 h-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button 
        type="submit"
        className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors"
      >
        Search
      </button>
    </form>
  )
}
