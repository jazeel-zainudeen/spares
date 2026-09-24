'use server'

import { requireAuth } from '@/lib/auth'
import { revalidatePath, updateTag } from 'next/cache'
import { getModels, createModel, updateModel, deleteModel, ModelRow, ModelInsert, ModelUpdate } from '@/lib/services/models'
import { getParts } from '@/lib/services/parts'

export async function fetchModelsAction(companyId?: string): Promise<{ data?: ModelRow[], error?: string }> {
  try {
    const data = await getModels(companyId)
    return { data }
  } catch (err: any) {
    return { error: err.message || 'Failed to fetch models' }
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'model'
}

export async function createModelAction(model: ModelInsert): Promise<{ error?: string }> {
  try {
    const payload = {
      ...model,
      slug: model.slug || slugify(model.name),
    }
    await createModel(payload)
    try { updateTag('models') } catch {}
    revalidatePath('/admin/models')
    revalidatePath('/models')
    revalidatePath('/')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to create model' }
  }
}

export async function updateModelAction(id: string, updates: ModelUpdate): Promise<{ error?: string }> {
  try {
    const payload = {
      ...updates,
      slug: updates.slug || (updates.name ? slugify(updates.name) : undefined),
    }
    await updateModel(id, payload)
    try { updateTag('models') } catch {}
    revalidatePath('/admin/models')
    revalidatePath('/models')
    revalidatePath('/')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to update model' }
  }
}

export async function deleteModelAction(id: string): Promise<{ error?: string }> {
  try {
    // Check if the model has any associated parts
    const parts = await getParts(id)
    if (parts && parts.length > 0) {
      return { error: `Cannot delete model. It currently has ${parts.length} associated part(s).` }
    }

    await requireAuth()
    await deleteModel(id)
    try { updateTag('models') } catch {}
    revalidatePath('/admin/models')
    revalidatePath('/models')
    revalidatePath('/')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to delete model' }
  }
}
