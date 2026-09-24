"use client"

import { useState } from "react"
import { ModelRow } from "@/lib/services/models"
import { CompanyRow } from "@/lib/services/companies"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { ModelFormModal } from "./ModelFormModal"
import { DeleteModelModal } from "./DeleteModelModal"
import { createModelAction, updateModelAction, deleteModelAction } from "@/app/actions/models"

export function ModelList({ initialModels, companies }: { initialModels: any[], companies: CompanyRow[] }) {
  const [models, setModels] = useState<any[]>(initialModels)
  const [search, setSearch] = useState("")
  const [companyFilter, setCompanyFilter] = useState("")
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingModel, setEditingModel] = useState<ModelRow | null>(null)
  const [deletingModel, setDeletingModel] = useState<ModelRow | null>(null)

  const filteredModels = models.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.slug.toLowerCase().includes(search.toLowerCase())
    const matchesCompany = companyFilter ? m.company_id === companyFilter : true
    return matchesSearch && matchesCompany
  })

  const handleAdd = () => {
    setEditingModel(null)
    setIsFormOpen(true)
  }

  const handleEdit = (model: ModelRow) => {
    setEditingModel(model)
    setIsFormOpen(true)
  }

  const handleDelete = (model: ModelRow) => {
    setDeletingModel(model)
    setIsDeleteOpen(true)
  }

  const onSaveModel = async (data: any) => {
    if (editingModel) {
      const res = await updateModelAction(editingModel.id, data)
      if (res.error) throw new Error(res.error)
      window.location.reload()
    } else {
      const res = await createModelAction(data)
      if (res.error) throw new Error(res.error)
      window.location.reload()
    }
  }

  const onConfirmDelete = async (id: string) => {
    const res = await deleteModelAction(id)
    if (res.error) throw new Error(res.error)
    setModels(models.filter(m => m.id !== id))
  }

  const companyOptions = companies.map(c => ({
    label: c.name,
    value: c.id
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Models</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </div>

      <div className="glass p-6 rounded-3xl">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search models..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-64">
            <Select
              options={[{ label: "All Companies", value: "" }, ...companyOptions]}
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            />
          </div>
        </div>

        {filteredModels.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {(search || companyFilter) ? "No models found matching your filters." : "No models added yet."}
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Slug</th>
                <th>Company</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.map(model => (
                <tr key={model.id}>
                  <td className="font-medium" data-label="Model Name">{model.name}</td>
                  <td className="text-muted-foreground" data-label="Slug">{model.slug}</td>
                  <td data-label="Company">{model.car_companies?.name || 'Unknown'}</td>
                  <td className="text-right" data-label="Actions">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" className="text-slate-500 hover:text-blue-600" onClick={() => handleEdit(model)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(model)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <ModelFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={onSaveModel}
        initialData={editingModel}
        companies={companies}
      />

      <DeleteModelModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onConfirmDelete}
        model={deletingModel}
      />
    </div>
  )
}
