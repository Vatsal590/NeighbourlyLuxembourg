import { createServerClient } from '@supabase/ssr'
import { createClient as createRawClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { cache } from 'react'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anon) {
  // Allow build to succeed; runtime checks below
  // eslint-disable-next-line no-console
  console.warn('[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const createClient = cache(async () => {
  const cookieStore = await cookies()
  return createServerClient(url ?? 'http://localhost', anon ?? 'public-anon', {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
        try { toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
      }
    }
  })
})

export const createServiceClient = () => {
  return createRawClient(url ?? 'http://localhost', process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'service', {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}
