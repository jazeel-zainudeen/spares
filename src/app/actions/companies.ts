'use server'

import { revalidatePath } from 'next/cache'
import { getCompanies, createCompany, updateCompany, deleteCompany, CompanyRow, CompanyInsert, CompanyUpdate } from '@/lib/services/companies'
import { getModels } from '@/lib/services/models'

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
    await createCompany(data)
    revalidatePath('/admin/companies')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to create company' }
  }
}

export async function updateCompanyAction(id: string, data: CompanyUpdate): Promise<{ error?: string }> {
  try {
    await updateCompany(id, data)
    revalidatePath('/admin/companies')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to update company' }
  }
}

export async function deleteCompanyAction(id: string): Promise<{ error?: string }> {
  try {
    // Check if the company has any associated models
    const models = await getModels(id)
    if (models && models.length > 0) {
      return { error: `Cannot delete company. It currently has ${models.length} associated model(s).` }
    }

    await deleteCompany(id)
    revalidatePath('/admin/companies')
    return {}
  } catch (err: any) {
    return { error: err.message || 'Failed to delete company' }
  }
}
