"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Mail, Share2, ArrowUpRight, Link2 } from "lucide-react"
import { FaWhatsapp, FaXTwitter } from "react-icons/fa6"
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
        <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl border border-border bg-popover p-2 shadow-lg shadow-black/10">
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent/80"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ArrowUpRight className="h-4 w-4" />
              </span>
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent/80"
              aria-label="Copy link"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Link2 className="h-4 w-4" />
              </span>
              <span>Copy link</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialShare("email")}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent/80"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </span>
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialShare("whatsapp")}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent/80"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
                <FaWhatsapp className="h-4 w-4" />
              </span>
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialShare("x")}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent/80"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-500/10 text-sky-600">
                <FaXTwitter className="h-4 w-4" />
              </span>
              <span>X / Twitter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
