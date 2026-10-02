import { getModelsWithCompany } from "@/lib/services/models"
import { getCompanies } from "@/lib/services/companies"
import { Car } from "lucide-react"
import { ModelsGridClient } from "@/components/public/ModelsGridClient"

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

      <ModelsGridClient
        models={models}
        companies={companies}
        initialBrandFilter={brandFilter}
      />
    </div>
  )
}
