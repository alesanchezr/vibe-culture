import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // This should work in Server Components/Route Handlers
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          // This should work in Server Components/Route Handlers
          cookieStore.delete(name, options)
        },
      },
    }
  )
}

// It's also good practice to have a client-side Supabase client utility
// although we are primarily using the server client in app/page.tsx 