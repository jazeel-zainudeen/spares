import Link from "next/link"
import { getModelsWithCompany } from "@/lib/services/models"
import { getCompanies } from "@/lib/services/companies"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Car, ChevronRight, Building2, Filter } from "lucide-react"

export const metadata = {
  title: "Models - AutoPartsPro Catalog",
  description: "Browse spare parts by specific car model",
}

export default async function ModelsPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>
}) {
  const resolvedParams = await searchParams
  const brandFilter = resolvedParams?.brand || ""
  
  const models = await getModelsWithCompany(brandFilter || undefined)
  const companies = await getCompanies()

  // Group models by company
  const grouped: Record<string, { company: any; models: any[] }> = {}
  for (const model of models) {
    const companyId = model.car_companies?.slug || model.company_id
    const companyName = model.car_companies?.name || "Unknown"
    if (!grouped[companyId]) {
      grouped[companyId] = {
        company: {
          slug: model.car_companies?.slug,
          name: companyName,
          logo_url: model.car_companies?.logo_url,
        },
        models: [],
      }
    }
    grouped[companyId].models.push(model)
  }

  const groupedEntries = Object.entries(grouped).sort(([, a], [, b]) =>
    a.company.name.localeCompare(b.company.name)
  )

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Car className="h-3.5 w-3.5" />
          <span>Vehicle Models</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Browse by Model
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Find spare parts for a specific vehicle model. Select a model to view all compatible parts.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Badge variant="secondary" className="text-xs font-normal px-3 py-1">
          {models.length} {models.length === 1 ? "model" : "models"} found
        </Badge>

        {/* Brand Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
            <Filter className="h-3 w-3" />
            <span>Brand:</span>
          </div>
          <Link
            href="/models"
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
              !brandFilter
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            All
          </Link>
          {companies.map((company: any) => (
            <Link
              key={company.id}
              href={`/models?brand=${company.slug}`}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                brandFilter === company.slug
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {company.name}
            </Link>
          ))}
        </div>
      </div>

      {models.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            {brandFilter
              ? `No models found for the selected brand. Try a different filter.`
              : "No models available yet. Run the scraper to populate data."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          {groupedEntries.map(([key, group]) => (
            <section key={key}>
              {/* Company header */}
              <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/60">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 shrink-0">
                  {group.company.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={group.company.logo_url}
                      alt={group.company.name}
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-sm text-foreground">{group.company.name}</h2>
                  <p className="text-[11px] text-muted-foreground">
                    {group.models.length} {group.models.length === 1 ? "model" : "models"}
                  </p>
                </div>
              </div>

              {/* Models grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {group.models.map((model: any) => (
                  <Link
                    key={model.id}
                    href={`/spare-parts?model=${model.slug}`}
                    className="group block"
                  >
                    <Card className="h-full overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
                      <CardContent className="p-3.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
                              <Car className="h-3.5 w-3.5" />
                            </div>
                            <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                              {model.name}
                            </h3>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono pl-7.5 truncate">
                            /{model.slug}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/60 shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
