import Link from "next/link";
import { Wrench, ArrowLeft, ShieldCheck, Search } from "lucide-react";

export default function SparePartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs shadow-primary/20 transition-transform group-hover:scale-105">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">
              AutoParts<span className="text-primary">Pro</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <Link
              href="/spare-parts"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted/60"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Catalog</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-2xs backdrop-blur-xs transition-colors hover:bg-accent hover:border-primary/40 hover:text-primary"
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
      <footer className="w-full py-5 px-6 border-t border-border/50 text-center sm:flex sm:items-center sm:justify-between text-xs text-muted-foreground bg-card/30">
        <div>
          © {new Date().getFullYear()} AutoPartsPro Catalog.
        </div>
        <div className="mt-2 sm:mt-0 flex items-center justify-center gap-4">
          <Link href="/spare-parts" className="hover:text-foreground transition-colors">
            All Parts
          </Link>
          <Link href="/admin" className="hover:text-foreground transition-colors">
            Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
