import { createClient } from '../supabase/server'
import { Database } from '@/types/database'

export type ModelRow = Database['public']['Tables']['car_models']['Row']
export type ModelInsert = Database['public']['Tables']['car_models']['Insert']
export type ModelUpdate = Database['public']['Tables']['car_models']['Update']

import { unstable_cache } from 'next/cache'
import { getPublicClient } from '@/lib/supabase/public'

export async function getModels(companyId?: string): Promise<ModelRow[]> {
  const cacheKey = companyId ? `models-company-${companyId}` : 'models-all'
  return unstable_cache(
    async () => {
      const supabase = getPublicClient()
      let query = supabase.from('car_models').select('*, car_companies(name)')
      
      if (companyId) {
        query = query.eq('company_id', companyId)
      }

      const { data, error } = await query.order('name')

      if (error) throw new Error(error.message)
      return (data || []) as any
    },
    [cacheKey],
    { revalidate: 3600, tags: ['models', ...(companyId ? [`models-${companyId}`] : [])] }
  )()
}

export async function getModelById(id: string): Promise<ModelRow> {
  return unstable_cache(
    async () => {
      const supabase = getPublicClient()
      const { data, error } = await supabase
        .from('car_models')
        .select('*, car_companies(name)')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      return data as any
    },
    ['model-by-id', id],
    { revalidate: 3600, tags: ['models', `model-${id}`] }
  )()
}

export async function createModel(model: ModelInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_models')
    // @ts-ignore
    .insert(model as any)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as any
}

export async function updateModel(id: string, updates: ModelUpdate) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_models')
    // @ts-ignore
    .update(updates as any)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as any
}

export async function deleteModel(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('car_models')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function getModelsWithCompany(companySlug?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('car_models')
    .select('*, car_companies!inner(name, slug, logo_url)')

  if (companySlug) {
    query = query.eq('car_companies.slug', companySlug)
  }

  const { data, error } = await query.order('name')

  if (error) throw new Error(error.message)
  return data as any[]
}

export async function getModelBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_models')
    .select('*, car_companies(name, slug)')
    .eq('slug', slug)
    .single()

  if (error) throw new Error(error.message)
  return data as any
}
