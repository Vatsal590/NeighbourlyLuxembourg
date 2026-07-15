'use client'

import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'

export function SignOutButton() {
  const [saving, setSaving] = useState(false)
  const signOut = async () => {
    setSaving(true)
    await getBrowserClient()?.auth.signOut()
    window.location.assign('/')
  }
  return <button onClick={signOut} disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-[#c9ddd7] bg-white px-4 font-bold text-[#28554d] disabled:opacity-60"><LogOut size={17} />{saving ? 'Signing out…' : 'Sign out'}</button>
}
