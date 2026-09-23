import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  // If we had authentication implemented, we'd verify the user here.
  // For the sake of the prompt, we'll establish the middleware structure.
  
  const supabase = await createClient()
  
  // Example authentication check
  // const { data: { session } } = await supabase.auth.getSession()
  
  // if (request.nextUrl.pathname.startsWith('/admin') && !session) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
