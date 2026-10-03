import Link from "next/link"
import { getPublicParts, getPartImages } from "@/lib/services/parts"
import { fetchCompaniesAction } from "@/app/actions/companies"
import { fetchCategoriesAction } from "@/app/actions/categories"
import { getModelsWithCompany } from "@/lib/services/models"
import { SearchBar } from "@/components/public/SearchBar"
import { ListingImageCarousel } from "@/components/public/ListingImageCarousel"
import { CatalogFilters } from "@/components/public/CatalogFilters"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { InfinitePartList } from "@/components/public/InfinitePartList"

const PAGE_SIZE = 12

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; brand?: string; model?: string; page?: string }>
}) {
  const resolvedParams = await searchParams
  const search = resolvedParams?.search || ""
  const category = resolvedParams?.category || ""
  const brand = resolvedParams?.brand || ""
  const model = resolvedParams?.model || ""
  const page = Math.max(1, Number(resolvedParams?.page) || 1)

  const [
    { data: parts, total, totalPages },
    { data: categories = [] },
    { data: companies = [] },
    models,
  ] = await Promise.all([
    getPublicParts({
      categorySlug: category || undefined,
      companySlug: brand || undefined,
      modelSlug: model || undefined,
      search: search || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    fetchCategoriesAction().catch(() => ({ data: [] })),
    fetchCompaniesAction().catch(() => ({ data: [] })),
    getModelsWithCompany().catch(() => []),
  ])

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Top Header / Search */}
      <div className="mb-8 space-y-4 max-w-3xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Spare Parts Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse all available vehicle parts, cross-references, and compatible models
          </p>
        </div>
        <SearchBar initialValue={search} />
      </div>

      {/* Mobile Filters view */}
      <div className="block lg:hidden mb-6">
        <CatalogFilters
          categories={categories}
          companies={companies}
          models={models}
          activeCategory={category}
          activeBrand={brand}
          activeModel={model}
          searchQuery={search}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <CatalogFilters
            categories={categories}
            companies={companies}
            models={models}
            activeCategory={category}
            activeBrand={brand}
            activeModel={model}
            searchQuery={search}
          />
        </aside>

        {/* Main Parts Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h2 className="font-semibold text-sm text-foreground">
              {search
                ? `Search Results for "${search}"`
                : category || brand || model
                ? "Filtered Inventory"
                : "All Catalog Parts"}
            </h2>
            <Badge variant="secondary" className="text-xs font-normal">
              {total} {total === 1 ? "item" : "items"} found
            </Badge>
          </div>

          {parts.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                No parts found matching your criteria. Try adjusting your category, brand, model, or search term.
              </CardContent>
            </Card>
          ) : (
            <>
              <InfinitePartList
                initialParts={parts}
                initialPage={page}
                totalPages={totalPages}
                fetchParams={{
                  categorySlug: category || undefined,
                  companySlug: brand || undefined,
                  modelSlug: model || undefined,
                  search: search || undefined,
                  pageSize: PAGE_SIZE,
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
