'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { ArrowRight, Heart, ShieldCheck } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'
import type { UserRole } from '@/lib/supabase/types'

type Props = {
  role: Extract<UserRole, 'senior' | 'volunteer'>
}

const copy = {
  volunteer: {
    eyebrow: 'Helper sign in',
    title: 'Welcome back, helper.',
    description: 'Sign in to manage your helper profile and availability.',
    signupHref: '/signup-helper',
    signupText: 'New here? Create a helper account',
    dashboardHref: '/helper/dashboard'
  },
  senior: {
    eyebrow: 'Help finder sign in',
    title: 'Welcome back.',
    description: 'Sign in to find local helpers and manage your requests.',
    signupHref: '/signup-requester',
    signupText: 'New here? Create a help finder account',
    dashboardHref: '/help-finder/dashboard'
  }
} as const

export function RoleLoginForm({ role }: Props) {
  const text = copy[role]
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const supabase = getBrowserClient()
    if (!supabase) {
      setError('Accounts are not connected yet. Add the Supabase environment variables in Vercel first.')
      return
    }

    setSaving(true)
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError || !data.user) throw new Error(signInError?.message ?? 'We could not sign you in.')

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        await supabase.auth.signOut()
        throw new Error('Your account profile is not ready yet. Please check your email confirmation and try again.')
      }
      if (profile.role !== role) {
        await supabase.auth.signOut()
        throw new Error(role === 'volunteer' ? 'This is a help finder account. Please use the Help finder sign in page.' : 'This is a helper account. Please use the Helper sign in page.')
      }

      window.location.assign(text.dashboardHref)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return <main className="min-h-screen bg-[#f4f9f7] text-[#183d38]">
    <header className="mx-auto flex max-w-[720px] items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#187864] text-white"><Heart size={22} fill="currentColor" /></span><span className="text-xl font-extrabold tracking-[-.04em]">Neighbourly<span className="text-[#de7c4d]">.</span></span></Link><Link href="/login" className="text-sm font-bold text-[#47716a]">Choose account</Link></header>
    <section className="mx-auto max-w-[620px] px-5 pb-16 pt-10"><div className="rounded-[28px] border border-[#dceae5] bg-white p-6 shadow-sm sm:p-10"><p className="font-bold uppercase tracking-[.12em] text-sm text-[#e07b4c]">{text.eyebrow}</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em]">{text.title}</h1><p className="mt-4 text-[17px] leading-7 text-[#678079]">{text.description}</p><form className="mt-8 grid gap-5" onSubmit={submit}><label className="block"><span className="mb-2 block font-bold text-[#28554d]">Email address</span><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-xl border-2 border-[#d8e7e2] bg-white px-4 py-3.5 text-[16px] outline-none transition focus:border-[#187864]" /></label><label className="block"><span className="mb-2 block font-bold text-[#28554d]">Password</span><input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" className="w-full rounded-xl border-2 border-[#d8e7e2] bg-white px-4 py-3.5 text-[16px] outline-none transition focus:border-[#187864]" /></label>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}<button disabled={saving} className="mt-2 flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#187864] px-5 text-[17px] font-bold text-white disabled:opacity-60">{saving ? 'Signing in…' : <>Sign in <ArrowRight size={19} /></>}</button><p className="flex justify-center gap-1.5 text-center text-xs text-[#718b83]"><ShieldCheck size={15} className="shrink-0 text-[#187864]" /> Secure, private account access.</p></form><Link href={text.signupHref} className="mt-7 block text-center font-bold text-[#187864] hover:underline">{text.signupText}</Link></div></section>
  </main>
}
