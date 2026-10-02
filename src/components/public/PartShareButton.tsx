"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Mail, Share2, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/Button"

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
              <Share2 className="h-4 w-4 text-primary" />
              Share
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
              aria-label="Copy link"
            >
              <Copy className="h-4 w-4 text-primary" />
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
              <MessageCircle className="h-4 w-4 text-primary" />
              WhatsApp
            </button>

            <button
              type="button"
              onClick={() => handleSocialShare("x")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
            >
              <Send className="h-4 w-4 text-primary" />
              X / Twitter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
