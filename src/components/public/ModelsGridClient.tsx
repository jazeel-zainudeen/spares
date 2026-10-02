"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Car, ChevronRight, Building2, Filter } from "lucide-react"
import { InlineSearchInput } from "@/components/public/InlineSearchInput"

interface ModelItem {
  id: string
  name: string
  slug: string
  company_id?: string
  part_count?: number
  car_companies?: {
    id?: string
    slug?: string
    name?: string
    logo_url?: string | null
  }
}

interface CompanyItem {
  id: string
  name: string
  slug: string
}

export function ModelsGridClient({
  models,
  companies,
  initialBrandFilter = "",
}: {
  models: ModelItem[]
  companies: CompanyItem[]
  initialBrandFilter?: string
}) {
  const [search, setSearch] = useState("")
  const [selectedBrand, setSelectedBrand] = useState(initialBrandFilter)

  // Filter models by selected brand and search term
  const filteredModels = useMemo(() => {
    let list = models
    if (selectedBrand) {
      list = list.filter(
        (m) =>
          m.car_companies?.slug === selectedBrand ||
          m.company_id === selectedBrand
      )
    }

    const q = search.trim().toLowerCase()
    if (!q) return list

    return list.filter((m) => {
      const modelName = m.name.toLowerCase()
      const companyName = (m.car_companies?.name || "").toLowerCase()
      return modelName.includes(q) || companyName.includes(q)
    })
  }, [models, selectedBrand, search])

  // Group filtered models by company
  const groupedEntries = useMemo(() => {
    const grouped: Record<
      string,
      {
        company: { slug?: string; name: string; logo_url?: string | null }
        models: ModelItem[]
      }
    > = {}

    for (const model of filteredModels) {
      const companyKey = model.car_companies?.slug || model.company_id || "unknown"
      const companyName = model.car_companies?.name || "Unknown"
      if (!grouped[companyKey]) {
        grouped[companyKey] = {
          company: {
            slug: model.car_companies?.slug,
            name: companyName,
            logo_url: model.car_companies?.logo_url,
          },
          models: [],
        }
      }
      grouped[companyKey].models.push(model)
    }

    return Object.entries(grouped).sort(([, a], [, b]) =>
      a.company.name.localeCompare(b.company.name)
    )
  }, [filteredModels])

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <InlineSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search models or brand..."
          />
        </div>
        <Badge variant="secondary" className="self-start sm:self-auto text-xs font-normal px-3 py-1">
          {filteredModels.length}{" "}
          {filteredModels.length === 1 ? "model" : "models"}
          {search ? ` matching "${search}"` : " found"}
        </Badge>
      </div>

      {/* Brand Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
          <Filter className="h-3 w-3" />
          <span>Brand:</span>
        </div>
        <button
          type="button"
          onClick={() => setSelectedBrand("")}
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
            !selectedBrand
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          All
        </button>
        {companies.map((company) => (
          <button
            key={company.id}
            type="button"
            onClick={() => setSelectedBrand(company.slug)}
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
              selectedBrand === company.slug
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {company.name}
          </button>
        ))}
      </div>

      {filteredModels.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            {search
              ? `No vehicle models found matching "${search}".`
              : "No models found for the selected brand filter."}
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
                    <img
                      src={group.company.logo_url}
                      alt={group.company.name}
                      className="h-5 w-5 object-contain"
                      loading="lazy"
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
                {group.models.map((model) => (
                  <Link
                    key={model.id}
                    href={`/spare-parts?brand=${group.company.slug || ""}&model=${model.slug}`}
                    className="group block"
                  >
                    <Card className="h-full overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
                      <CardContent className="p-3.5 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex items-center gap-1.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted/70 text-primary shrink-0 overflow-hidden border border-border/50">
                            {group.company.logo_url ? (
                              <img
                                src={group.company.logo_url}
                                alt={group.company.name}
                                className="h-4 w-4 object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <Car className="h-3.5 w-3.5 text-primary" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                              {model.name}
                            </h3>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {model.part_count ?? 0}{" "}
                              {(model.part_count ?? 0) === 1 ? "product" : "products"}
                            </p>
                          </div>
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
