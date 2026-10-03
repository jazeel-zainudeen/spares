"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CopyableText({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <span 
      className={`group inline-flex items-center gap-1.5 cursor-pointer transition-colors ${className}`}
      onClick={handleCopy}
      title="Copy to clipboard"
    >
      <span>{text}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-foreground transition-colors" />
      )}
    </span>
  )
}
