import Link from "next/link"
import { notFound } from "next/navigation"
import { getPublicParts } from "@/lib/services/parts"
import { fetchCompaniesAction } from "@/app/actions/companies"
import { fetchCategoriesAction } from "@/app/actions/categories"
import { SearchBar } from "@/components/public/SearchBar"
import { Image as ImageIcon, ChevronRight } from "lucide-react"

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string }
  searchParams: { search?: string }
}) {
  const search = searchParams.search || ""
  
  const { data: categories = [] } = await fetchCategoriesAction()
  const currentCategory = categories.find(c => c.slug === params.category)
  
  if (!currentCategory) {
    notFound()
  }

  const parts = await getPublicParts({ search, categorySlug: params.category })
  const { data: companies = [] } = await fetchCompaniesAction()

  return (
    <div className="container mx-auto px-4 py-12 pt-24 min-h-screen">
      <div className="mb-12 space-y-6 text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gradient-primary">
          {currentCategory.name} Parts
        </h1>
        {currentCategory.description && (
          <p className="text-lg text-muted-foreground max-w-2xl">{currentCategory.description}</p>
        )}
        <div className="max-w-xl">
          <SearchBar initialValue={search} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block space-y-6">
          <div className="glass-card p-6 rounded-3xl sticky top-28">
            <h2 className="font-bold text-xl mb-6 text-slate-200">Browse by Category</h2>
            <ul className="space-y-3">
              <li className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-between">
                <Link href="/spare-parts">All Categories</Link>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </li>
              {categories.map(category => (
                <li key={category.id}>
                  <Link 
                    href={`/spare-parts/${category.slug}`}
                    className={`transition-colors flex items-center justify-between ${
                      category.slug === params.category ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {category.name}
                    {category.slug === params.category && <ChevronRight className="h-4 w-4" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl">
              {search ? `Search Results for "${search}"` : "All Parts"}
            </h2>
            <span className="text-muted-foreground text-sm">{parts.length} items found</span>
          </div>

          {parts.length === 0 ? (
            <div className="glass-card p-16 rounded-[2rem] flex flex-col items-center justify-center text-center text-muted-foreground border-dashed border-2 border-slate-700/50">
              <ImageIcon className="h-16 w-16 mb-4 text-muted-foreground animate-float" />
              <h3 className="text-xl font-medium text-muted-foreground mb-2">No parts found</h3>
              <p>Try adjusting your search criteria or browsing a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {parts.map((part: any) => (
                <Link 
                  key={part.id} 
                  href={`/spare-parts/${part.categories?.slug || 'uncategorized'}/${part.car_models.car_companies.slug}/${part.car_models.slug}/${part.id}`}
                  className="group relative glass-card rounded-[2rem] overflow-hidden flex flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(139,92,246,0.2)] hover:border-primary/40"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center p-6 border-b border-slate-700/50">
                    {part.image_url ? (
                      <img src={part.image_url} alt={part.item} className="max-h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    )}
                  </div>
                  
                  <div className="p-6 space-y-4 flex-1 flex flex-col z-10 relative">
                    <div className="flex justify-between items-start gap-2">
                      <div className="text-xs text-secondary font-medium tracking-wide uppercase">
                        {part.car_models.car_companies.name} • {part.car_models.name}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground bg-slate-800/80 border border-slate-700 px-2 py-1 rounded-full truncate max-w-[100px]">
                        {part.categories?.name || 'Uncategorized'}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg leading-tight text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                      {part.item}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                      <span className="bg-slate-800/80 border border-slate-700/50 px-2.5 py-1 rounded-lg">
                        REF: <span className="text-muted-foreground">{part.ref_number}</span>
                      </span>
                      {part.oem_number && (
                        <span className="bg-slate-800/80 border border-slate-700/50 px-2.5 py-1 rounded-lg">
                          OEM: <span className="text-muted-foreground">{part.oem_number}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
