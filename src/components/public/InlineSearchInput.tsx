"use client"

import { useState, useTransition } from "react"
import { Search, X } from "lucide-react"

interface InlineSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function InlineSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: InlineSearchInputProps) {
  return (
    <div
      className={`relative flex items-center rounded-xl border border-border/80 bg-card px-3 py-1.5 shadow-2xs transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 ${className}`}
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground/70 mr-2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden h-7"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="ml-1 p-0.5 text-muted-foreground/60 hover:text-foreground rounded-full transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
