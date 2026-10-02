"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Building2, ChevronRight, Car } from "lucide-react"
import { InlineSearchInput } from "@/components/public/InlineSearchInput"

interface BrandItem {
  id: string
  name: string
  slug: string
  logo_url?: string | null
  model_count?: number
  part_count?: number
}

export function BrandsGridClient({ brands }: { brands: BrandItem[] }) {
  const [search, setSearch] = useState("")

  const filteredBrands = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return brands
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q)
    )
  }, [brands, search])

  return (
    <div className="space-y-6">
      {/* Search and stats summary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <InlineSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search brands / manufacturers..."
          />
        </div>
        <Badge variant="secondary" className="self-start sm:self-auto text-xs font-normal px-3 py-1">
          {filteredBrands.length}{" "}
          {filteredBrands.length === 1 ? "brand" : "brands"}
          {search ? ` matching "${search}"` : " available"}
        </Badge>
      </div>

      {filteredBrands.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No brands found matching &quot;{search}&quot;.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/spare-parts?brand=${brand.slug}`}
              className="group block"
            >
              <Card className="h-full overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-md">
                <div className="aspect-square bg-muted/30 relative flex items-center justify-center p-6 border-b border-border/60">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 text-primary">
                      <Building2 className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <CardContent className="p-3.5">
                  <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {brand.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                      <Car className="h-3 w-3 shrink-0" />
                      <span>
                        {brand.model_count}{" "}
                        {brand.model_count === 1 ? "model" : "models"} •{" "}
                        {brand.part_count ?? 0}{" "}
                        {(brand.part_count ?? 0) === 1 ? "product" : "products"}
                      </span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
