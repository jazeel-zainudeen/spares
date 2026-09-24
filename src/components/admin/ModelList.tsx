"use client"

import { useState } from "react"
import { ModelRow } from "@/lib/services/models"
import { CompanyRow } from "@/lib/services/companies"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Search, Plus, Edit, Trash2, Car } from "lucide-react"
import { ModelFormModal } from "./ModelFormModal"
import { DeleteModelModal } from "./DeleteModelModal"
import { createModelAction, updateModelAction, deleteModelAction } from "@/app/actions/models"

import { Pagination } from "@/components/ui/Pagination"

const PAGE_SIZE = 10

export function ModelList({ initialModels, companies }: { initialModels: any[], companies: CompanyRow[] }) {
  const [models, setModels] = useState<any[]>(initialModels)
  const [search, setSearch] = useState("")
  const [companyFilter, setCompanyFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

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

  const totalPages = Math.ceil(filteredModels.length / PAGE_SIZE)
  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  const handleCompanyFilterChange = (val: string) => {
    setCompanyFilter(val)
    setCurrentPage(1)
  }

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Models</h1>
          <p className="text-sm text-muted-foreground">Manage vehicle models associated with car manufacturers</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Model
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Models</CardTitle>
              <CardDescription>Total {models.length} car models registered</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="w-full sm:w-56">
                <Select
                  options={[{ label: "All Companies", value: "" }, ...companyOptions]}
                  value={companyFilter}
                  onChange={(e) => handleCompanyFilterChange(e.target.value)}
                  placeholder="Filter by company"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredModels.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {(search || companyFilter) ? "No models found matching your filters." : "No models added yet."}
            </div>
          ) : (
            <>
              {/* Mobile View: Cards */}
              <div className="grid grid-cols-1 gap-3 sm:hidden">
                {paginatedModels.map(model => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 text-primary">
                        <Car className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground truncate">{model.name}</div>
                        <div className="text-xs text-primary font-medium truncate">{model.car_companies?.name || "Unknown"}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{model.slug}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleEdit(model)}
                        aria-label="Edit model"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(model)}
                        aria-label="Delete model"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Full Table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedModels.map(model => (
                      <TableRow key={model.id}>
                        <TableCell className="font-medium">{model.name}</TableCell>
                        <TableCell className="text-muted-foreground">{model.slug}</TableCell>
                        <TableCell>{model.car_companies?.name || "Unknown"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleEdit(model)}
                              aria-label="Edit model"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleDelete(model)}
                              aria-label="Delete model"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredModels.length}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </CardContent>
      </Card>

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
