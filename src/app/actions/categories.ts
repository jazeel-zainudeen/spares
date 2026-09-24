'use server'

import { revalidatePath, updateTag } from 'next/cache'
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'category'
}

export async function createCategoryAction(data: CategoryInsert): Promise<{ error?: string }> {
  try {
    await requireAuth()
    const payload = {
      ...data,
      slug: data.slug || slugify(data.name),
    }
    const parsedData = categorySchema.parse(payload) as CategoryInsert
    await createCategory({ ...parsedData, slug: payload.slug })
    try { updateTag('categories') } catch {}
    revalidatePath('/admin/categories')
    revalidatePath('/spare-parts')
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
    const payload = {
      ...data,
      slug: data.slug || (data.name ? slugify(data.name) : undefined),
    }
    const parsedData = categorySchema.parse(payload) as CategoryUpdate
    await updateCategory(id, { ...parsedData, ...(payload.slug ? { slug: payload.slug } : {}) })
    try { updateTag('categories') } catch {}
    revalidatePath('/admin/categories')
    revalidatePath('/spare-parts')
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
    try { updateTag('categories') } catch {}
    revalidatePath('/admin/categories')
    revalidatePath('/spare-parts')
    revalidatePath('/')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to delete category' }
  }
}
