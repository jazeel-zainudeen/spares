"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Select } from "@/components/ui/Select"
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
    
    // Construct search URL
    // If a category is selected, we should probably route there, but a global search is safer.
    // For now, we'll route to /spare-parts (all categories) and pass the filters as query params
    // or if category is selected, route to /spare-parts/[category]
    
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
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        {/* Main Search Input */}
        <div className="flex items-center gap-2 p-2 glass-card rounded-full focus-within:ring-2 focus-within:ring-primary/50 shadow-sm">
          <div className="flex-1 flex items-center px-4 gap-3 text-muted-foreground">
            <Search className="h-6 w-6" />
            <input 
              type="text" 
              placeholder="Search by part number, name, or description..." 
              className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground h-12 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
          <Select 
            className="bg-background/80 backdrop-blur-md border border-border/60 hover:border-slate-300/80 hover:bg-background/90 shadow-sm hover:shadow transition-all duration-300 h-12 px-4 rounded-xl text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[{ label: "All Categories", value: "" }, ...categories.map(c => ({ label: c.name, value: c.slug }))]}
          />

          <Select 
            className="bg-background/80 backdrop-blur-md border border-border/60 hover:border-slate-300/80 hover:bg-background/90 shadow-sm hover:shadow transition-all duration-300 h-12 px-4 rounded-xl text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value)
              setModel("") // Reset model when company changes
            }}
            options={[{ label: "All Brands", value: "" }, ...companies.map(c => ({ label: c.name, value: c.id }))]}
          />

          <Select 
            className="bg-background/80 backdrop-blur-md border border-border/60 hover:border-slate-300/80 hover:bg-background/90 shadow-sm hover:shadow transition-all duration-300 h-12 px-4 rounded-xl text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer disabled:opacity-50"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!company}
            options={[{ label: "All Models", value: "" }, ...availableModels.map(m => ({ label: m.name, value: m.slug }))]}
          />
        </div>
      </form>
    </div>
  )
}
