"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Layers, ChevronRight } from "lucide-react"
import { InlineSearchInput } from "@/components/public/InlineSearchInput"

interface CategoryItem {
  id: string
  name: string
  slug: string
  image_url?: string | null
  part_count?: number
}

export function CategoriesGridClient({
  categories,
}: {
  categories: CategoryItem[]
}) {
  const [search, setSearch] = useState("")

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return categories
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    )
  }, [categories, search])

  return (
    <div className="space-y-6">
      {/* Search and counter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <InlineSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search categories..."
          />
        </div>
        <Badge variant="secondary" className="self-start sm:self-auto text-xs font-normal px-3 py-1">
          {filteredCategories.length}{" "}
          {filteredCategories.length === 1 ? "category" : "categories"}
          {search && ` matching "${search}"`}
        </Badge>
      </div>

      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No categories found matching &quot;{search}&quot;.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/spare-parts?category=${category.slug}`}
              className="group block"
            >
              <Card className="h-full overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
                <div className="aspect-4/3 bg-muted/40 relative flex items-center justify-center p-3 border-b border-border/60">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
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
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {category.part_count ?? 0}{" "}
                      {(category.part_count ?? 0) === 1 ? "product" : "products"}
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
