import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

export type CategoryRow = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

import { unstable_cache } from 'next/cache'
import { getPublicClient } from '@/lib/supabase/public'

export async function getCategories(): Promise<CategoryRow[]> {
  return unstable_cache(
    async () => {
      const supabase = getPublicClient()
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      return (data || []) as CategoryRow[]
    },
    ['categories-all'],
    { revalidate: 3600, tags: ['categories'] }
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
    .insert(category)
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
    .update(category)
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
