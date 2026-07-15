'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Clock3, Heart, MapPin, Phone, Search, ShieldCheck, Wallet } from 'lucide-react'
type Helper = {
  id: string
  name: string
  phoneNumber: string
  timeAvailableForWork: string
  pay: string
  address: string
}

const messages: Record<string, string> = {
  'helper-joined': 'Thanks for offering to help! You’re now visible to people nearby.',
  'requester-joined': 'We’re finding helpers near you. Here are people who have offered to help.'
}

export default function HelpersPage() {
  const [helpers, setHelpers] = useState<Helper[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    setMessage(messages[new URLSearchParams(window.location.search).get('message') ?? ''] ?? '')
    fetch('/api/helpers').then(async (response) => {
      const data = await response.json() as { helpers?: Helper[]; error?: string }
      if (!response.ok) throw new Error(data.error ?? 'We could not load helpers right now.')
      setHelpers(data.helpers ?? [])
    }).catch((error) => { setHelpers([]); setLoadError(error instanceof Error ? error.message : 'We could not load helpers right now.') }).finally(() => setLoading(false))
  }, [])
  const filtered = useMemo(() => helpers.filter((helper) => `${helper.address} ${helper.timeAvailableForWork} ${helper.name}`.toLowerCase().includes(query.toLowerCase())), [helpers, query])

  return <main className="min-h-screen bg-[#f4f9f7] text-[#183d38]"><header className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#187864] text-white"><Heart size={22} fill="currentColor"/></span><span className="text-xl font-extrabold tracking-[-.04em]">Neighbourly<span className="text-[#de7c4d]">.</span></span></Link><Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#47716a]"><ArrowLeft size={17}/> Back home</Link></header><section className="mx-auto max-w-[1180px] px-5 pb-20 pt-10"><p className="font-bold uppercase tracking-[.12em] text-sm text-[#e07b4c]">Your local community</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em] sm:text-5xl">Helpers nearby</h1><p className="mt-4 max-w-2xl text-[17px] leading-7 text-[#678079]">These helpers are verified before their profiles are shown to the community.</p>{message && <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#b9decf] bg-[#e8f6ef] p-4 text-[#1b684f]"><ShieldCheck size={22}/><p className="font-bold">{message}</p></div>}{loadError && <div role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 font-semibold text-red-700">{loadError}</div>}<div className="mt-8 flex max-w-xl items-center gap-3 rounded-xl border-2 border-[#d8e7e2] bg-white px-4 focus-within:border-[#187864]"><Search size={20} className="text-[#6e8880]"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by area or availability" className="w-full bg-transparent py-4 text-[16px] outline-none placeholder:text-[#99ada8]"/></div>{loading ? <div className="mt-10 grid place-items-center rounded-2xl bg-white p-14 text-[#66817b]">Loading your local helpers…</div> : filtered.length ? <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filtered.map((helper) => <article key={helper.id} className="rounded-2xl border border-[#dbe9e4] bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#e7f5ef] text-lg font-extrabold text-[#187864]">{helper.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-[#187864]"><ShieldCheck size={15}/> Verified helper</span></div><h2 className="mt-5 text-xl font-extrabold">{helper.name}</h2><div className="mt-5 grid gap-3 text-sm text-[#59756d]"><p className="flex gap-2"><Clock3 size={18} className="shrink-0 text-[#187864]"/><span><strong className="block text-[#28554d]">Available</strong>{helper.timeAvailableForWork}</span></p><p className="flex gap-2"><Wallet size={18} className="shrink-0 text-[#187864]"/><span><strong className="block text-[#28554d]">Pay</strong>{helper.pay}</span></p><p className="flex gap-2"><MapPin size={18} className="shrink-0 text-[#187864]"/><span><strong className="block text-[#28554d]">Area</strong>{helper.address}</span></p></div>{helper.phoneNumber ? <a href={`tel:${helper.phoneNumber.replace(/\s/g, '')}`} className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#187864] px-4 font-bold text-white hover:bg-[#126653]"><Phone size={18}/> Contact {helper.name.split(' ')[0]}</a> : <p className="mt-6 text-sm font-semibold text-[#678079]">Contact details available after matching.</p>}</article>)}</div> : !loadError && <div className="mt-8 rounded-[28px] border border-[#dceae5] bg-white p-10 text-center shadow-sm"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e7f5ef] text-[#187864]"><Heart size={27} fill="currentColor"/></span><h2 className="mt-5 text-2xl font-extrabold">No verified helpers are available yet.</h2><p className="mt-3 text-[#678079]">New helper profiles are checked before they are shown here.</p><Link href="/signup-helper" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[#187864] px-5 font-bold text-white">Offer to help</Link></div>}</section></main>
}
