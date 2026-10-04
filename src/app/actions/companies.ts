'use server'

import { requireAuth } from '@/lib/auth'
import { revalidatePath, updateTag } from 'next/cache'
import { getCompanies, createCompany, updateCompany, deleteCompany, CompanyRow, CompanyInsert, CompanyUpdate } from '@/lib/services/companies'
import { getModels } from '@/lib/services/models'
import { companySchema } from '@/lib/validations'
import { v2 as cloudinary } from 'cloudinary'
import { extractCloudinaryPublicIdFromUrl } from '@/lib/utils/images'
import { createClient } from '@/lib/supabase/server'

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
cloudinary.config({
  cloud_name: cloudName,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function fetchCompaniesAction(): Promise<{ data?: CompanyRow[], error?: string }> {
  try {
    const data = await getCompanies()
    return { data }
  } catch (err: any) {
    return { error: err.message || 'Failed to fetch companies' }
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'company'
}

export async function createCompanyAction(data: CompanyInsert): Promise<{ error?: string }> {
  try {
    await requireAuth()
    const payload = {
      ...data,
      slug: data.slug || slugify(data.name),
    }
    const parsedData = companySchema.parse(payload) as CompanyInsert
    await createCompany({ ...parsedData, slug: payload.slug })
    try { updateTag('companies') } catch {}
    revalidatePath('/admin/companies')
    revalidatePath('/brands')
    revalidatePath('/')
    return {}
  } catch (err: any) {
    if (err.errors) {
      return { error: err.errors.map((e: any) => e.message).join(", ") }
    }
    return { error: err.message || 'Failed to create company' }
  }
}

export async function updateCompanyAction(id: string, data: CompanyUpdate): Promise<{ error?: string }> {
  try {
    await requireAuth()
    const payload = {
      ...data,
      slug: data.slug || (data.name ? slugify(data.name) : undefined),
    }
    const parsedData = companySchema.parse(payload) as CompanyUpdate
    await updateCompany(id, { ...parsedData, ...(payload.slug ? { slug: payload.slug } : {}) })
    try { updateTag('companies') } catch {}
    revalidatePath('/admin/companies')
    revalidatePath('/brands')
    revalidatePath('/')
    return {}
  } catch (err: any) {
    if (err.errors) {
      return { error: err.errors.map((e: any) => e.message).join(", ") }
    }
    return { error: err.message || 'Failed to update company' }
  }
}

export async function deleteCompanyAction(id: string): Promise<{ error?: string }> {
  try {
    const models = await getModels(id)
    if (models && models.length > 0) {
      return { error: `Cannot delete company. It currently has ${models.length} associated model(s).` }
    }

    await requireAuth()

    const supabase = await createClient()
    const { data } = await supabase.from('car_companies').select('logo_url').eq('id', id).single()
    const company = data as CompanyRow | null

    if (company?.logo_url) {
      const publicId = extractCloudinaryPublicIdFromUrl(company.logo_url)
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {})
      }
    }

    await deleteCompany(id)
    try { updateTag('companies') } catch {}
    revalidatePath('/admin/companies')
    revalidatePath('/brands')
    revalidatePath('/')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to delete company' }
  }
}
