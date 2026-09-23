import Link from "next/link";
import { Wrench, Home, ShieldCheck } from "lucide-react";

export default function SparePartsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              AutoParts<span className="text-primary">Pro</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              <span>Search</span>
            </Link>
            <Link 
              href="/admin" 
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-slate-50/50">
        {children}
      </main>
    </div>
  );
}
