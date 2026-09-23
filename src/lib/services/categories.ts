import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

export type CategoryRow = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data as CategoryRow[]
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data as CategoryRow
}

export async function createCategory(category: CategoryInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
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
