import Link from "next/link";
import { Wrench, ArrowLeft, ShieldCheck, Search, Layers, Building2, Car } from "lucide-react";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground pb-20 sm:pb-0">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs shadow-primary/20 transition-transform group-hover:scale-105">
              <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="font-bold text-base sm:text-lg text-foreground tracking-tight">
              AutoParts<span className="text-primary">Pro</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-1.5 md:gap-2">
            <Link
              href="/"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/60"
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/60"
            >
              Categories
            </Link>
            <Link
              href="/brands"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/60"
            >
              Brands
            </Link>
            <Link
              href="/models"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/60"
            >
              Models
            </Link>
            <Link
              href="/spare-parts"
              className="text-xs font-semibold text-primary bg-primary/10 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Catalog</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs backdrop-blur-xs transition-colors hover:bg-accent hover:border-primary/40 hover:text-primary ml-1"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Quick Action */}
          <div className="flex sm:hidden items-center gap-2">
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

      <main className="flex-1">
        {children}
      </main>

      {/* Desktop Footer */}
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

      {/* Mobile App Bottom Floating Dock */}
      <nav 
        aria-label="Mobile Navigation"
        className="sm:hidden fixed bottom-3 inset-x-3 z-40 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-xl shadow-black/10 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
      >
        <div className="flex items-center justify-around">
          <Link
            href="/"
            className="flex flex-col items-center justify-center py-0.5 text-muted-foreground hover:text-foreground transition-all active:scale-95"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-medium leading-none mt-0.5">Home</span>
          </Link>

          <Link
            href="/categories"
            className="flex flex-col items-center justify-center py-0.5 text-muted-foreground hover:text-foreground transition-all active:scale-95"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-medium leading-none mt-0.5">Categories</span>
          </Link>

          <Link
            href="/brands"
            className="flex flex-col items-center justify-center py-0.5 text-muted-foreground hover:text-foreground transition-all active:scale-95"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-medium leading-none mt-0.5">Brands</span>
          </Link>

          <Link
            href="/models"
            className="flex flex-col items-center justify-center py-0.5 text-muted-foreground hover:text-foreground transition-all active:scale-95"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg">
              <Car className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-medium leading-none mt-0.5">Models</span>
          </Link>

          <Link
            href="/spare-parts"
            className="flex flex-col items-center justify-center py-0.5 text-primary font-semibold transition-all active:scale-95"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Search className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-semibold leading-none mt-0.5">Catalog</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
