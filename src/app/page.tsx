import Link from "next/link";
import { Wrench } from "lucide-react";
import { AdvancedSearchBar } from "@/components/public/AdvancedSearchBar";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col relative min-h-[100dvh]">
      {/* Top right Admin Link */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
        <Link 
          href="/admin" 
          className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-4 py-2"
        >
          Admin
        </Link>
      </div>

      {/* Centered Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 w-full -mt-20">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-primary/10 p-4 rounded-3xl mb-6">
            <Wrench className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
            AutoParts<span className="text-primary">Pro</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Find exactly what you need.
          </p>
        </div>

        <AdvancedSearchBar />
      </div>
    </div>
  );
}
