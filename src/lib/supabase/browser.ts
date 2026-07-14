'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useMemo } from 'react'

let _client: ReturnType<typeof createBrowserClient> | null = null

export function getBrowserClient() {
  if (typeof window === 'undefined') return null
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

export function useSupabase() {
  return useMemo(() => getBrowserClient(), [])
}
