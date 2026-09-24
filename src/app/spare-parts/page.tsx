import Link from "next/link"
import { getPublicParts } from "@/lib/services/parts"
import { fetchCompaniesAction } from "@/app/actions/companies"
import { fetchCategoriesAction } from "@/app/actions/categories"
import { SearchBar } from "@/components/public/SearchBar"
import { Image as ImageIcon, ChevronRight } from "lucide-react"

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const resolvedParams = await searchParams
  const search = resolvedParams?.search || ""
  const parts = await getPublicParts({ search })
  const { data: companies = [] } = await fetchCompaniesAction()
  const { data: categories = [] } = await fetchCategoriesAction()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-6">
        <h1 className="text-4xl font-bold">Spare Parts Catalog</h1>
        <SearchBar initialValue={search} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h2 className="font-bold text-lg mb-4">Browse by Category</h2>
            <ul className="space-y-2">
              <li className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-between">
                <Link href="/spare-parts">All Categories</Link>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </li>
              {categories.map(category => (
                <li key={category.id}>
                  <Link 
                    href={`/spare-parts/${category.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-between"
                  >
                    {category.name}
                    <ChevronRight className="h-4 w-4 opacity-50" />
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
            <div className="glass p-12 rounded-2xl text-center text-muted-foreground">
              No parts found matching your criteria. Try adjusting your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {parts.map((part: any) => (
                <Link 
                  key={part.id} 
                  href={`/spare-parts/${part.categories?.slug || 'uncategorized'}/${part.car_models.car_companies.slug}/${part.car_models.slug}/${part.id}`}
                  className="glass rounded-2xl overflow-hidden group hover:ring-2 hover:ring-primary/50 transition-all"
                >
                  <div className="aspect-square bg-white/5 relative flex items-center justify-center p-4">
                    {part.image_url ? (
                      <img src={part.image_url} alt={part.item} className="max-h-full object-contain transition-transform group-hover:scale-105" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="p-4 space-y-2 border-t border-white/5">
                    <div className="flex justify-between items-start gap-2">
                      <div className="text-xs text-primary font-medium">
                        {part.car_models.car_companies.name} • {part.car_models.name}
                      </div>
                      <div className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full truncate max-w-25">
                        {part.categories?.name || 'Uncategorized'}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {part.item}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="bg-white/10 px-2 py-0.5 rounded text-xs">REF: {part.ref_number}</span>
                      {part.oem_number && (
                        <span className="bg-white/10 px-2 py-0.5 rounded text-xs">OEM: {part.oem_number}</span>
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
