'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <input 
          id="email"
          name="email"
          type="email" 
          required 
          className="w-full bg-muted border border-border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="admin@example.com"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">Password</label>
        <input 
          id="password"
          name="password"
          type="password" 
          required 
          className="w-full bg-muted border border-border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="••••••••"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
