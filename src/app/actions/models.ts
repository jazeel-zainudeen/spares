'use server'

import { getModels, createModel, updateModel, deleteModel, ModelRow, ModelInsert, ModelUpdate } from '@/lib/services/models'

export async function fetchModelsAction(companyId?: string): Promise<{ data?: ModelRow[], error?: string }> {
  try {
    const data = await getModels(companyId)
    return { data }
  } catch (err: any) {
    return { error: err.message || 'Failed to fetch models' }
  }
}

export async function createModelAction(model: ModelInsert): Promise<{ data?: ModelRow, error?: string }> {
  try {
    const data = await createModel(model)
    return { data }
  } catch (err: any) {
    return { error: err.message || 'Failed to create model' }
  }
}

export async function updateModelAction(id: string, updates: ModelUpdate): Promise<{ data?: ModelRow, error?: string }> {
  try {
    const data = await updateModel(id, updates)
    return { data }
  } catch (err: any) {
    return { error: err.message || 'Failed to update model' }
  }
}

export async function deleteModelAction(id: string): Promise<{ error?: string }> {
  try {
    await deleteModel(id)
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to delete model' }
  }
}
