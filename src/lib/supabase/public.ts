import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

let publicClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function getPublicClient() {
  if (!publicClient) {
    publicClient = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )
  }
  return publicClient
}
