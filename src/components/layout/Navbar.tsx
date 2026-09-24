import Link from "next/link";
import { Wrench } from "lucide-react";

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <header className="container mx-auto px-6 h-16 flex items-center justify-between glass rounded-full">
        <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95 duration-300">
          <div className="bg-primary/20 p-2 rounded-xl">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">AutoParts<span className="text-primary">Pro</span></span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/catalog" className="text-muted-foreground transition-all hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            Catalog
          </Link>
          <Link href="/brands" className="text-muted-foreground transition-all hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            Brands
          </Link>
          <Link href="/admin" className="text-muted-foreground transition-all hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            Admin
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-white"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-105 active:scale-95"
          >
            Sign up
          </Link>
        </div>
      </header>
    </div>
  );
}
