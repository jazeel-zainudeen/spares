import Link from "next/link"
import { getPublicParts } from "@/lib/services/parts"
import { fetchCompaniesAction } from "@/app/actions/companies"
import { fetchCategoriesAction } from "@/app/actions/categories"
import { SearchBar } from "@/components/public/SearchBar"
import { Image as ImageIcon, ChevronRight, Layers } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const resolvedParams = await searchParams
  const search = resolvedParams?.search || ""
  const parts = await getPublicParts({ search })
  const { data: categories = [] } = await fetchCategoriesAction()

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Top Header / Search */}
      <div className="mb-8 space-y-4 max-w-3xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Spare Parts Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse all available vehicle parts and cross-references</p>
        </div>
        <SearchBar initialValue={search} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-2 font-semibold text-sm mb-3 text-foreground">
                <Layers className="h-4 w-4 text-primary" />
                <span>Categories</span>
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link
                    href="/spare-parts"
                    className="flex items-center justify-between py-1.5 px-2 rounded-md font-medium text-primary bg-primary/10 transition-colors"
                  >
                    <span>All Categories</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                  </Link>
                </li>
                {categories.map((category: any) => (
                  <li key={category.id}>
                    <Link
                      href={`/spare-parts/${category.slug}`}
                      className="flex items-center justify-between py-1.5 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    >
                      <span className="truncate">{category.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 opacity-40 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

        {/* Main Parts Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h2 className="font-semibold text-sm text-foreground">
              {search ? `Search Results for "${search}"` : "All Catalog Parts"}
            </h2>
            <Badge variant="secondary" className="text-xs font-normal">
              {parts.length} {parts.length === 1 ? "item" : "items"}
            </Badge>
          </div>

          {parts.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                No parts found matching your criteria. Try searching for a different keyword or part number.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {parts.map((part: any) => {
                const categorySlug = part.categories?.slug || "uncategorized"
                const companySlug = part.car_models?.car_companies?.slug || "unknown"
                const modelSlug = part.car_models?.slug || "model"
                const href = `/spare-parts/${categorySlug}/${companySlug}/${modelSlug}/${part.id}`

                return (
                  <Link key={part.id} href={href} className="group">
                    <Card className="h-full overflow-hidden transition-all hover:border-primary/40 hover:shadow-xs">
                      <div className="aspect-16/10 bg-muted/40 relative flex items-center justify-center p-3 border-b border-border/60">
                        {part.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={part.image_url}
                            alt={part.item}
                            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                        )}
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                            {part.categories?.name || "Auto Part"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-3.5 space-y-2">
                        <div className="text-[11px] font-medium text-primary truncate">
                          {part.car_models?.car_companies?.name} • {part.car_models?.name}
                        </div>
                        <h3 className="font-semibold text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors text-foreground">
                          {part.item}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-muted-foreground font-mono">
                          <span className="rounded-sm bg-muted px-1.5 py-0.5">REF: {part.ref_number}</span>
                          {part.oem_number && (
                            <span className="rounded-sm bg-muted px-1.5 py-0.5">OEM: {part.oem_number}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
