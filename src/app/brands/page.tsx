import { getCompaniesWithStats } from "@/lib/services/companies"
import { Building2 } from "lucide-react"
import { BrandsGridClient } from "@/components/public/BrandsGridClient"

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

      <BrandsGridClient brands={brands} />
    </div>
  )
}
