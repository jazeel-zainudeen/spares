import Link from "next/link";
import { Wrench } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <Wrench className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">AutoParts<span className="text-primary">Pro</span></span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/catalog" className="text-muted-foreground transition-colors hover:text-foreground">
            Catalog
          </Link>
          <Link href="/brands" className="text-muted-foreground transition-colors hover:text-foreground">
            Brands
          </Link>
          <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground">
            Admin
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
