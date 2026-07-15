'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, Heart, ShieldCheck } from 'lucide-react'

type Fields = { name: string; phoneNumber: string; timeAvailableForWork: string; pay: string; address: string }
const initial: Fields = { name: '', phoneNumber: '', timeAvailableForWork: '', pay: '', address: '' }

export default function HelperSignupPage() {
  const [fields, setFields] = useState<Fields>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = Object.fromEntries(Object.entries(fields).filter(([, value]) => !value.trim()).map(([key]) => [key, 'This field is required.'])) as Partial<Record<keyof Fields, string>>
    setErrors(nextErrors); setServerError('')
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    try {
      const response = await fetch('/api/helpers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields) })
      if (!response.ok) throw new Error('We could not save your details. Please try again.')
      window.location.assign('/helpers?message=helper-joined')
    } catch (error) { setServerError(error instanceof Error ? error.message : 'Something went wrong.') } finally { setSaving(false) }
  }

  const input = (name: keyof Fields, label: string, placeholder: string) => <label className="block"><span className="mb-2 block font-bold text-[#28554d]">{label}</span><input value={fields[name]} onChange={(e) => setFields({ ...fields, [name]: e.target.value })} placeholder={placeholder} className={`w-full rounded-xl border-2 bg-white px-4 py-3.5 text-[16px] outline-none transition placeholder:text-[#9aada8] focus:border-[#187864] ${errors[name] ? 'border-red-400' : 'border-[#d8e7e2]'}`} aria-invalid={Boolean(errors[name])}/>{errors[name] && <span className="mt-1.5 block text-sm font-semibold text-red-600">{errors[name]}</span>}</label>

  return <main className="min-h-screen bg-[#f4f9f7] text-[#183d38]"><header className="mx-auto flex max-w-[1000px] items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#187864] text-white"><Heart size={22} fill="currentColor"/></span><span className="text-xl font-extrabold tracking-[-.04em]">Neighbourly<span className="text-[#de7c4d]">.</span></span></Link><Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#47716a]"><ArrowLeft size={17}/> Back home</Link></header><section className="mx-auto max-w-[720px] px-5 pb-16 pt-10"><div className="rounded-[28px] border border-[#dceae5] bg-white p-6 shadow-sm sm:p-10"><div className="mb-7 grid h-14 w-14 place-items-center rounded-2xl bg-[#e7f5ef] text-[#187864]"><Heart size={28} fill="currentColor"/></div><p className="font-bold uppercase tracking-[.12em] text-sm text-[#e07b4c]">Join the community</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em]">Offer a helping hand</h1><p className="mt-4 text-[17px] leading-7 text-[#678079]">Share a few details so nearby neighbours can find the right kind of help.</p><form className="mt-8 grid gap-5" onSubmit={submit}>{input('name', 'Your name', 'For example, Marie Laurent')}{input('phoneNumber', 'Phone number', '+352 …')}{input('timeAvailableForWork', 'When are you available?', 'For example, weekday evenings')}{input('pay', 'Pay', 'For example, Volunteer or €20/hour')}{input('address', 'Your area or address', 'For example, Luxembourg City, Kirchberg')}{serverError && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{serverError}</p>}<button disabled={saving} className="mt-2 flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#187864] px-5 text-[17px] font-bold text-white disabled:opacity-60">{saving ? 'Saving…' : <>Join as a helper <ArrowRight size={19}/></>}</button><p className="flex justify-center gap-1.5 text-center text-xs text-[#718b83]"><ShieldCheck size={15} className="text-[#187864]"/> Your information is only used to connect you with neighbours.</p></form></div></section></main>
}
