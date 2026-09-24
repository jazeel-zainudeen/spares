import Link from "next/link"
import { getCategories } from "@/lib/services/categories"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Layers, ChevronRight, Image as ImageIcon } from "lucide-react"

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

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No categories available yet. Please check back later.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/spare-parts/${category.slug}`}
              className="group block"
            >
              <Card className="h-full overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
                <div className="aspect-4/3 bg-muted/40 relative flex items-center justify-center p-3 border-b border-border/60">
                  {category.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Layers className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <CardContent className="p-3.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">
                      /{category.slug}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/60 shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
