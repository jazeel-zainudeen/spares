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
  return data
}

export async function getCompanyById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_companies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createCompany(company: CompanyInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_companies')
    .insert(company)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateCompany(id: string, updates: CompanyUpdate) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_companies')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteCompany(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('car_companies')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
