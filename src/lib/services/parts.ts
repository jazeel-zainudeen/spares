import { createClient } from '../supabase/server'
import { getPublicClient } from '../supabase/public'
import { Database } from '@/types/database'

export { getPartImages, getPartPublicIds } from '@/lib/utils/images'

export type PartRow = Database['public']['Tables']['parts']['Row']
export type PartInsert = Database['public']['Tables']['parts']['Insert']
export type PartUpdate = Database['public']['Tables']['parts']['Update']

export type ExtendedPartInsert = PartInsert & {
  image_urls?: string[];
  cloudinary_public_ids?: string[];
}

export type ExtendedPartUpdate = PartUpdate & {
  image_urls?: string[];
  cloudinary_public_ids?: string[];
}

export async function getParts(modelId?: string, limit: number = 100) {
  const supabase = await createClient()
  let query = supabase.from('parts').select('*, categories(name, slug), car_models(name, car_companies(name))')
  
  if (modelId) {
    query = query.eq('model_id', modelId)
  }

  query = query.order('created_at', { ascending: false })

  if (limit > 0) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return data
}

export async function getPublicParts(options?: {
  categorySlug?: string
  companySlug?: string
  modelSlug?: string
  search?: string
  page?: number
  pageSize?: number
}) {
  const supabase = getPublicClient()
  const page = options?.page && options.page > 0 ? options.page : 1
  const pageSize = options?.pageSize && options.pageSize > 0 ? options.pageSize : undefined

  let query = supabase
    .from('parts')
    .select('*, categories!inner(name, slug), car_models!inner(name, slug, car_companies!inner(name, slug))', {
      count: 'exact',
    })

  // Multi-select category filtering
  if (options?.categorySlug) {
    const cats = options.categorySlug.split(',').map(s => s.trim()).filter(Boolean)
    if (cats.length === 1) {
      query = query.eq('categories.slug', cats[0])
    } else if (cats.length > 1) {
      query = query.in('categories.slug', cats)
    }
  }

  // Multi-select brand/company filtering
  if (options?.companySlug) {
    const comps = options.companySlug.split(',').map(s => s.trim()).filter(Boolean)
    if (comps.length === 1) {
      query = query.eq('car_models.car_companies.slug', comps[0])
    } else if (comps.length > 1) {
      query = query.in('car_models.car_companies.slug', comps)
    }
  }

  // Multi-select model filtering
  if (options?.modelSlug) {
    const mods = options.modelSlug.split(',').map(s => s.trim()).filter(Boolean)
    if (mods.length === 1) {
      query = query.eq('car_models.slug', mods[0])
    } else if (mods.length > 1) {
      query = query.in('car_models.slug', mods)
    }
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
    data: data || [],
    total: count ?? (data?.length || 0),
    page,
    pageSize: pageSize ?? (count ?? data?.length ?? 0),
    totalPages: pageSize ? Math.ceil((count ?? 0) / pageSize) : 1,
  }
}

export async function getPartById(id: string) {
  const supabase = getPublicClient()
  const { data, error } = await supabase
    .from('parts')
    .select('*, categories(name, slug), car_models(name, slug, car_companies(name, slug))')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createPart(part: ExtendedPartInsert) {
  const supabase = await createClient()

  const images = part.image_urls && part.image_urls.length > 0
    ? part.image_urls
    : (part.image_url ? [part.image_url] : [])
  const publicIds = part.cloudinary_public_ids && part.cloudinary_public_ids.length > 0
    ? part.cloudinary_public_ids
    : (part.cloudinary_public_id ? [part.cloudinary_public_id] : [])

  const firstImageUrl = images[0] || part.image_url || null
  const firstPublicId = publicIds[0] || part.cloudinary_public_id || null

  const encodedImageUrl = images.length > 1 ? JSON.stringify(images) : firstImageUrl
  const encodedPublicId = publicIds.length > 1 ? JSON.stringify(publicIds) : firstPublicId

  const fullPayload = {
    ...part,
    image_url: encodedImageUrl,
    cloudinary_public_id: encodedPublicId,
    image_urls: images,
    cloudinary_public_ids: publicIds,
  }

  const { data, error } = await supabase
    .from('parts')
    // @ts-ignore
    .insert(fullPayload as any)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST204' || error.message.includes('schema cache') || error.message.includes('image_urls')) {
      // Fallback if image_urls column doesn't exist on remote table yet
      const fallbackPayload = {
        ...part,
        image_url: encodedImageUrl,
        cloudinary_public_id: encodedPublicId,
      } as ExtendedPartInsert
      delete fallbackPayload.image_urls
      delete fallbackPayload.cloudinary_public_ids

      const { data: fbData, error: fbError } = await supabase
        .from('parts')
        // @ts-ignore
        .insert(fallbackPayload as any)
        .select()
        .single()

      if (fbError) throw new Error(fbError.message)
      return fbData
    }
    throw new Error(error.message)
  }

  return data
}

export async function updatePart(id: string, updates: ExtendedPartUpdate) {
  const supabase = await createClient()

  const images = updates.image_urls !== undefined
    ? updates.image_urls
    : (updates.image_url ? [updates.image_url] : [])
  const publicIds = updates.cloudinary_public_ids !== undefined
    ? updates.cloudinary_public_ids
    : (updates.cloudinary_public_id ? [updates.cloudinary_public_id] : [])

  const firstImageUrl = images ? images[0] || null : updates.image_url || null
  const firstPublicId = publicIds ? publicIds[0] || null : updates.cloudinary_public_id || null

  const encodedImageUrl = Array.isArray(images) && images.length > 1 ? JSON.stringify(images) : firstImageUrl
  const encodedPublicId = Array.isArray(publicIds) && publicIds.length > 1 ? JSON.stringify(publicIds) : firstPublicId

  const fullPayload = {
    ...updates,
    image_url: encodedImageUrl,
    cloudinary_public_id: encodedPublicId,
    image_urls: images,
    cloudinary_public_ids: publicIds,
  }

  const { data, error } = await supabase
    .from('parts')
    // @ts-ignore
    .update(fullPayload as any)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST204' || error.message.includes('schema cache') || error.message.includes('image_urls')) {
      // Fallback if image_urls column doesn't exist on remote table yet
      const fallbackPayload = {
        ...updates,
        image_url: encodedImageUrl,
        cloudinary_public_id: encodedPublicId,
      } as ExtendedPartUpdate
      delete fallbackPayload.image_urls
      delete fallbackPayload.cloudinary_public_ids

      const { data: fbData, error: fbError } = await supabase
        .from('parts')
        // @ts-ignore
        .update(fallbackPayload as any)
        .eq('id', id)
        .select()
        .single()

      if (fbError) throw new Error(fbError.message)
      return fbData
    }
    throw new Error(error.message)
  }

  return data
}

export async function deletePart(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('parts')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
