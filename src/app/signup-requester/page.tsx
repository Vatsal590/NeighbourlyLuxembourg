'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, Heart, ShieldCheck } from 'lucide-react'
import { getBrowserClient } from '@/lib/supabase/browser'

type Fields = { name: string; email: string; password: string; phoneNumber: string; address: string; description: string }
const initial: Fields = { name: '', email: '', password: '', phoneNumber: '', address: '', description: '' }

export default function RequesterSignupPage() {
  const [fields, setFields] = useState<Fields>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const update = (name: keyof Fields, value: string) => setFields({ ...fields, [name]: value })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const required: (keyof Fields)[] = ['name', 'email', 'password', 'phoneNumber', 'address']
    const nextErrors = Object.fromEntries(required.filter((key) => !fields[key].trim()).map((key) => [key, 'This field is required.'])) as Partial<Record<keyof Fields, string>>
    if (fields.password && fields.password.length < 8) nextErrors.password = 'Use at least 8 characters.'
    setErrors(nextErrors); setServerError(''); setConfirmation('')
    if (Object.keys(nextErrors).length) return

    const supabase = getBrowserClient()
    if (!supabase) { setServerError('Accounts are not connected yet. Add the Supabase environment variables in Vercel first.'); return }
    setSaving(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: fields.email.trim(), password: fields.password,
        options: { emailRedirectTo: `${window.location.origin}/login-help-finder`, data: { role: 'senior', full_name: fields.name.trim(), phone: fields.phoneNumber.trim(), address: fields.address.trim(), bio: fields.description.trim() } }
      })
      if (error) throw error
      if (data.session) { window.location.assign('/help-finder/dashboard'); return }
      setConfirmation('Your account has been created. Please check your email to confirm it, then sign in to find help.')
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally { setSaving(false) }
  }
  const input = (name: keyof Fields, label: string, placeholder: string, type = 'text') => <label className="block"><span className="mb-2 block font-bold text-[#28554d]">{label}</span><input required type={type} autoComplete={name === 'email' ? 'email' : name === 'password' ? 'new-password' : undefined} value={fields[name]} onChange={(e) => update(name, e.target.value)} placeholder={placeholder} className={`w-full rounded-xl border-2 bg-white px-4 py-3.5 text-[16px] outline-none transition placeholder:text-[#9aada8] focus:border-[#187864] ${errors[name] ? 'border-red-400' : 'border-[#d8e7e2]'}`} aria-invalid={Boolean(errors[name])}/>{errors[name] && <span className="mt-1.5 block text-sm font-semibold text-red-600">{errors[name]}</span>}</label>
  return <main className="min-h-screen bg-[#f4f9f7] text-[#183d38]"><header className="mx-auto flex max-w-[1000px] items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#187864] text-white"><Heart size={22} fill="currentColor"/></span><span className="text-xl font-extrabold tracking-[-.04em]">Neighbourly<span className="text-[#de7c4d]">.</span></span></Link><Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#47716a]"><ArrowLeft size={17}/> Back home</Link></header><section className="mx-auto max-w-[720px] px-5 pb-16 pt-10"><div className="rounded-[28px] border border-[#dceae5] bg-white p-6 shadow-sm sm:p-10"><p className="font-bold uppercase tracking-[.12em] text-sm text-[#e07b4c]">Let&apos;s get you connected</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em]">Find help nearby</h1><p className="mt-4 text-[17px] leading-7 text-[#678079]">Create your private account once, then come back whenever you need a helping hand.</p><form className="mt-8 grid gap-5" onSubmit={submit}>{input('name', 'Your name', 'For example, Jean Muller')}{input('email', 'Email address', 'you@example.com', 'email')}{input('password', 'Create a password', 'At least 8 characters', 'password')}{input('phoneNumber', 'Phone number', '+352 …', 'tel')}{input('address', 'Your area or address', 'For example, Esch-sur-Alzette')}{<label className="block"><span className="mb-2 block font-bold text-[#28554d]">What help do you need? <span className="font-normal text-[#6f8982]">(optional)</span></span><textarea value={fields.description} onChange={(e) => update('description', e.target.value)} placeholder="For example, I need help picking up groceries on Tuesday." className="min-h-28 w-full rounded-xl border-2 border-[#d8e7e2] bg-white px-4 py-3.5 text-[16px] outline-none transition placeholder:text-[#9aada8] focus:border-[#187864]"/></label>}{serverError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{serverError}</p>}{confirmation && <p role="status" className="rounded-xl bg-[#e8f6ef] p-3 text-sm font-semibold text-[#1b684f]">{confirmation}</p>}<button disabled={saving} className="mt-2 flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#187864] px-5 text-[17px] font-bold text-white disabled:opacity-60">{saving ? 'Creating your account…' : <>Create my account <ArrowRight size={19}/></>}</button><p className="flex justify-center gap-1.5 text-center text-xs text-[#718b83]"><ShieldCheck size={15} className="shrink-0 text-[#187864]"/> Your details are private and secure.</p></form><Link href="/login-help-finder" className="mt-7 block text-center font-bold text-[#187864] hover:underline">Already have an account? Sign in</Link></div></section></main>
}
