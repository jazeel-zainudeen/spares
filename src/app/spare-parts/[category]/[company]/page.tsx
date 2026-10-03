import Link from "next/link"
import { notFound } from "next/navigation"
import { getPublicParts, getPartImages } from "@/lib/services/parts"
import { fetchCompaniesAction } from "@/app/actions/companies"
import { fetchCategoriesAction } from "@/app/actions/categories"
import { SearchBar } from "@/components/public/SearchBar"
import { ListingImageCarousel } from "@/components/public/ListingImageCarousel"
import { ChevronRight, Factory, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { InfinitePartList } from "@/components/public/InfinitePartList"

const PAGE_SIZE = 12

export default async function CompanyCatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string, company: string }>
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const search = resolvedSearchParams?.search || ""
  const page = Math.max(1, Number(resolvedSearchParams?.page) || 1)

  const { data: categories = [] } = await fetchCategoriesAction()
  const currentCategory = categories.find(c => c.slug === resolvedParams.category)

  const { data: companies = [] } = await fetchCompaniesAction()
  const currentCompany = companies.find(c => c.slug === resolvedParams.company)

  if (!currentCategory || !currentCompany) {
    notFound()
  }

  const { data: parts, total, totalPages } = await getPublicParts({
    search,
    categorySlug: resolvedParams.category,
    companySlug: resolvedParams.company,
    page,
    pageSize: PAGE_SIZE,
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Top Header / Breadcrumb */}
      <div className="mb-4 max-w-3xl">
        <Link
          href={`/spare-parts/${currentCategory.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to {currentCategory.name}</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {currentCompany.name} {currentCategory.name} Parts
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compatible {currentCategory.name.toLowerCase()} catalog items for {currentCompany.name} vehicles
        </p>
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-[57px] sm:top-[65px] z-30 bg-background/95 backdrop-blur-xl py-2 sm:py-3 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-border/40 mb-3 sm:mb-6">
        <div className="max-w-3xl">
          <SearchBar initialValue={search} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Companies Sidebar */}
        <aside className="hidden lg:block space-y-6 sticky top-[160px] self-start max-h-[calc(100vh-180px)] overflow-y-auto pr-2 pb-4">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-2 font-semibold text-sm mb-3 text-foreground">
                <Factory className="h-4 w-4 text-primary" />
                <span>Manufacturers</span>
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link
                    href={`/spare-parts/${resolvedParams.category}`}
                    className="flex items-center justify-between py-1.5 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <span>All Manufacturers</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-40 shrink-0" />
                  </Link>
                </li>
                {companies.map((company: any) => {
                  const isActive = company.slug === resolvedParams.company
                  return (
                    <li key={company.id}>
                      <Link
                        href={`/spare-parts/${resolvedParams.category}/${company.slug}`}
                        className={`flex items-center justify-between py-1.5 px-2 rounded-md transition-colors ${
                          isActive
                            ? "font-medium text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="truncate">{company.name}</span>
                          <span className="text-[10px] opacity-70 font-normal leading-none mt-0.5">
                            {company.part_count === 1 ? '1 Part' : `${company.part_count ?? 0} Parts`}
                          </span>
                        </div>
                        <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${isActive ? "opacity-70" : "opacity-40"}`} />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </aside>

        {/* Main Parts Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <h2 className="font-semibold text-sm text-foreground">
              {search ? `Search Results for "${search}"` : `All ${currentCompany.name} Parts`}
            </h2>
            <Badge variant="secondary" className="text-xs font-normal">
              {total} {total === 1 ? "item" : "items"} found
            </Badge>
          </div>

          {parts.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                No {currentCategory.name.toLowerCase()} parts found for {currentCompany.name}.
              </CardContent>
            </Card>
          ) : (
            <>
              <InfinitePartList
                initialParts={parts}
                initialPage={page}
                totalPages={totalPages}
                categorySlug={resolvedParams.category}
                companySlug={resolvedParams.company}
                fetchParams={{
                  categorySlug: resolvedParams.category,
                  companySlug: resolvedParams.company,
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
