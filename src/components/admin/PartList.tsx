"use client"

import { useState, useMemo, useDeferredValue } from "react"
import Image from "next/image"
import Link from "next/link"
import type { PartRow } from "@/lib/services/parts"
import { getPartImages } from "@/lib/utils/images"
import type { CategoryRow } from "@/lib/services/categories"
import type { CompanyRow } from "@/lib/services/companies"
import type { ModelRow } from "@/lib/services/models"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Search, Plus, Edit, Trash2, Image as ImageIcon, ArrowUpDown, ExternalLink } from "lucide-react"
import { PartFormModal } from "./PartFormModal"
import { DeletePartModal } from "./DeletePartModal"
import { SortableHeader } from "./SortableHeader"
import { createPartAction, updatePartAction, deletePartAction } from "@/app/actions/parts"
import { Pagination } from "@/components/ui/Pagination"
import { formatDate, formatDateTime } from "@/lib/utils"
import { HighlightText } from "@/components/ui/HighlightText"

const PAGE_SIZE = 10

type SortField = "item" | "ref_number" | "oem_number" | "category" | "model" | "created_at"
type SortOrder = "asc" | "desc"

export function PartList({ initialParts, categories, companies, models }: { initialParts: any[], categories: CategoryRow[], companies: CompanyRow[], models: ModelRow[] }) {
  const [parts, setParts] = useState<any[]>(initialParts)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [companyFilter, setCompanyFilter] = useState("")
  const [modelFilter, setModelFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortField>("created_at")
  const [sortDirection, setSortDirection] = useState<SortOrder>("desc")

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingPart, setEditingPart] = useState<PartRow | null>(null)
  const [deletingPart, setDeletingPart] = useState<PartRow | null>(null)

  const handleSort = (column: string) => {
    const col = column as SortField
    if (sortColumn === col) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortColumn(col)
      setSortDirection("asc")
    }
    setCurrentPage(1)
  }

  const deferredSearch = useDeferredValue(search)

  const filteredParts = useMemo(() => parts.filter(p => {
    const searchString = `${p.item} ${p.ref_number} ${p.oem_number || ''}`.toLowerCase()
    const matchesSearch = searchString.includes(deferredSearch.toLowerCase())

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
  }), [parts, deferredSearch, categoryFilter, companyFilter, modelFilter, companies])

  const sortedParts = useMemo(() => [...filteredParts].sort((a, b) => {
    let result = 0
    if (sortColumn === "item") {
      result = (a.item || "").localeCompare(b.item || "")
    } else if (sortColumn === "ref_number") {
      result = (a.ref_number || "").localeCompare(b.ref_number || "")
    } else if (sortColumn === "oem_number") {
      result = (a.oem_number || "").localeCompare(b.oem_number || "")
    } else if (sortColumn === "category") {
      const catA = a.categories?.name || ""
      const catB = b.categories?.name || ""
      result = catA.localeCompare(catB)
    } else if (sortColumn === "model") {
      const modA = `${a.car_models?.car_companies?.name || ''} ${a.car_models?.name || ''}`
      const modB = `${b.car_models?.car_companies?.name || ''} ${b.car_models?.name || ''}`
      result = modA.localeCompare(modB)
    } else if (sortColumn === "created_at") {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
      result = timeA - timeB
    }
    return sortDirection === "asc" ? result : -result
  }), [filteredParts, sortColumn, sortDirection])

  const totalPages = Math.ceil(sortedParts.length / PAGE_SIZE)
  const paginatedParts = useMemo(() => sortedParts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  ), [sortedParts, currentPage])

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  const handleCompanyFilterChange = (val: string) => {
    setCompanyFilter(val)
    setModelFilter("") // reset model filter
    setCurrentPage(1)
  }

  const handleCategoryFilterChange = (val: string) => {
    setCategoryFilter(val)
    setCurrentPage(1)
  }

  const handleModelFilterChange = (val: string) => {
    setModelFilter(val)
    setCurrentPage(1)
  }

  const availableModelsForFilter = useMemo(() => models.filter(m => companyFilter ? m.company_id === companyFilter : true), [models, companyFilter])

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

  const onConfirmDelete = async (id: string, publicId?: string | string[] | null) => {
    const res = await deletePartAction(id, publicId)
    if (res.error) throw new Error(res.error)
    setParts(parts.filter(p => p.id !== id))
  }

  const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }))
  const companyOptions = companies.map(c => ({ label: c.name, value: c.id }))
  const modelOptions = availableModelsForFilter.map(m => ({ label: m.name, value: m.id }))

  const sortLabel = sortColumn === "created_at"
    ? "Created Time"
    : sortColumn === "ref_number"
    ? "Ref #"
    : sortColumn === "oem_number"
    ? "OEM #"
    : sortColumn.charAt(0).toUpperCase() + sortColumn.slice(1)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Spare Parts</h1>
          <p className="text-sm text-muted-foreground">Manage catalog items, reference numbers, and specs</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 ml-auto sm:ml-0 sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Part
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div>
              <CardTitle>Catalog Inventory</CardTitle>
              <CardDescription className="mt-1">Total {parts.length} spare parts registered in the database</CardDescription>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search item, ref, OEM..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
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
                onChange={(e) => handleModelFilterChange(e.target.value)}
                placeholder="All Models"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedParts.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {(search || companyFilter || modelFilter || categoryFilter) ? "No parts found matching your filters." : "No parts added yet."}
            </div>
          ) : (
            <>
              {/* Mobile View: Cards */}
              <div className="grid grid-cols-1 gap-3 sm:hidden">
                {paginatedParts.map(part => {
                  const images = getPartImages(part)
                  const mainImage = images[0]
                  return (
                    <div
                      key={part.id}
                      className="flex flex-col gap-2.5 rounded-xl border border-border/80 bg-card p-3 shadow-2xs transition-all"
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-3 min-w-0">
                          {mainImage ? (
                            <div className="relative flex h-14 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-muted/40 p-1">
                              <Image 
                                src={mainImage} 
                                alt={part.item || "Part image"} 
                                fill
                                sizes="(max-width: 768px) 64px, 64px"
                                className="object-contain p-1" 
                                loading="lazy" 
                              />
                              {images.length > 1 && (
                                <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-[9px] font-semibold text-white px-1 rounded-sm">
                                  +{images.length - 1}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/30">
                              <ImageIcon className="h-5 w-5 text-muted-foreground/60" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm text-foreground">
                              {part.categories?.slug && part.car_models?.car_companies?.slug && part.car_models?.slug ? (
                                <Link href={`/spare-parts/${part.categories.slug}/${part.car_models.car_companies.slug}/${part.car_models.slug}/${part.id}`} target="_blank" className="group flex items-center gap-1.5 hover:text-primary transition-colors max-w-full">
                                  <span className="group-hover:underline truncate block min-w-0"><HighlightText text={part.item} highlight={deferredSearch} /></span>
                                  <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                </Link>
                              ) : (
                                <div className="truncate block"><HighlightText text={part.item} highlight={deferredSearch} /></div>
                              )}
                            </div>
                            <div className="text-xs text-primary font-medium truncate mt-0.5">
                              {part.car_models?.car_companies?.name} {part.car_models?.name}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              {part.categories?.name || "Uncategorized"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleEdit(part)}
                            aria-label="Edit part"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(part)}
                            aria-label="Delete part"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-border/60 text-[11px] font-mono text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-md bg-muted/70 px-2 py-0.5 font-medium text-foreground/80">
                            REF: <HighlightText text={part.ref_number || ""} highlight={deferredSearch} />
                          </span>
                          {part.oem_number && (
                            <span className="rounded-md bg-muted/70 px-2 py-0.5 font-medium text-foreground/80">
                              OEM: <HighlightText text={part.oem_number} highlight={deferredSearch} />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground/80">
                          {formatDateTime(part.created_at)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desktop View: Full Table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-px whitespace-nowrap text-center">Image</TableHead>
                      <SortableHeader
                        label="Item"
                        columnKey="item"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                        className="w-full"
                      />
                      <SortableHeader
                        label="Ref #"
                        columnKey="ref_number"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                        align="center"
                        className="w-px whitespace-nowrap"
                      />
                      <SortableHeader
                        label="OEM #"
                        columnKey="oem_number"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                        align="center"
                        className="w-px whitespace-nowrap"
                      />
                      <SortableHeader
                        label="Category"
                        columnKey="category"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                        align="center"
                        className="w-px whitespace-nowrap"
                      />
                      <SortableHeader
                        label="Model / Brand"
                        columnKey="model"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                        align="center"
                        className="w-px whitespace-nowrap"
                      />
                      <SortableHeader
                        label="Created At"
                        columnKey="created_at"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                        align="center"
                        className="w-px whitespace-nowrap"
                      />
                      <TableHead className="w-px whitespace-nowrap text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedParts.map(part => {
                      const images = getPartImages(part)
                      const mainImage = images[0]
                      return (
                        <TableRow key={part.id}>
                          <TableCell className="text-center">
                            {mainImage ? (
                              <div className="mx-auto relative flex h-10 w-12 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
                                <Image 
                                  src={mainImage} 
                                  alt={part.item || "Part image"} 
                                  fill
                                  sizes="48px"
                                  className="object-contain p-1" 
                                  loading="lazy" 
                                />
                                {images.length > 1 && (
                                  <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] font-bold text-white px-0.5 rounded-tl-sm">
                                    +{images.length - 1}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="mx-auto flex h-10 w-12 items-center justify-center rounded-md border border-border bg-muted/30">
                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium text-foreground max-w-0 w-full">
                            {part.categories?.slug && part.car_models?.car_companies?.slug && part.car_models?.slug ? (
                              <Link href={`/spare-parts/${part.categories.slug}/${part.car_models.car_companies.slug}/${part.car_models.slug}/${part.id}`} target="_blank" className="group flex items-center gap-1.5 hover:text-primary transition-colors">
                                <span className="group-hover:underline truncate block min-w-0"><HighlightText text={part.item} highlight={deferredSearch} /></span>
                                <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                              </Link>
                            ) : (
                              <div className="truncate block"><HighlightText text={part.item} highlight={deferredSearch} /></div>
                            )}
                          </TableCell>
                          <TableCell className="text-center font-mono text-xs text-muted-foreground break-all"><HighlightText text={part.ref_number || ""} highlight={deferredSearch} /></TableCell>
                          <TableCell className="text-center font-mono text-xs text-muted-foreground break-all">{part.oem_number ? <HighlightText text={part.oem_number} highlight={deferredSearch} /> : "—"}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{part.categories?.name || "—"}</TableCell>
                          <TableCell className="text-center">
                            <div className="text-xs font-medium text-foreground">{part.car_models?.name || "Unknown"}</div>
                            <div className="text-[11px] text-muted-foreground">{part.car_models?.car_companies?.name || ""}</div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-center text-xs text-muted-foreground font-mono">
                            {formatDateTime(part.created_at)}
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
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={sortedParts.length}
                pageSize={PAGE_SIZE}
              />
            </>
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
