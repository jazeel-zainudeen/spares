"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Mail, Share2, ArrowUpRight, Link2 } from "lucide-react"
import { Button } from "@/components/ui/Button"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 448 512" className={className} fill="currentColor" aria-hidden="true">
      <path d="M380.9 97.1C347 63.1 298.2 43 244.8 43c-83.2 0-151.2 68-151.2 151.2 0 26.7 6.9 52.8 20 75.7L43 405.5c-2.8 12.2 8.8 23.8 21 17.8l86.7-38.4c22.7 12.4 48.5 18.8 75.9 18.8h.1c83.2 0 151.1-68 151.1-151.2.1-40.6-15.8-79.3-44.7-108.1zM244.8 392.6c-23.1 0-45.5-6.2-65-17.9l-4.7-2.8-51.4 22.8 13.7-50.2-3.2-4.7c-12.7-18.8-19.5-40.8-19.5-63.7 0-69.5 56.4-126.1 125.8-126.1 33.6 0 65.1 13.1 88.8 36.8 23.8 23.6 36.8 55.1 36.8 88.7s-13.1 65.1-36.8 88.8c-23.7 23.8-55.1 36.9-88.8 36.9zm81.4-94.2c-4.5-2.2-26.6-13.1-30.7-14.6-4.1-1.5-7.1-2.2-10.1 2.2-3 4.4-11.6 14.7-14.2 17.7-2.6 2.9-5.2 3.4-9.7 1.2s-18.9-6.9-35.9-22.1c-13.3-11.8-22.2-26.4-24.8-30.8-2.6-4.4-.3-6.8 1.9-9.1 1.9-1.9 4.4-5.1 6.6-7.7 2.2-2.6 2.9-4.4 4.4-7.4 1.5-3 .7-5.5-.4-7.7-1.2-2.2-10.2-24.5-14-33.4-3.7-8.9-7.4-7.7-10.1-7.8-2.6-.1-5.7-.1-8.7-.1-3 0-7.9 1.2-12 5.5-4.1 4.4-15.7 15.3-15.7 37.2s16.1 43.1 18.3 46.1c2.2 2.9 31.5 48.1 76.3 67.4 10.7 4.6 19 7.3 25.5 9.4 10.7 3.4 20.4 2.9 28.1 1.8 8.6-1.3 26.6-10.9 30.4-21.4 3.7-10.5 3.7-19.5 2.6-21.4-1.1-1.9-4.1-3.1-8.6-5.4Z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.189 9.45 12.508h-7.406l-5.8-7.668-6.617 7.668H.314l8.547-9.77L.26 1.153h7.594l5.243 6.932 6.08-6.932Zm-1.29 19.49h2.039L7.2 2.695H4.989l12.622 17.948Z" />
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
