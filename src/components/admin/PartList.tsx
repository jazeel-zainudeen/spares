"use client"

import { useState } from "react"
import { PartRow } from "@/lib/services/parts"
import { CategoryRow } from "@/lib/services/categories"
import { CompanyRow } from "@/lib/services/companies"
import { ModelRow } from "@/lib/services/models"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Search, Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import { PartFormModal } from "./PartFormModal"
import { DeletePartModal } from "./DeletePartModal"
import { createPartAction, updatePartAction, deletePartAction } from "@/app/actions/parts"

export function PartList({ initialParts, categories, companies, models }: { initialParts: any[], categories: CategoryRow[], companies: CompanyRow[], models: ModelRow[] }) {
  const [parts, setParts] = useState<any[]>(initialParts)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [companyFilter, setCompanyFilter] = useState("")
  const [modelFilter, setModelFilter] = useState("")
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingPart, setEditingPart] = useState<PartRow | null>(null)
  const [deletingPart, setDeletingPart] = useState<PartRow | null>(null)

  const filteredParts = parts.filter(p => {
    const searchString = `${p.item} ${p.ref_number} ${p.oem_number || ''}`.toLowerCase()
    const matchesSearch = searchString.includes(search.toLowerCase())
    
    let matchesCategory = true
    if (categoryFilter) {
      matchesCategory = p.categories?.id === categoryFilter
    }

    let matchesCompany = true
    if (companyFilter) {
      matchesCompany = p.car_models?.car_companies?.name === companies.find(c => c.id === companyFilter)?.name
    }
    
    const matchesModel = modelFilter ? p.model_id === modelFilter : true
    
    return matchesSearch && matchesCategory && matchesCompany && matchesModel
  })

  const availableModelsForFilter = models.filter(m => companyFilter ? m.company_id === companyFilter : true)

  const handleAdd = () => {
    setEditingPart(null)
    setIsFormOpen(true)
  }

  const handleEdit = (part: PartRow) => {
    setEditingPart(part)
    setIsFormOpen(true)
  }

  const handleDelete = (part: PartRow) => {
    setDeletingPart(part)
    setIsDeleteOpen(true)
  }

  const onSavePart = async (data: any) => {
    if (editingPart) {
      const res = await updatePartAction(editingPart.id, data)
      if (res.error) throw new Error(res.error)
      window.location.reload()
    } else {
      const res = await createPartAction(data)
      if (res.error) throw new Error(res.error)
      window.location.reload()
    }
  }

  const onConfirmDelete = async (id: string, publicId?: string | null) => {
    const res = await deletePartAction(id, publicId)
    if (res.error) throw new Error(res.error)
    setParts(parts.filter(p => p.id !== id))
  }

  const handleCompanyFilterChange = (val: string) => {
    setCompanyFilter(val)
    setModelFilter("") // reset model filter
  }

  const handleCategoryFilterChange = (val: string) => {
    setCategoryFilter(val)
  }

  const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }))
  const companyOptions = companies.map(c => ({ label: c.name, value: c.id }))
  const modelOptions = availableModelsForFilter.map(m => ({ label: m.name, value: m.id }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Parts</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Part
        </Button>
      </div>

      <div className="glass p-6 rounded-3xl">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ref, OEM, or item..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={[{ label: "All Categories", value: "" }, ...categoryOptions]}
              value={categoryFilter}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={[{ label: "All Companies", value: "" }, ...companyOptions]}
              value={companyFilter}
              onChange={(e) => handleCompanyFilterChange(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={[{ label: "All Models", value: "" }, ...modelOptions]}
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              disabled={!companyFilter && availableModelsForFilter.length > 50} 
              // Optimization: don't show huge model list if no company selected
            />
          </div>
        </div>

        {filteredParts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {(search || companyFilter || modelFilter) ? "No parts found matching your filters." : "No parts added yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Item</th>
                  <th>Ref #</th>
                  <th>OEM #</th>
                  <th>Category</th>
                  <th>Model / Company</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParts.map(part => (
                  <tr key={part.id}>
                    <td data-label="Image">
                      {part.image_url ? (
                        <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                          <img src={part.image_url} alt={part.item} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="font-medium" data-label="Item">{part.item}</td>
                    <td className="text-muted-foreground" data-label="Ref #">{part.ref_number}</td>
                    <td className="text-muted-foreground" data-label="OEM #">{part.oem_number || '-'}</td>
                    <td className="text-muted-foreground" data-label="Category">{part.categories?.name || '-'}</td>
                    <td data-label="Model / Company">
                      <div className="text-sm">{part.car_models?.name || 'Unknown'}</div>
                      <div className="text-xs text-muted-foreground">{part.car_models?.car_companies?.name || ''}</div>
                    </td>
                    <td className="text-right" data-label="Actions">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-blue-600" onClick={() => handleEdit(part)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(part)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      <PartFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={onSavePart}
        initialData={editingPart}
        categories={categories}
        companies={companies}
        models={models}
      />

      <DeletePartModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onConfirmDelete}
        part={deletingPart}
      />
    </div>
  )
}
