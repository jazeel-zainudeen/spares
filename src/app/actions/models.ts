'use server'

import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
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

export async function createModelAction(model: ModelInsert): Promise<{ error?: string }> {
  try {
    await createModel(model)
    revalidatePath('/admin/models')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to create model' }
  }
}

export async function updateModelAction(id: string, updates: ModelUpdate): Promise<{ error?: string }> {
  try {
    await updateModel(id, updates)
    revalidatePath('/admin/models')
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
    revalidatePath('/admin/models')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to delete model' }
  }
}
