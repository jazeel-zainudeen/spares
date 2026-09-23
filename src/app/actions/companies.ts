'use server'

import { getCompanies, CompanyRow } from '@/lib/services/companies'

export async function fetchCompaniesAction(): Promise<{ data?: CompanyRow[], error?: string }> {
  try {
    const data = await getCompanies()
    return { data }
  } catch (err: any) {
    return { error: err.message || 'Failed to fetch companies' }
  }
}
