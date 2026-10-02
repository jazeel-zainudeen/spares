import { getCategories } from "@/lib/services/categories"
import { Layers } from "lucide-react"
import { CategoriesGridClient } from "@/components/public/CategoriesGridClient"

export const metadata = {
  title: "Categories - AutoPartsPro Catalog",
  description: "Browse spare parts organized by component category",
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Layers className="h-3.5 w-3.5" />
          <span>Part Classifications</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Browse Categories
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Explore auto components, air conditioning units, engine parts, and replacement accessories.
        </p>
      </div>

      <CategoriesGridClient categories={categories} />
    </div>
  )
}
