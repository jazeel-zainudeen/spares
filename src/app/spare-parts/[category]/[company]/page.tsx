import Link from "next/link"
import { notFound } from "next/navigation"
import { getPublicParts } from "@/lib/services/parts"
import { fetchCompaniesAction } from "@/app/actions/companies"
import { fetchCategoriesAction } from "@/app/actions/categories"
import { SearchBar } from "@/components/public/SearchBar"
import { Image as ImageIcon, ChevronRight, Factory, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Pagination } from "@/components/ui/Pagination"

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
      {/* Top Header / Breadcrumb / Search */}
      <div className="mb-8 space-y-4 max-w-3xl">
        <Link
          href={`/spare-parts/${currentCategory.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to {currentCategory.name}</span>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {currentCompany.name} {currentCategory.name} Parts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compatible {currentCategory.name.toLowerCase()} catalog items for {currentCompany.name} vehicles
          </p>
        </div>
        <SearchBar initialValue={search} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Companies Sidebar */}
        <aside className="hidden lg:block space-y-6">
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
                        <span className="truncate">{company.name}</span>
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
              {parts.length} {parts.length === 1 ? "item" : "items"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {parts.map((part: any) => {
                  const modelSlug = part.car_models?.slug || "model"
                  const href = `/spare-parts/${resolvedParams.category}/${resolvedParams.company}/${modelSlug}/${part.id}`

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
                        </div>
                        <CardContent className="p-3.5 space-y-2">
                          <div className="text-[11px] font-medium text-primary truncate">
                            {part.car_models?.name}
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

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                pageSize={PAGE_SIZE}
                buildLink={(p) => {
                  const params = new URLSearchParams()
                  if (search) params.set("search", search)
                  if (p > 1) params.set("page", String(p))
                  const query = params.toString()
                  return `/spare-parts/${resolvedParams.category}/${resolvedParams.company}${query ? `?${query}` : ""}`
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
