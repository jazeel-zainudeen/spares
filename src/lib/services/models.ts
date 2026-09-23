import { createClient } from '../supabase/server'
import { Database } from '@/types/database'

export type ModelRow = Database['public']['Tables']['car_models']['Row']
export type ModelInsert = Database['public']['Tables']['car_models']['Insert']
export type ModelUpdate = Database['public']['Tables']['car_models']['Update']

export async function getModels(companyId?: string) {
  const supabase = await createClient()
  let query = supabase.from('car_models').select('*, car_companies(name)')
  
  if (companyId) {
    query = query.eq('company_id', companyId)
  }

  const { data, error } = await query.order('name')

  if (error) throw new Error(error.message)
  return data
}

export async function getModelById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_models')
    .select('*, car_companies(name)')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createModel(model: ModelInsert) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_models')
    .insert(model)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateModel(id: string, updates: ModelUpdate) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('car_models')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteModel(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('car_models')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
