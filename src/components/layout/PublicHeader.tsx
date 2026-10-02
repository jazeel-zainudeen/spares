"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Layers, Building2, Car, Search, ShieldCheck, Home, Download } from "lucide-react"
import { useInstallPrompt } from "@/components/public/useInstallPrompt"

export function PublicHeader() {
  const pathname = usePathname()
  const { canInstall, handleInstall } = useInstallPrompt()

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Categories", href: "/categories", icon: Layers },
    { label: "Brands", href: "/brands", icon: Building2 },
    { label: "Models", href: "/models", icon: Car },
    { label: "Catalog", href: "/spare-parts", icon: Search },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-xl transition-transform group-hover:scale-105 sm:h-9 sm:w-9">
            <Image
              src="/logo-mark.png"
              alt=""
              width={192}
              height={192}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-bold text-base sm:text-lg text-foreground tracking-tight">
            AutoParts <span className="text-primary">Pro</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-1 lg:gap-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs transition-colors px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 ${
                  active
                    ? "text-primary font-semibold bg-primary/10 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {item.icon && <item.icon className="h-3.5 w-3.5" />}
                <span>{item.label}</span>
              </Link>
            )
          })}

          {canInstall && (
            <button
              onClick={handleInstall}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary shadow-2xs transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary ml-1"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Install App</span>
            </button>
          )}

          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs backdrop-blur-xs transition-colors hover:bg-accent hover:border-primary/40 hover:text-primary ml-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Admin</span>
          </Link>
        </nav>

        {/* Mobile Quick Actions */}
        <div className="flex sm:hidden items-center gap-2">
          {canInstall && (
            <button
              onClick={handleInstall}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/5 text-primary shadow-2xs transition-all active:scale-95 hover:bg-primary hover:text-primary-foreground hover:border-primary"
              title="Install App"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          )}
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1 text-xs font-medium text-foreground shadow-2xs transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
