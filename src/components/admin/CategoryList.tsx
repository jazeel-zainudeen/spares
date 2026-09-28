"use client"

import { useState } from "react"
import type { CategoryRow } from "@/lib/services/categories"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Search, Plus, Edit, Trash2, ArrowUpDown } from "lucide-react"
import { CategoryFormModal } from "./CategoryFormModal"
import { DeleteCategoryModal } from "./DeleteCategoryModal"
import { SortableHeader } from "./SortableHeader"
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/app/actions/categories"
import { Pagination } from "@/components/ui/Pagination"

const PAGE_SIZE = 10

type SortField = "name" | "created_at"
type SortOrder = "asc" | "desc"

export function CategoryList({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const [categories, setCategories] = useState<CategoryRow[]>(initialCategories)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortField>("created_at")
  const [sortDirection, setSortDirection] = useState<SortOrder>("desc")

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryRow | null>(null)

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

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    let result = 0
    if (sortColumn === "name") {
      result = a.name.localeCompare(b.name)
    } else if (sortColumn === "created_at") {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
      result = timeA - timeB
    }
    return sortDirection === "asc" ? result : -result
  })

  const totalPages = Math.ceil(sortedCategories.length / PAGE_SIZE)
  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setIsFormOpen(true)
  }

  const handleEdit = (category: CategoryRow) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleDelete = (category: CategoryRow) => {
    setDeletingCategory(category)
    setIsDeleteOpen(true)
  }

  const onSaveCategory = async (data: any) => {
    if (editingCategory) {
      const res = await updateCategoryAction(editingCategory.id, data)
      if (res.error) throw new Error(res.error)
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...data } : c))
    } else {
      const res = await createCategoryAction(data)
      if (res.error) throw new Error(res.error)
      window.location.reload()
    }
  }

  const onConfirmDelete = async (id: string) => {
    const res = await deleteCategoryAction(id)
    if (res.error) throw new Error(res.error)
    setCategories(categories.filter(c => c.id !== id))
  }

  const sortLabel = sortColumn === "created_at" ? "Created Time" : "Name"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage spare part categories and visual assets</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Categories</CardTitle>
              <CardDescription className="mt-1">Total {categories.length} categories available</CardDescription>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sortedCategories.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {search ? "No categories found matching your search." : "No categories added yet."}
            </div>
          ) : (
            <>
              {/* Mobile View: Cards */}
              <div className="grid grid-cols-1 gap-2.5 sm:hidden">
                {paginatedCategories.map(category => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-xl border border-border/80 bg-card p-3 shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {category.image_url ? (
                        <div className="flex h-12 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-muted/40 p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={category.image_url} alt={category.name} className="h-full w-full object-contain" loading="lazy" decoding="async" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/30 text-xs text-muted-foreground/60 font-medium">
                          No img
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground truncate">{category.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {category.created_at
                            ? new Date(category.created_at).toLocaleString(undefined, {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : "—"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(category)}
                        aria-label="Edit category"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(category)}
                        aria-label="Delete category"
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
                      <SortableHeader
                        label="Name"
                        columnKey="name"
                        currentSortColumn={sortColumn}
                        currentSortDirection={sortDirection}
                        onSort={handleSort}
                        className="w-full"
                      />
                      <TableHead className="w-px whitespace-nowrap text-center">Image</TableHead>
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
                    {paginatedCategories.map(category => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="w-px whitespace-nowrap text-center">
                          {category.image_url ? (
                            <div className="mx-auto flex h-8 w-16 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={category.image_url} alt={category.name} className="h-full object-contain" loading="lazy" decoding="async" />
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">No image</span>
                          )}
                        </TableCell>
                        <TableCell className="w-px whitespace-nowrap text-center text-xs text-muted-foreground font-mono">
                          {category.created_at
                            ? new Date(category.created_at).toLocaleString(undefined, {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : "—"}
                        </TableCell>
                        <TableCell className="w-px whitespace-nowrap text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleEdit(category)}
                              aria-label="Edit category"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleDelete(category)}
                              aria-label="Delete category"
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
                totalItems={sortedCategories.length}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </CardContent>
      </Card>

      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={onSaveCategory}
        initialData={editingCategory}
      />

      <DeleteCategoryModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onConfirmDelete}
        category={deletingCategory}
      />
    </div>
  )
}
