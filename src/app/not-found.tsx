"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Wrench, Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNotFound } from "@/components/public/NotFoundContext";

export default function NotFound() {
  const { setIsNotFound } = useNotFound();

  useEffect(() => {
    setIsNotFound(true);
    return () => {
      setIsNotFound(false);
    };
  }, [setIsNotFound]);

  return (
    <div
      data-not-found="true"
      className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center"
    >
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-muted/80 text-muted-foreground shadow-inner border border-border/50">
          <Wrench className="h-12 w-12 text-primary/80 animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold shadow-sm">
          404
        </div>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-2 text-base text-muted-foreground max-w-md">
        Sorry, the part or page you are looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/spare-parts">
            <Search className="mr-2 h-4 w-4" />
            Browse Parts
          </Link>
        </Button>
      </div>
    </div>
  );
}
