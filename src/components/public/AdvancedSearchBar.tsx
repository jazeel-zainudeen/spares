"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { fetchCategoriesAction } from "@/app/actions/categories"
import { fetchCompaniesAction } from "@/app/actions/companies"
import { fetchModelsAction } from "@/app/actions/models"

export function AdvancedSearchBar() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [company, setCompany] = useState("")
  const [model, setModel] = useState("")

  const [categories, setCategories] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])

  const router = useRouter()

  useEffect(() => {
    async function loadFilters() {
      try {
        const [catRes, compRes, modRes] = await Promise.all([
          fetchCategoriesAction(),
          fetchCompaniesAction(),
          fetchModelsAction()
        ])
        if (catRes.data) setCategories(catRes.data)
        if (compRes.data) setCompanies(compRes.data)
        if (modRes.data) setModels(modRes.data)
      } catch (e) {
        console.error("Failed to load filters", e)
      }
    }
    loadFilters()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    let url = `/spare-parts`
    if (category) {
      url += `/${category}`
    }

    const params = new URLSearchParams()
    if (query.trim()) params.append('search', query.trim())
    if (company) params.append('brand', company)
    if (model) params.append('model', model)

    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    router.push(url)
  }

  // Filter models based on selected company
  const availableModels = company
    ? models.filter(m => m.company_id === company)
    : models

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        {/* Main Search Input */}
        <div className="flex w-full items-center gap-2 rounded-xl border border-border bg-card p-1.5 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by part number, name, or description..."
              className="h-11 w-full rounded-lg bg-transparent pl-11 pr-3 text-sm text-foreground outline-hidden placeholder:text-muted-foreground"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="h-11 px-6 font-medium shadow-xs"
          >
            Search
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[{ label: "All Categories", value: "" }, ...categories.map(c => ({ label: c.name, value: c.slug }))]}
            placeholder="All Categories"
          />

          <Select
            value={company}
            onChange={(e) => {
              setCompany(e.target.value)
              setModel("")
            }}
            options={[{ label: "All Brands", value: "" }, ...companies.map(c => ({ label: c.name, value: c.id }))]}
            placeholder="All Brands"
          />

          <Select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!company}
            options={[{ label: "All Models", value: "" }, ...availableModels.map(m => ({ label: m.name, value: m.slug }))]}
            placeholder="All Models"
          />
        </div>
      </form>
    </div>
  )
}
