'use server'

import { revalidatePath } from 'next/cache'
import { getCategories, createCategory, updateCategory, deleteCategory, CategoryRow, CategoryInsert, CategoryUpdate } from '@/lib/services/categories'
import { categorySchema } from '@/lib/validations'
import { requireAuth } from '@/lib/auth'

export async function fetchCategoriesAction(): Promise<{ data?: CategoryRow[], error?: string }> {
  try {
    const data = await getCategories()
    return { data }
  } catch (err: any) {
    return { error: err.message || 'Failed to fetch categories' }
  }
}

export async function createCategoryAction(data: CategoryInsert): Promise<{ error?: string }> {
  try {
    await requireAuth()
    const parsedData = categorySchema.parse(data)
    await createCategory(parsedData)
    revalidatePath('/admin/categories')
    revalidatePath('/')
    return {}
  } catch (err: any) {
    if (err.errors) {
      return { error: err.errors.map((e: any) => e.message).join(", ") }
    }
    return { error: err.message || 'Failed to create category' }
  }
}

export async function updateCategoryAction(id: string, data: CategoryUpdate): Promise<{ error?: string }> {
  try {
    await requireAuth()
    const parsedData = categorySchema.parse(data)
    await updateCategory(id, parsedData)
    revalidatePath('/admin/categories')
    revalidatePath('/')
    return {}
  } catch (err: any) {
    if (err.errors) {
      return { error: err.errors.map((e: any) => e.message).join(", ") }
    }
    return { error: err.message || 'Failed to update category' }
  }
}

export async function deleteCategoryAction(id: string): Promise<{ error?: string }> {
  try {
    await requireAuth()
    await deleteCategory(id)
    revalidatePath('/admin/categories')
    revalidatePath('/')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to delete category' }
  }
}
