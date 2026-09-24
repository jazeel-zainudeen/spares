import Link from "next/link"
import { getCompaniesWithStats } from "@/lib/services/companies"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Building2, ChevronRight, Car } from "lucide-react"

export const metadata = {
  title: "Brands - AutoPartsPro Catalog",
  description: "Browse spare parts by car manufacturer and brand",
}

export default async function BrandsPage() {
  const brands = await getCompaniesWithStats()

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Building2 className="h-3.5 w-3.5" />
          <span>Car Manufacturers</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Browse by Brand
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Select a car manufacturer to explore available spare parts and compatible models.
        </p>
      </div>

      {/* Stats summary */}
      <div className="flex items-center gap-3 mb-6">
        <Badge variant="secondary" className="text-xs font-normal px-3 py-1">
          {brands.length} {brands.length === 1 ? "brand" : "brands"} available
        </Badge>
      </div>

      {brands.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No brands available yet. Run the scraper to populate data.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {brands.map((brand: any) => (
            <Link
              key={brand.id}
              href={`/spare-parts?brand=${brand.slug}`}
              className="group block"
            >
              <Card className="h-full overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-md">
                <div className="aspect-square bg-muted/30 relative flex items-center justify-center p-6 border-b border-border/60">
                  {brand.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
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
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Car className="h-3 w-3" />
                      <span>{brand.model_count} {brand.model_count === 1 ? "model" : "models"}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
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
