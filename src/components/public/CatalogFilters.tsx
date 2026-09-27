"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Select } from "@/components/ui/Select"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Layers, Building2, Car, Filter, RotateCcw, X } from "lucide-react"

interface CatalogFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>
  companies: Array<{ id: string; name: string; slug: string }>
  models: Array<{ id: string; name: string; slug: string; company_id?: string; car_companies?: { slug?: string; name?: string } }>
  activeCategory?: string
  activeBrand?: string
  activeModel?: string
  searchQuery?: string
}

export function CatalogFilters({
  categories,
  companies,
  models,
  activeCategory = "",
  activeBrand = "",
  activeModel = "",
  searchQuery = "",
}: CatalogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState(activeCategory)
  const [selectedBrand, setSelectedBrand] = useState(activeBrand)
  const [selectedModel, setSelectedModel] = useState(activeModel)

  useEffect(() => {
    setSelectedCategory(activeCategory)
    setSelectedBrand(activeBrand)
    setSelectedModel(activeModel)
  }, [activeCategory, activeBrand, activeModel])

  const updateFilters = (newCategory?: string, newBrand?: string, newModel?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const cat = newCategory !== undefined ? newCategory : selectedCategory
    const brand = newBrand !== undefined ? newBrand : selectedBrand
    const model = newModel !== undefined ? newModel : selectedModel

    if (cat) params.set("category", cat)
    else params.delete("category")

    if (brand) params.set("brand", brand)
    else params.delete("brand")

    if (model) params.set("model", model)
    else params.delete("model")

    // Reset page to 1 on filter change
    params.delete("page")

    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ""}`)
  }

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val)
    updateFilters(val, selectedBrand, selectedModel)
  }

  const handleBrandChange = (val: string) => {
    setSelectedBrand(val)
    // When brand changes, reset model if it doesn't belong to the brand
    setSelectedModel("")
    updateFilters(selectedCategory, val, "")
  }

  const handleModelChange = (val: string) => {
    setSelectedModel(val)
    updateFilters(selectedCategory, selectedBrand, val)
  }

  const clearAllFilters = () => {
    setSelectedCategory("")
    setSelectedBrand("")
    setSelectedModel("")
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`)
  }

  // Filter available models based on selected brand
  const filteredModels = selectedBrand
    ? models.filter((m) => {
        const companySlug = m.car_companies?.slug || companies.find((c) => c.id === m.company_id)?.slug
        return companySlug === selectedBrand
      })
    : models

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedBrand ? 1 : 0) + (selectedModel ? 1 : 0)

  const selectedCategoryObj = categories.find((c) => c.slug === selectedCategory)
  const selectedBrandObj = companies.find((c) => c.slug === selectedBrand)
  const selectedModelObj = models.find((m) => m.slug === selectedModel)

  return (
    <div className="space-y-4">
      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
            <Filter className="h-3.5 w-3.5 text-primary" />
            Active Filters ({activeFiltersCount}):
          </span>

          {selectedCategoryObj && (
            <Badge variant="outline" className="text-xs gap-1 py-1 pl-2.5 pr-1.5 bg-background">
              <span>Category: <strong>{selectedCategoryObj.name}</strong></span>
              <button
                onClick={() => handleCategoryChange("")}
                className="hover:bg-muted p-0.5 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Remove category filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedBrandObj && (
            <Badge variant="outline" className="text-xs gap-1 py-1 pl-2.5 pr-1.5 bg-background">
              <span>Brand: <strong>{selectedBrandObj.name}</strong></span>
              <button
                onClick={() => handleBrandChange("")}
                className="hover:bg-muted p-0.5 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Remove brand filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedModelObj && (
            <Badge variant="outline" className="text-xs gap-1 py-1 pl-2.5 pr-1.5 bg-background">
              <span>Model: <strong>{selectedModelObj.name}</strong></span>
              <button
                onClick={() => handleModelChange("")}
                className="hover:bg-muted p-0.5 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Remove model filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2 ml-auto"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset All
          </Button>
        </div>
      )}

      {/* Filter Controls Box */}
      <Card className="border-border/80 shadow-xs">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between font-semibold text-sm text-foreground pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <span>Catalog Filters</span>
            </div>
            {activeFiltersCount > 0 && (
              <span className="text-xs text-primary font-medium">{activeFiltersCount} selected</span>
            )}
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>Category</span>
              </label>
              <Select
                options={[
                  { label: "All Categories", value: "" },
                  ...categories.map((c) => ({ label: c.name, value: c.slug })),
                ]}
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                placeholder="Filter by Category"
              />
            </div>

            {/* Brand Select */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>Brand / Manufacturer</span>
              </label>
              <Select
                options={[
                  { label: "All Brands", value: "" },
                  ...companies.map((c) => ({ label: c.name, value: c.slug })),
                ]}
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                placeholder="Filter by Brand"
              />
            </div>

            {/* Model Select */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground flex items-center gap-1.5">
                <Car className="h-3.5 w-3.5 text-primary" />
                <span>Vehicle Model</span>
              </label>
              <Select
                options={[
                  { label: selectedBrand ? `All ${selectedBrandObj?.name || ""} Models` : "All Models", value: "" },
                  ...filteredModels.map((m) => ({ label: m.name, value: m.slug })),
                ]}
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                placeholder="Filter by Model"
              />
            </div>

            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="w-full text-xs gap-1.5 mt-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
