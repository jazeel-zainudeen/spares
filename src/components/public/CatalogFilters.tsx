"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { MultiSelect } from "@/components/ui/MultiSelect"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Layers, Building2, Car, Filter, RotateCcw, X } from "lucide-react"

interface CatalogFiltersProps {
  categories: Array<{ id: string; name: string; slug: string; part_count?: number }>
  companies: Array<{ id: string; name: string; slug: string; part_count?: number }>
  models: Array<{ id: string; name: string; slug: string; company_id?: string; car_companies?: { slug?: string; name?: string }; part_count?: number }>
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

  const parseSlugs = (val?: string) => (val ? val.split(',').map(s => s.trim()).filter(Boolean) : [])

  const [selectedCategories, setSelectedCategories] = useState<string[]>(parseSlugs(activeCategory))
  const [selectedBrands, setSelectedBrands] = useState<string[]>(parseSlugs(activeBrand))
  const [selectedModels, setSelectedModels] = useState<string[]>(parseSlugs(activeModel))

  useEffect(() => {
    setSelectedCategories(parseSlugs(activeCategory))
    setSelectedBrands(parseSlugs(activeBrand))
    setSelectedModels(parseSlugs(activeModel))
  }, [activeCategory, activeBrand, activeModel])

  const updateFilters = (newCategories?: string[], newBrands?: string[], newModels?: string[]) => {
    const params = new URLSearchParams(searchParams.toString())

    const cats = newCategories !== undefined ? newCategories : selectedCategories
    const brands = newBrands !== undefined ? newBrands : selectedBrands
    const mods = newModels !== undefined ? newModels : selectedModels

    if (cats.length > 0) params.set("category", cats.join(','))
    else params.delete("category")

    if (brands.length > 0) params.set("brand", brands.join(','))
    else params.delete("brand")

    if (mods.length > 0) params.set("model", mods.join(','))
    else params.delete("model")

    // Reset page to 1 on filter change
    params.delete("page")

    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ""}`)
  }

  const handleCategoryChange = (slugs: string[]) => {
    setSelectedCategories(slugs)
    updateFilters(slugs, selectedBrands, selectedModels)
  }

  const handleBrandChange = (slugs: string[]) => {
    setSelectedBrands(slugs)
    // Filter out models that don't belong to any of the selected brands if brands are selected
    let validModels = selectedModels
    if (slugs.length > 0) {
      validModels = selectedModels.filter(mSlug => {
        const mod = models.find(m => m.slug === mSlug)
        if (!mod) return false
        const compSlug = mod.car_companies?.slug || companies.find(c => c.id === mod.company_id)?.slug
        return compSlug && slugs.includes(compSlug)
      })
      setSelectedModels(validModels)
    }
    updateFilters(selectedCategories, slugs, validModels)
  }

  const handleModelChange = (slugs: string[]) => {
    setSelectedModels(slugs)
    // Auto fill brands
    let newBrands = [...selectedBrands]
    slugs.forEach(mSlug => {
      const mod = models.find(m => m.slug === mSlug)
      const compSlug = mod?.car_companies?.slug || companies.find(c => c.id === mod?.company_id)?.slug
      if (compSlug && !newBrands.includes(compSlug)) {
        newBrands.push(compSlug)
      }
    })
    setSelectedBrands(newBrands)
    updateFilters(selectedCategories, newBrands, slugs)
  }

  const removeCategory = (slug: string) => {
    const next = selectedCategories.filter(s => s !== slug)
    handleCategoryChange(next)
  }

  const removeBrand = (slug: string) => {
    const next = selectedBrands.filter(s => s !== slug)
    handleBrandChange(next)
  }

  const removeModel = (slug: string) => {
    const next = selectedModels.filter(s => s !== slug)
    handleModelChange(next)
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedModels([])
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`)
  }

  // Filter available models based on selected brands
  const filteredModels = selectedBrands.length > 0
    ? models.filter((m) => {
        const companySlug = m.car_companies?.slug || companies.find((c) => c.id === m.company_id)?.slug
        return companySlug && selectedBrands.includes(companySlug)
      })
    : models

  const totalActiveFiltersCount = selectedCategories.length + selectedBrands.length + selectedModels.length

  return (
    <div className="space-y-4">
      {/* Active Filter Chips */}
      {totalActiveFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/60">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
            <Filter className="h-3.5 w-3.5 text-primary" />
            Active ({totalActiveFiltersCount}):
          </span>

          {selectedCategories.map(catSlug => {
            const catObj = categories.find(c => c.slug === catSlug)
            return (
              <Badge key={`cat-${catSlug}`} variant="outline" className="text-xs gap-1 py-1 pl-2.5 pr-1.5 bg-background">
                <span>Cat: <strong>{catObj?.name || catSlug}</strong></span>
                <button
                  onClick={() => removeCategory(catSlug)}
                  className="hover:bg-muted p-0.5 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${catObj?.name || catSlug} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}

          {selectedBrands.map(brandSlug => {
            const brandObj = companies.find(c => c.slug === brandSlug)
            return (
              <Badge key={`brand-${brandSlug}`} variant="outline" className="text-xs gap-1 py-1 pl-2.5 pr-1.5 bg-background">
                <span>Brand: <strong>{brandObj?.name || brandSlug}</strong></span>
                <button
                  onClick={() => removeBrand(brandSlug)}
                  className="hover:bg-muted p-0.5 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${brandObj?.name || brandSlug} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}

          {selectedModels.map(modelSlug => {
            const modelObj = models.find(m => m.slug === modelSlug)
            return (
              <Badge key={`model-${modelSlug}`} variant="outline" className="text-xs gap-1 py-1 pl-2.5 pr-1.5 bg-background">
                <span>Model: <strong>{modelObj?.name || modelSlug}</strong></span>
                <button
                  onClick={() => removeModel(modelSlug)}
                  className="hover:bg-muted p-0.5 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${modelObj?.name || modelSlug} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2 ml-auto shrink-0"
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
            {totalActiveFiltersCount > 0 && (
              <span className="text-xs text-primary font-medium">{totalActiveFiltersCount} selected</span>
            )}
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Category MultiSelect */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>Categories</span>
              </label>
              <MultiSelect
                value={selectedCategories}
                onChange={handleCategoryChange}
                options={categories.map((c) => ({
                  label: c.name,
                  value: c.slug,
                  count: c.part_count ?? 0
                }))}
                placeholder="Select Categories"
              />
            </div>

            {/* Brand MultiSelect */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>Brands / Manufacturers</span>
              </label>
              <MultiSelect
                value={selectedBrands}
                onChange={handleBrandChange}
                options={companies.map((c) => ({
                  label: c.name,
                  value: c.slug,
                  count: c.part_count ?? 0
                }))}
                placeholder="Select Brands"
              />
            </div>

            {/* Model MultiSelect */}
            <div className="space-y-1.5">
              <label className="font-medium text-foreground flex items-center gap-1.5">
                <Car className="h-3.5 w-3.5 text-primary" />
                <span>Vehicle Models</span>
              </label>
              <MultiSelect
                value={selectedModels}
                onChange={handleModelChange}
                options={filteredModels.map((m) => ({
                  label: m.name,
                  value: m.slug,
                  count: m.part_count ?? 0,
                  group: m.car_companies?.name || "Other"
                }))}
                placeholder="Select Models"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
