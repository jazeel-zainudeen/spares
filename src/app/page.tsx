import Link from "next/link";
import { Search, ArrowRight, ShieldCheck, Clock, Truck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              The Premium Catalog for <br className="hidden md:block" />
              <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Automotive Parts
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Find exactly what you need for any make and model. Our intelligent search and verified supplier network ensure you get the right part, every time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/catalog" 
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
              >
                Browse Catalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              
              <Link 
                href="/brands" 
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 px-8 py-3.5 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
              >
                View Supported Brands
              </Link>
            </div>
            
            {/* Quick Search Bar placeholder */}
            <div className="mt-12 max-w-2xl mx-auto p-2 glass rounded-2xl flex items-center gap-2">
              <div className="flex-1 flex items-center px-4 gap-3 text-muted-foreground">
                <Search className="h-5 w-5" />
                <input 
                  type="text" 
                  placeholder="Search by part number, name, or vehicle..." 
                  className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground/60 h-10"
                  disabled
                />
              </div>
              <button className="bg-primary/20 text-primary px-6 py-2 rounded-xl font-medium" disabled>
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl space-y-4 relative overflow-hidden group">
              <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Verified Quality</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every part in our catalog is sourced from certified manufacturers and comes with full warranty documentation.
              </p>
            </div>
            
            <div className="glass p-8 rounded-3xl space-y-4 relative overflow-hidden group">
              <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Real-time Inventory</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect directly with supplier databases to see exact stock levels across multiple warehouses instantly.
              </p>
            </div>
            
            <div className="glass p-8 rounded-3xl space-y-4 relative overflow-hidden group">
              <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Express Sourcing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Optimized logistics network ensures next-day availability for over 85% of standard maintenance components.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
