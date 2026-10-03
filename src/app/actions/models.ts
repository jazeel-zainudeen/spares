'use server'

import { requireAuth } from '@/lib/auth'
import { revalidatePath, updateTag } from 'next/cache'
import { getModels, getModelsWithCompany, createModel, updateModel, deleteModel, ModelRow, ModelInsert, ModelUpdate } from '@/lib/services/models'
import { getParts } from '@/lib/services/parts'
import { v2 as cloudinary } from 'cloudinary'
import { extractCloudinaryPublicIdFromUrl } from '@/lib/utils/images'
import { createClient } from '@/lib/supabase/server'

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
cloudinary.config({
  cloud_name: cloudName,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function fetchModelsAction(companyIdentifier?: string): Promise<{ data?: ModelRow[], error?: string }> {
  try {
    const data = await getModelsWithCompany(companyIdentifier)
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
    await requireAuth()
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
    await requireAuth()
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

    const supabase = await createClient()
    const { data: model } = await supabase.from('car_models').select('image_url').eq('id', id).single()

    if (model?.image_url) {
      const publicId = extractCloudinaryPublicIdFromUrl(model.image_url)
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {})
      }
    }

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
