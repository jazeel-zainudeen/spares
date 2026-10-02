import { createClient } from '../supabase/server'
import { Database } from '@/types/database'

export type ModelRow = Database['public']['Tables']['car_models']['Row']
export type ModelInsert = Database['public']['Tables']['car_models']['Insert']
export type ModelUpdate = Database['public']['Tables']['car_models']['Update']

import { unstable_cache } from 'next/cache'
import { getPublicClient } from '@/lib/supabase/public'

export async function getModels(companyId?: string): Promise<(ModelRow & { part_count?: number })[]> {
  const cacheKey = companyId ? `models-company-${companyId}-v2` : 'models-all-v2'
  return unstable_cache(
    async () => {
      const supabase = getPublicClient()
      let query = supabase.from('car_models').select('*, parts(count), car_companies(name, logo_url, slug)')
      
      if (companyId) {
        query = query.eq('company_id', companyId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return (data || []).map((model: any) => ({
        ...model,
        part_count: model.parts?.[0]?.count ?? 0,
        parts: undefined,
      })) as (ModelRow & { part_count?: number })[]
    },
    [cacheKey],
    { revalidate: 3600, tags: ['models', 'parts', ...(companyId ? [`models-${companyId}`] : [])] }
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
      return data as ModelRow
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
  return data as ModelRow
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
  return data as ModelRow
}

export async function deleteModel(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('car_models')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function getModelsWithCompany(companySlugOrId?: string) {
  const supabase = getPublicClient()
  let query = supabase
    .from('car_models')
    .select('*, parts(count), car_companies!inner(name, slug, logo_url)')

  if (companySlugOrId) {
    query = query.or(`company_id.eq.${companySlugOrId},car_companies.slug.eq.${companySlugOrId}`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data || []).map((model: any) => ({
    ...model,
    part_count: model.parts?.[0]?.count ?? 0,
    parts: undefined,
  }))
}

export async function getModelBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_models')
    .select('*, car_companies(name, slug)')
    .eq('slug', slug)
    .single()

  if (error) throw new Error(error.message)
  return data as ModelRow
}
