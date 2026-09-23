'use server'

import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { getParts, createPart, updatePart, deletePart, PartRow, PartInsert, PartUpdate } from '@/lib/services/parts'
import { partSchema } from '@/lib/validations'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function fetchPartsAction(modelId?: string): Promise<{ data?: PartRow[], error?: string }> {
  try {
    const data = await getParts(modelId)
    return { data }
  } catch (err: any) {
    return { error: err.message || 'Failed to fetch parts' }
  }
}

export async function createPartAction(part: PartInsert): Promise<{ error?: string }> {
  try {
    await requireAuth()
    const parsedData = partSchema.parse(part)
    await createPart(parsedData)
    revalidatePath('/admin/parts')
    return {}
  } catch (err: any) {
    if (err.errors) {
      return { error: err.errors.map((e: any) => e.message).join(", ") }
    }
    return { error: err.message || 'Failed to create part' }
  }
}

export async function updatePartAction(id: string, updates: PartUpdate): Promise<{ error?: string }> {
  try {
    await requireAuth()
    const parsedData = partSchema.parse(updates)
    await updatePart(id, parsedData)
    revalidatePath('/admin/parts')
    return {}
  } catch (err: any) {
    if (err.errors) {
      return { error: err.errors.map((e: any) => e.message).join(", ") }
    }
    return { error: err.message || 'Failed to update part' }
  }
}

export async function deletePartAction(id: string, cloudinaryPublicId?: string | null): Promise<{ error?: string }> {
  try {
    // If the part has an image, delete it from Cloudinary first
    if (cloudinaryPublicId) {
      await cloudinary.uploader.destroy(cloudinaryPublicId)
    }

    await requireAuth()
    await deletePart(id)
    revalidatePath('/admin/parts')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to delete part' }
  }
}

// Cloudinary signature generation for secure client-side uploading directly to Cloudinary
export async function getCloudinarySignature(folder: string) {
  const timestamp = Math.round(new Date().getTime() / 1000)
  
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET!
  )

  return { timestamp, signature, cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY }
}

export async function deleteCloudinaryImageAction(publicId: string): Promise<{ error?: string }> {
  try {
    await cloudinary.uploader.destroy(publicId)
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to delete image' }
  }
}
