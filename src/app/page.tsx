import Link from "next/link";
import { Wrench, ArrowRight, ShieldCheck, Sparkles, Layers } from "lucide-react";
import { AdvancedSearchBar } from "@/components/public/AdvancedSearchBar";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-background text-foreground">
      {/* Background Decorative Gradients & Mesh (clean, premium feel) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-35%] left-1/2 h-150 w-225 -translate-x-1/2 rounded-full bg-linear-to-b from-primary/15 via-primary/5 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-[-10%] h-87.5 w-112.5 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-[-10%] h-100 w-125 rounded-full bg-sky-500/5 blur-3xl" />
        {/* Subtle dot matrix pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[24px_24px] opacity-60" />
      </div>

      {/* Header bar */}
      <header className="w-full px-6 py-5 flex items-center justify-between z-20">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 transition-transform group-hover:scale-105">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            AutoParts<span className="text-primary">Pro</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/spare-parts"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted/60"
          >
            <Layers className="h-3.5 w-3.5" />
            Catalog
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-2xs backdrop-blur-xs transition-all hover:bg-accent hover:border-primary/40 hover:text-primary"
          >
            <span>Admin Portal</span>
            <ArrowRight className="h-3.5 w-3.5 opacity-60" />
          </Link>
        </div>
      </header>

      {/* Centered Hero & Search Section (Single unified focus, no clutter) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 z-10 w-full max-w-4xl mx-auto">
        <div className="w-full text-center space-y-4 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Intelligent Automotive Parts Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            Search Spare Parts with <span className="text-primary">OEM Precision</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Find verified replacement parts by reference serial, manufacturer OEM code, car brand, and model compatibility.
          </p>
        </div>

        {/* Central Search Card */}
        <div className="w-full">
          <Card className="border-border/80 bg-card/85 shadow-xl shadow-black/5 backdrop-blur-md transition-all hover:border-primary/30">
            <div className="p-4 sm:p-6">
              <AdvancedSearchBar />
            </div>
          </Card>
        </div>

        {/* Subtle trust / quick feature pills below search */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Verified OEM Numbers
          </span>
          <span className="hidden sm:inline-block text-border">•</span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1 font-medium">
            Fast Brand & Model Filtering
          </span>
          <span className="hidden sm:inline-block text-border">•</span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1 font-medium">
            High-Resolution Part Diagrams
          </span>
        </div>
      </main>

      {/* Clean minimal footer */}
      <footer className="w-full py-5 px-6 border-t border-border/50 text-center sm:flex sm:items-center sm:justify-between text-xs text-muted-foreground z-10">
        <div>
          © {new Date().getFullYear()} AutoPartsPro. Precision Automotive Catalog.
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
