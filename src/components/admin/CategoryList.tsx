"use client"

import { useState } from "react"
import { CategoryRow } from "@/lib/services/categories"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { CategoryFormModal } from "./CategoryFormModal"
import { DeleteCategoryModal } from "./DeleteCategoryModal"
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/app/actions/categories"

import { Flex, Box, Heading, Text, Card, TextField } from "@radix-ui/themes"

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
    <Flex direction="column" gap="6">
      <Flex direction={{ initial: 'column', sm: 'row' }} align={{ sm: 'center' }} justify="between" gap="4">
        <Heading size="8" style={{ letterSpacing: '-0.02em' }}>Categories</Heading>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </Flex>

      <Card size="3" variant="surface">
        <Box mb="5">
          <TextField.Root 
            placeholder="Search categories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="2"
            style={{ maxWidth: '300px' }}
          >
            <TextField.Slot>
              <Search height="16" width="16" color="var(--gray-a10)" />
            </TextField.Slot>
          </TextField.Root>
        </Box>

        {filteredCategories.length === 0 ? (
          <Box py="8" style={{ textAlign: 'center' }}>
            <Text color="gray">
              {search ? "No categories found matching your search." : "No categories added yet."}
            </Text>
          </Box>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Image</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map(category => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell>
                    {category.image_url ? (
                      <Box style={{ height: '32px', width: '64px', backgroundColor: 'var(--gray-a3)', borderRadius: 'var(--radius-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src={category.image_url} alt={category.name} style={{ height: '100%', objectFit: 'contain' }} />
                      </Box>
                    ) : (
                      <Text size="1" color="gray">No image</Text>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Flex justify="end" gap="2">
                      <Button variant="ghost" size="icon-sm" color="gray" onClick={() => handleEdit(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" color="red" onClick={() => handleDelete(category)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Flex>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
    </Flex>
  )
}
