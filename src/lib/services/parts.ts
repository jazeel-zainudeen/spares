import { createClient } from '../supabase/server'
import { Database } from '@/types/database'

export type PartRow = Database['public']['Tables']['parts']['Row']
export type PartInsert = Database['public']['Tables']['parts']['Insert']
export type PartUpdate = Database['public']['Tables']['parts']['Update']

export async function getParts(modelId?: string) {
  const supabase = await createClient()
  let query = supabase.from('parts').select('*, categories(name, slug), car_models(name, car_companies(name))')
  
  if (modelId) {
    query = query.eq('model_id', modelId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as any
}

export async function getPublicParts(options?: {
  categorySlug?: string
  companySlug?: string
  modelSlug?: string
  search?: string
  page?: number
  pageSize?: number
}) {
  const supabase = await createClient()
  const page = options?.page && options.page > 0 ? options.page : 1
  const pageSize = options?.pageSize && options.pageSize > 0 ? options.pageSize : undefined

  let query = supabase
    .from('parts')
    .select('*, categories!inner(name, slug), car_models!inner(name, slug, car_companies!inner(name, slug))', {
      count: 'exact',
    })

  if (options?.categorySlug) {
    query = query.eq('categories.slug', options.categorySlug)
  }

  if (options?.companySlug) {
    query = query.eq('car_models.car_companies.slug', options.companySlug)
  }
  
  if (options?.modelSlug) {
    query = query.eq('car_models.slug', options.modelSlug)
  }
  
  if (options?.search) {
    const term = `%${options.search}%`
    query = query.or(`item.ilike.${term},ref_number.ilike.${term},oem_number.ilike.${term},description.ilike.${term}`)
  }

  query = query.order('created_at', { ascending: false })

  if (pageSize) {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)
  }

  const { data, count, error } = await query
  
  if (error) throw new Error(error.message)
  
  return {
    data: (data || []) as any[],
    total: count ?? (data?.length || 0),
    page,
    pageSize: pageSize ?? (count ?? data?.length ?? 0),
    totalPages: pageSize ? Math.ceil((count ?? 0) / pageSize) : 1,
  }
}

export async function getPartById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parts')
    .select('*, categories(name, slug), car_models(name, slug, car_companies(name, slug))')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as any
}

export async function createPart(part: PartInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parts')
    // @ts-ignore
    .insert(part as any)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as any
}

export async function updatePart(id: string, updates: PartUpdate) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parts')
    // @ts-ignore
    .update(updates as any)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as any
}

export async function deletePart(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('parts')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
