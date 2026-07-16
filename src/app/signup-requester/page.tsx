'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, Heart, ShieldCheck } from 'lucide-react'
import { saveLocalRequester } from '@/lib/community-local'

type Fields = { name: string; phoneNumber: string; address: string; description: string }
const initial: Fields = { name: '', phoneNumber: '', address: '', description: '' }

export default function RequesterSignupPage() {
  const [fields, setFields] = useState<Fields>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')
  const update = (name: keyof Fields, value: string) => setFields({ ...fields, [name]: value })
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const required: (keyof Fields)[] = ['name', 'phoneNumber', 'address']
    const nextErrors = Object.fromEntries(required.filter((key) => !fields[key].trim()).map((key) => [key, 'This field is required.'])) as Partial<Record<keyof Fields, string>>
    setErrors(nextErrors); setServerError('')
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    try { saveLocalRequester(fields); window.location.assign('/helpers?view=requesters&message=requester-joined') } catch { setServerError('We could not save your details on this device. Please check your browser storage settings.') } finally { setSaving(false) }
  }
  const input = (name: keyof Fields, label: string, placeholder: string) => <label className="block"><span className="mb-2 block font-bold text-[#28554d]">{label}</span><input required value={fields[name]} onChange={(e) => update(name, e.target.value)} placeholder={placeholder} className={`w-full rounded-xl border-2 bg-white px-4 py-3.5 text-[16px] outline-none transition placeholder:text-[#9aada8] focus:border-[#187864] ${errors[name] ? 'border-red-400' : 'border-[#d8e7e2]'}`} aria-invalid={Boolean(errors[name])}/>{errors[name] && <span className="mt-1.5 block text-sm font-semibold text-red-600">{errors[name]}</span>}</label>
  return <main className="min-h-screen bg-[#f4f9f7] text-[#183d38]"><header className="mx-auto flex max-w-[1000px] items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#187864] text-white"><Heart size={22} fill="currentColor"/></span><span className="text-xl font-extrabold tracking-[-.04em]">Neighbourly<span className="text-[#de7c4d]">.</span></span></Link><Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#47716a]"><ArrowLeft size={17}/> Back home</Link></header><section className="mx-auto max-w-[720px] px-5 pb-16 pt-10"><div className="rounded-[28px] border border-[#dceae5] bg-white p-6 shadow-sm sm:p-10"><p className="font-bold uppercase tracking-[.12em] text-sm text-[#e07b4c]">Let&apos;s get you connected</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em]">Find help nearby</h1><p className="mt-4 text-[17px] leading-7 text-[#678079]">Tell us what you need. Your details stay saved on this device for your next visit.</p><form className="mt-8 grid gap-5" onSubmit={submit}>{input('name', 'Your name', 'For example, Jean Muller')}{input('phoneNumber', 'Phone number', '+352 …')}{input('address', 'Your area or address', 'For example, Esch-sur-Alzette')}<label className="block"><span className="mb-2 block font-bold text-[#28554d]">What help do you need? <span className="font-normal text-[#6f8982]">(optional)</span></span><textarea value={fields.description} onChange={(e) => update('description', e.target.value)} placeholder="For example, I need help picking up groceries on Tuesday." className="min-h-28 w-full rounded-xl border-2 border-[#d8e7e2] bg-white px-4 py-3.5 text-[16px] outline-none transition placeholder:text-[#9aada8] focus:border-[#187864]"/></label>{serverError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{serverError}</p>}<button disabled={saving} className="mt-2 flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#187864] px-5 text-[17px] font-bold text-white disabled:opacity-60">{saving ? 'Saving…' : <>See nearby helpers <ArrowRight size={19}/></>}</button><p className="flex justify-center gap-1.5 text-center text-xs text-[#718b83]"><ShieldCheck size={15} className="text-[#187864]"/> Saved privately in this browser.</p></form></div></section></main>
}
