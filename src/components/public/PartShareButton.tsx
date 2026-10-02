"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Mail, Share2, ArrowUpRight, Link2 } from "lucide-react"
import { Button } from "@/components/ui/Button"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.96 9.96 0 0 0-8.5 15.28L2.2 22l4.9-1.37A9.97 9.97 0 1 0 12.04 2Zm5.87 14.6c-.25.7-1.47 1.3-2.12 1.38-.53.07-1.17.1-3.75-.8-3.18-1.18-5.23-4.18-5.39-4.38-.16-.2-1.32-1.76-1.32-3.36 0-1.6 1.03-2.38 1.39-2.7.35-.31.75-.39 1-.39h.7c.24 0 .57-.08.9.7.4.9 1.34 3.1 1.45 3.33.1.22.18.5.02.8-.16.3-.26.5-.5.78-.22.26-.46.59-.65.79-.22.2-.44.42-.2.8.24.37 1.07 1.77 2.29 2.87 1.58 1.4 2.9 1.85 3.31 2.06.42.21.67.18.9-.11.25-.32.93-1.08 1.18-1.46.26-.39.53-.32.9-.2.36.13 2.28 1.08 2.67 1.27.39.2.65.3.75.46.1.16.1.93-.15 1.62Z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.9 2h3.38L14.2 10.36 22 22h-6.69l-5.23-7.46L4.2 22H.8l7.9-9.03L2 2h6.86l4.75 6.77L18.9 2Zm-1.19 18.2h1.87L7.28 3.73H5.31L17.71 20.2Z" />
    </svg>
  )
}

export function PartShareButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href)
    }
  }, [])

  const currentUrl = shareUrl || (typeof window !== "undefined" ? window.location.href : "")

  const handleCopyLink = async () => {
    const url = currentUrl || ""

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const textarea = document.createElement("textarea")
        textarea.value = url
        textarea.setAttribute("readonly", "true")
        textarea.style.position = "fixed"
        textarea.style.left = "-9999px"
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
      }

      setCopied(true)
      setIsOpen(false)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      setIsOpen(false)
    }
  }

  const handleNativeShare = async () => {
    const url = currentUrl || ""

    if (!url) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: "Check out this auto part:",
          url,
        })
        setIsOpen(false)
        return
      } catch (error) {
        // Fall through to copy link if the user cancels the native share dialog.
      }
    }

    await handleCopyLink()
  }

  const handleSocialShare = (platform: "email" | "whatsapp" | "x") => {
    const url = currentUrl || ""
    const shareText = encodeURIComponent(`Check out this auto part: ${document.title}`)
    const encodedUrl = encodeURIComponent(url)

    let target = ""

    if (platform === "email") {
      target = `mailto:?subject=${shareText}&body=${encodedUrl}`
    }

    if (platform === "whatsapp") {
      target = `https://wa.me/?text=${shareText}%20${encodedUrl}`
    }

    if (platform === "x") {
      target = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`
    }

    if (target) {
      window.open(target, "_blank", "noopener,noreferrer")
    }

    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className="gap-2"
        aria-label="Share product"
      >
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {copied ? "Copied" : "Share"}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-border bg-popover p-2 shadow-lg">
          <div className="space-y-1">
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
            >
              <ArrowUpRight className="h-4 w-4 text-primary" />
              Share
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
              aria-label="Copy link"
            >
              <Link2 className="h-4 w-4 text-primary" />
              Copy link
            </button>

            <button
              type="button"
              onClick={() => handleSocialShare("email")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Mail className="h-4 w-4 text-primary" />
              Email
            </button>

            <button
              type="button"
              onClick={() => handleSocialShare("whatsapp")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
            >
              <WhatsAppIcon className="h-4 w-4 text-primary" />
              WhatsApp
            </button>

            <button
              type="button"
              onClick={() => handleSocialShare("x")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
            >
              <XIcon className="h-4 w-4 text-primary" />
              X / Twitter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
