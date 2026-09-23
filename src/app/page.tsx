import Link from "next/link";
import { Search, ArrowRight, ShieldCheck, Clock, Truck, Settings, Image as ImageIcon } from "lucide-react";
import { getCategories } from "@/lib/services/categories";

export default async function Home() {
  const categories = await getCategories();
  
  return (
    <div className="flex-1 pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-32 flex flex-col justify-center min-h-[85vh]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8 flex flex-col items-center">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              v2.0 Catalog Now Live
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              The Premium Catalog for <br className="hidden md:block" />
              <span className="text-gradient">
                Automotive Parts
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Discover millions of precision-engineered components across top automotive brands. Designed for professionals who demand excellence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link 
                href="/spare-parts" 
                className="w-full sm:w-auto h-12 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-8 font-medium text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-105 active:scale-95"
              >
                Browse Catalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              
              <Link 
                href="/brands" 
                className="w-full sm:w-auto h-12 inline-flex items-center justify-center rounded-full bg-white/5 border border-white/10 px-8 font-medium text-slate-200 transition-all hover:bg-white/10 hover:border-white/20 hover:text-white"
              >
                View Supported Brands
              </Link>
            </div>
            
            {/* Quick Search Bar placeholder */}
            <div className="mt-12 w-full max-w-2xl mx-auto p-2 glass rounded-2xl flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
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

      {/* Categories Section */}
      <section className="py-24 relative overflow-hidden bg-slate-900/20 border-t border-slate-800/50">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gradient-primary">Browse by Category</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Select a part category to narrow down your search and find exactly what fits your vehicle.
            </p>
          </div>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/spare-parts/${category.slug}`}
                  className="group relative glass-card p-6 md:p-8 rounded-[2rem] overflow-hidden flex flex-col items-center text-center space-y-5 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="h-24 w-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center relative overflow-hidden z-10 p-4 border border-slate-700/50 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-500">
                    {category.image_url ? (
                      <img src={category.image_url} alt={category.name} className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Settings className="h-10 w-10 text-slate-400 group-hover:text-primary transition-colors duration-500 animate-float" />
                    )}
                  </div>
                  
                  <div className="space-y-2 relative z-10">
                    <h3 className="font-semibold text-xl text-slate-200 group-hover:text-white transition-colors">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 glass-card rounded-[2rem]">
              No categories available at the moment.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
