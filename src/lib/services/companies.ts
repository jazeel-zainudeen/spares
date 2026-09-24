import { createClient } from '../supabase/server'
import { Database } from '@/types/database'

export type CompanyRow = Database['public']['Tables']['car_companies']['Row']
export type CompanyInsert = Database['public']['Tables']['car_companies']['Insert']
export type CompanyUpdate = Database['public']['Tables']['car_companies']['Update']

export async function getCompanies() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_companies')
    .select('*')
    .order('name')

  if (error) throw new Error(error.message)
  return data as any
}

export async function getCompanyById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_companies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as any
}

export async function createCompany(company: CompanyInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_companies')
    // @ts-ignore
    .insert(company as any)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as any
}

export async function updateCompany(id: string, updates: CompanyUpdate) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_companies')
    // @ts-ignore
    .update(updates as any)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as any
}

export async function deleteCompany(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('car_companies')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function getCompaniesWithStats() {
  const supabase = await createClient()
  const { data: companies, error } = await supabase
    .from('car_companies')
    .select('*, car_models(id)')
    .order('name')

  if (error) throw new Error(error.message)

  // Get part counts per company via models
  const result = (companies || []).map((company: any) => ({
    ...company,
    model_count: company.car_models?.length ?? 0,
    car_models: undefined,
  }))

  return result
}

export async function getCompanyBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw new Error(error.message)
  return data as any
}
