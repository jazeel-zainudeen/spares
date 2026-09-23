'use server'

import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { getCompanies, createCompany, updateCompany, deleteCompany, CompanyRow, CompanyInsert, CompanyUpdate } from '@/lib/services/companies'
import { getModels } from '@/lib/services/models'
import { companySchema } from '@/lib/validations'

export async function fetchCompaniesAction(): Promise<{ data?: CompanyRow[], error?: string }> {
  try {
    const data = await getCompanies()
    return { data }
  } catch (err: any) {
    return { error: err.message || 'Failed to fetch companies' }
  }
}

export async function createCompanyAction(data: CompanyInsert): Promise<{ error?: string }> {
  try {
    await requireAuth()
    const parsedData = companySchema.parse(data)
    await createCompany(parsedData)
    revalidatePath('/admin/companies')
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
    const parsedData = companySchema.parse(data)
    await updateCompany(id, parsedData)
    revalidatePath('/admin/companies')
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
    await deleteCompany(id)
    revalidatePath('/admin/companies')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to delete company' }
  }
}
