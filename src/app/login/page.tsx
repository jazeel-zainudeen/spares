import { LoginForm } from '@/components/admin/LoginForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/admin')
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <div className="w-full max-w-md">
        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to manage the catalog
            </p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
