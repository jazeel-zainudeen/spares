import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { AdvancedSearchBar } from "@/components/public/AdvancedSearchBar";
import { Card } from "@/components/ui/Card";
import { getCategories } from "@/lib/services/categories";
import { getCompanies } from "@/lib/services/companies";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicMobileNav } from "@/components/layout/PublicMobileNav";

export default async function Home() {
  const [categories, companies] = await Promise.all([
    getCategories().catch(() => []),
    getCompanies().catch(() => []),
  ]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-background text-foreground pb-16 lg:pb-0">
      {/* Background Decorative Gradients & Mesh (clean, premium feel) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-35%] h-[32rem] w-[120vw] max-w-[62rem] -translate-x-1/2 rounded-full bg-linear-to-b from-primary/15 via-primary/5 to-transparent blur-3xl sm:h-[38rem]" />
        <div className="absolute left-[-10%] top-1/3 h-72 w-[85vw] max-w-[28rem] rounded-full bg-primary/5 blur-3xl sm:h-80 sm:w-96" />
        <div className="absolute bottom-10 right-[-8%] h-72 w-[85vw] max-w-[30rem] rounded-full bg-sky-500/5 blur-3xl sm:h-96 sm:w-[28rem]" />
        {/* Subtle dot matrix pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[24px_24px] opacity-60" />
      </div>

      <PublicHeader />

      {/* Centered Hero & Search Section (Single unified focus, no clutter) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 z-10 w-full max-w-4xl mx-auto">
        <div className="w-full text-center space-y-4 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Intelligent Automotive Parts Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            Search Spare Parts with{" "}
            <span className="text-primary">OEM Precision</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Find verified replacement parts by reference serial, manufacturer
            OEM code, car brand, and model compatibility.
          </p>
        </div>

        {/* Central Search Card */}
        <div className="w-full">
          <Card className="border-border/80 bg-card/85 shadow-xl shadow-black/5 backdrop-blur-md transition-all hover:border-primary/30">
            <div className="p-4 sm:p-6">
              <AdvancedSearchBar
                initialCategories={categories}
                initialCompanies={companies}
              />
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
      <footer className="w-full py-5 px-6 border-t border-border/50 text-center lg:flex lg:items-center lg:justify-between text-xs text-muted-foreground z-10">
        <div>
          © {new Date().getFullYear()} AutoPartsPro. Precision Automotive
          Catalog.
        </div>
        <div className="mt-2 sm:mt-0 flex items-center justify-center gap-4">
          <Link
            href="/spare-parts"
            className="hover:text-foreground transition-colors"
          >
            All Parts
          </Link>
          <Link
            href="/admin"
            className="hover:text-foreground transition-colors"
          >
            Admin
          </Link>
        </div>
      </footer>
      <PublicMobileNav />
    </div>
  );
}
