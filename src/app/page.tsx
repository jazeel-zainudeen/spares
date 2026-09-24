import Link from "next/link";
import { Wrench } from "lucide-react";
import { AdvancedSearchBar } from "@/components/public/AdvancedSearchBar";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Top right Admin Link */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          href="/admin"
          className="rounded-md border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur-xs transition-colors hover:bg-accent hover:text-foreground"
        >
          Admin Portal
        </Link>
      </div>

      {/* Centered Main Content */}
      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-xs ring-1 ring-primary/20">
          <Wrench className="h-8 w-8 text-primary" />
        </div>

        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          AutoParts<span className="text-primary">Pro</span>
        </h1>
        <p className="mb-8 text-sm text-muted-foreground sm:text-base">
          Precision auto parts lookup by vehicle model, manufacturer, and catalog reference.
        </p>

        <div className="w-full">
          <AdvancedSearchBar />
        </div>
      </div>
    </div>
  );
}
