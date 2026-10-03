import React from "react"

interface HighlightTextProps {
  text: string
  highlight: string
  className?: string
}

export function HighlightText({ text, highlight, className = "" }: HighlightTextProps) {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>
  }

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  const regex = new RegExp(`(${escapeRegExp(highlight)})`, "gi")
  const parts = text.split(regex)

  return (
    <span className={className}>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-[#facc15] text-black dark:bg-[#eab308] dark:text-black font-bold rounded-sm px-0.5">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}
