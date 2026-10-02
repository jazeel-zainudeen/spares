import { createClient } from '../supabase/server'
import { Database } from '@/types/database'

export type CompanyRow = Database['public']['Tables']['car_companies']['Row']
export type CompanyInsert = Database['public']['Tables']['car_companies']['Insert']
export type CompanyUpdate = Database['public']['Tables']['car_companies']['Update']

import { unstable_cache } from 'next/cache'
import { getPublicClient } from '@/lib/supabase/public'

export async function getCompanies(): Promise<(CompanyRow & { model_count?: number; part_count?: number })[]> {
  return unstable_cache(
    async () => {
      const supabase = getPublicClient()
      const { data, error } = await supabase
        .from('car_companies')
        .select('*, car_models(id, parts(count))')
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return (data || []).map((company: any) => ({
        ...company,
        model_count: company.car_models?.length ?? 0,
        part_count: company.car_models?.reduce((acc: number, m: any) => acc + (m.parts?.[0]?.count ?? 0), 0) ?? 0,
        car_models: undefined,
      })) as (CompanyRow & { model_count?: number; part_count?: number })[]
    },
    ['companies-all-v2'],
    { revalidate: 3600, tags: ['companies', 'models', 'parts'] }
  )()
}

export async function getCompanyById(id: string): Promise<CompanyRow> {
  return unstable_cache(
    async () => {
      const supabase = getPublicClient()
      const { data, error } = await supabase
        .from('car_companies')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      return data as CompanyRow
    },
    ['company-by-id', id],
    { revalidate: 3600, tags: ['companies', `company-${id}`] }
  )()
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
  return data as CompanyRow
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
  return data as CompanyRow
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
  return getCompanies()
}

export async function getCompanyBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw new Error(error.message)
  return data as CompanyRow
}
