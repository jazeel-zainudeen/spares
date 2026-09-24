"use client"

import { useState } from "react"
import { CategoryRow } from "@/lib/services/categories"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { CategoryFormModal } from "./CategoryFormModal"
import { DeleteCategoryModal } from "./DeleteCategoryModal"
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/app/actions/categories"

export function CategoryList({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const [categories, setCategories] = useState<CategoryRow[]>(initialCategories)
  const [search, setSearch] = useState("")
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryRow | null>(null)

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="glass p-6 rounded-3xl">
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search categories..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {search ? "No categories found matching your search." : "No categories added yet."}
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Image</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(category => (
                <tr key={category.id}>
                  <td className="font-medium" data-label="Name">{category.name}</td>
                  <td className="text-muted-foreground" data-label="Slug">{category.slug}</td>
                  <td data-label="Image">
                    {category.image_url ? (
                      <div className="h-8 w-16 bg-white/5 rounded flex items-center justify-center overflow-hidden">
                        <img src={category.image_url} alt={category.name} className="h-full object-contain" />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No image</span>
                    )}
                  </td>
                  <td className="text-right" data-label="Actions">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" className="text-slate-500 hover:text-blue-600" onClick={() => handleEdit(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(category)}>
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
