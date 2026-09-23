import { createClient } from '../supabase/server'
import { Database } from '@/types/database'

export type PartRow = Database['public']['Tables']['parts']['Row']
export type PartInsert = Database['public']['Tables']['parts']['Insert']
export type PartUpdate = Database['public']['Tables']['parts']['Update']

export async function getParts(modelId?: string) {
  const supabase = await createClient()
  let query = supabase.from('parts').select('*, car_models(name, car_companies(name))')
  
  if (modelId) {
    query = query.eq('model_id', modelId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getPartById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parts')
    .select('*, car_models(name, car_companies(name))')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createPart(part: PartInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parts')
    .insert(part)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updatePart(id: string, updates: PartUpdate) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('parts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
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
