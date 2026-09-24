"use client"

import { useState } from "react"
import { PartRow } from "@/lib/services/parts"
import { CategoryRow } from "@/lib/services/categories"
import { CompanyRow } from "@/lib/services/companies"
import { ModelRow } from "@/lib/services/models"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Spare Parts</h1>
          <p className="text-sm text-muted-foreground">Manage catalog items, reference numbers, and specs</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Part
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div>
              <CardTitle>Catalog Inventory</CardTitle>
              <CardDescription>Total {parts.length} spare parts registered in the database</CardDescription>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search item, ref, OEM..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select
                options={[{ label: "All Categories", value: "" }, ...categoryOptions]}
                value={categoryFilter}
                onChange={(e) => handleCategoryFilterChange(e.target.value)}
                placeholder="All Categories"
              />
              <Select
                options={[{ label: "All Companies", value: "" }, ...companyOptions]}
                value={companyFilter}
                onChange={(e) => handleCompanyFilterChange(e.target.value)}
                placeholder="All Companies"
              />
              <Select
                options={[{ label: "All Models", value: "" }, ...modelOptions]}
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                disabled={!companyFilter && availableModelsForFilter.length > 50}
                placeholder="All Models"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredParts.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {(search || companyFilter || modelFilter || categoryFilter) ? "No parts found matching your filters." : "No parts added yet."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Ref #</TableHead>
                  <TableHead>OEM #</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Model / Brand</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParts.map(part => (
                  <TableRow key={part.id}>
                    <TableCell>
                      {part.image_url ? (
                        <div className="flex h-10 w-12 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={part.image_url} alt={part.item} className="h-full w-full object-contain" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-12 items-center justify-center rounded-md border border-border bg-muted/30">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{part.item}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{part.ref_number}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{part.oem_number || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{part.categories?.name || "—"}</TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-foreground">{part.car_models?.name || "Unknown"}</div>
                      <div className="text-[11px] text-muted-foreground">{part.car_models?.car_companies?.name || ""}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(part)}
                          aria-label="Edit part"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(part)}
                          aria-label="Delete part"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
