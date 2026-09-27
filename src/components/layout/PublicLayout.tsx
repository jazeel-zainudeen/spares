import Link from "next/link"
import { PublicHeader } from "./PublicHeader"
import { PublicMobileNav } from "./PublicMobileNav"

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground pb-20 sm:pb-0">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <footer className="hidden w-full py-5 px-6 border-t border-border/50 text-center sm:flex sm:items-center sm:justify-between text-xs text-muted-foreground bg-card/30">
        <div>
          © {new Date().getFullYear()} AutoPartsPro Catalog. All rights reserved.
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link href="/categories" className="hover:text-foreground transition-colors">
            Categories
          </Link>
          <Link href="/brands" className="hover:text-foreground transition-colors">
            Brands
          </Link>
          <Link href="/models" className="hover:text-foreground transition-colors">
            Models
          </Link>
          <Link href="/spare-parts" className="hover:text-foreground transition-colors">
            All Parts
          </Link>
          <Link href="/admin" className="hover:text-foreground transition-colors">
            Admin Portal
          </Link>
        </div>
      </footer>
      <PublicMobileNav />
    </div>
  )
}
