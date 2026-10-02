import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

export type CategoryRow = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

import { unstable_cache } from 'next/cache'
import { getPublicClient } from '@/lib/supabase/public'

export async function getCategories(): Promise<(CategoryRow & { part_count?: number })[]> {
  return unstable_cache(
    async () => {
      const supabase = getPublicClient()
      const { data, error } = await supabase
        .from('categories')
        .select('*, parts(count)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return (data || []).map((cat: any) => ({
        ...cat,
        part_count: cat.parts?.[0]?.count ?? 0,
        parts: undefined,
      })) as (CategoryRow & { part_count?: number })[]
    },
    ['categories-all-v2'],
    { revalidate: 3600, tags: ['categories', 'parts'] }
  )()
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow> {
  return unstable_cache(
    async () => {
      const supabase = getPublicClient()
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) throw error
      return data as CategoryRow
    },
    ['category-by-slug', slug],
    { revalidate: 3600, tags: ['categories', `category-${slug}`] }
  )()
}

export async function createCategory(category: CategoryInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    // @ts-ignore
    .insert(category as any)
    .select()
    .single()
  
  if (error) throw error
  return data as CategoryRow
}

export async function updateCategory(id: string, category: CategoryUpdate) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    // @ts-ignore
    .update(category as any)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as CategoryRow
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
