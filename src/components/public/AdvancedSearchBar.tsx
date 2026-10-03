"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { MultiSelect } from "@/components/ui/MultiSelect"
import { Button } from "@/components/ui/Button"
import { fetchCategoriesAction } from "@/app/actions/categories"
import { fetchCompaniesAction } from "@/app/actions/companies"
import { fetchModelsAction } from "@/app/actions/models"

export function AdvancedSearchBar({
  initialCategories = [],
  initialCompanies = [],
}: {
  initialCategories?: any[]
  initialCompanies?: any[]
}) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string[]>([])
  const [company, setCompany] = useState<string[]>([])
  const [model, setModel] = useState<string[]>([])

  const [categories, setCategories] = useState<any[]>(initialCategories)
  const [companies, setCompanies] = useState<any[]>(initialCompanies)
  const [models, setModels] = useState<any[]>([])
  const [loadingModels, setLoadingModels] = useState(false)

  const router = useRouter()

  // If initial props are not passed (e.g. standalone usage), fetch them once
  useEffect(() => {
    if (initialCategories.length === 0 || initialCompanies.length === 0) {
      Promise.all([
        fetchCategoriesAction(),
        fetchCompaniesAction()
      ]).then(([catRes, compRes]) => {
        if (catRes.data) setCategories(catRes.data)
        if (compRes.data) setCompanies(compRes.data)
      }).catch(console.error)
    }
  }, [initialCategories.length, initialCompanies.length])

  // Load models on-demand
  useEffect(() => {
    setLoadingModels(true)
    fetchModelsAction(undefined)
      .then((res) => {
        if (res.data) setModels(res.data)
      })
      .catch(console.error)
      .finally(() => setLoadingModels(false))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (query.trim()) params.append('search', query.trim())
    if (category.length > 0) params.append('category', category.join(','))
    if (company.length > 0) params.append('brand', company.join(','))
    if (model.length > 0) params.append('model', model.join(','))

    const queryString = params.toString()
    router.push(`/spare-parts${queryString ? `?${queryString}` : ""}`)
  }

  // Filter models based on selected company
  const availableModels = company.length > 0
    ? models.filter(m => {
        const compSlug = m.car_companies?.slug || m.company_id
        return compSlug && company.includes(compSlug)
      })
    : models

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        {/* Main Search Input */}
        <div className="flex w-full items-center gap-2 rounded-2xl border border-border/80 bg-card p-1.5 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <input
              type="text"
              placeholder="Search by part name, ref number, OEM code..."
              className="h-11 w-full rounded-xl bg-transparent pl-10 pr-3 text-sm text-foreground outline-hidden placeholder:text-muted-foreground/70"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="h-11 px-6 font-semibold shadow-xs"
          >
            Search Parts
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <MultiSelect
            value={category}
            onChange={setCategory}
            options={[
              ...categories.map(c => ({
                label: c.name,
                value: c.slug,
                count: c.part_count ?? 0
              }))
            ]}
            placeholder="All Categories"
          />

          <MultiSelect
            value={company}
            onChange={(val) => {
              setCompany(val)
              // Filter out models that don't belong to the selected brands
              if (val.length > 0) {
                const validModels = model.filter(mSlug => {
                  const mod = models.find(m => m.slug === mSlug)
                  const compSlug = mod?.car_companies?.slug || mod?.company_id
                  return compSlug && val.includes(compSlug)
                })
                setModel(validModels)
              }
            }}
            options={[
              ...companies.map(c => ({
                label: c.name,
                value: c.slug,
                count: c.part_count ?? 0
              }))
            ]}
            placeholder="All Brands"
          />

          <MultiSelect
            value={model}
            onChange={(val) => {
              setModel(val)
              // Auto-select brand if not already selected
              let newCompanies = [...company]
              val.forEach(mSlug => {
                const mod = models.find(m => m.slug === mSlug)
                const compSlug = mod?.car_companies?.slug || mod?.company_id
                if (compSlug && !newCompanies.includes(compSlug)) {
                  newCompanies.push(compSlug)
                }
              })
              if (newCompanies.length !== company.length) {
                setCompany(newCompanies)
              }
            }}
            disabled={loadingModels}
            options={[
              ...availableModels.map(m => ({
                label: m.name,
                value: m.slug,
                count: m.part_count ?? 0,
                group: m.car_companies?.name || "Other"
              }))
            ]}
            placeholder={loadingModels ? "Loading models..." : "All Models"}
          />
        </div>
      </form>
    </div>
  )
}
