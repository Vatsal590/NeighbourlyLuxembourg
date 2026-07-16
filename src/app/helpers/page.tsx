'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Clock3, HandHeart, Heart, MapPin, Phone, Search, ShieldCheck, UsersRound, Wallet } from 'lucide-react'
import { getLocalHelpers, getLocalRequesters, type LocalHelper, type LocalRequester } from '@/lib/community-local'

type CommunityView = 'helpers' | 'requesters'

const messages: Record<string, string> = {
  'helper-joined': 'Your helper profile has been saved and is now listed below.',
  'requester-joined': 'Your help finder profile has been saved and is now listed below.'
}

export default function HelpersPage() {
  const [helpers, setHelpers] = useState<LocalHelper[]>([])
  const [requesters, setRequesters] = useState<LocalRequester[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [loadError, setLoadError] = useState('')
  const [view, setView] = useState<CommunityView>('helpers')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setView(params.get('view') === 'requesters' ? 'requesters' : 'helpers')
    setMessage(messages[params.get('message') ?? ''] ?? '')
    try {
      setHelpers(getLocalHelpers())
      setRequesters(getLocalRequesters())
    } catch {
      setLoadError('We could not load saved community profiles on this device.')
    } finally {
      setLoading(false)
    }
  }, [])

  const filteredHelpers = useMemo(() => helpers.filter((helper) => `${helper.address} ${helper.timeAvailableForWork} ${helper.name}`.toLowerCase().includes(query.toLowerCase())), [helpers, query])
  const filteredRequesters = useMemo(() => requesters.filter((requester) => `${requester.address} ${requester.description ?? ''} ${requester.name}`.toLowerCase().includes(query.toLowerCase())), [requesters, query])

  const switchView = (next: CommunityView) => {
    setView(next)
    setQuery('')
    window.history.replaceState(null, '', `/helpers?view=${next}`)
  }

  const pageTitle = view === 'helpers' ? 'Helpers nearby' : 'People looking for help'
  const pageDescription = view === 'helpers'
    ? 'Browse helper profiles saved on this device, or switch roles to create a help finder profile.'
    : 'Browse help finder profiles saved on this device, or switch roles to offer a helping hand.'

  return <main className="min-h-screen bg-[#f4f9f7] text-[#183d38]">
    <header className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#187864] text-white"><Heart size={22} fill="currentColor"/></span><span className="text-xl font-extrabold tracking-[-.04em]">Neighbourly<span className="text-[#de7c4d]">.</span></span></Link><Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#47716a]"><ArrowLeft size={17}/> Back home</Link></header>
    <section className="mx-auto max-w-[1180px] px-5 pb-20 pt-10"><p className="font-bold uppercase tracking-[.12em] text-sm text-[#e07b4c]">Your saved community</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em] sm:text-5xl">{pageTitle}</h1><p className="mt-4 max-w-2xl text-[17px] leading-7 text-[#678079]">{pageDescription}</p>

      <div className="mt-7 rounded-2xl border border-[#d8e7e2] bg-white p-3 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div role="tablist" aria-label="Choose a community profile type" className="grid gap-2 sm:flex"><button role="tab" aria-selected={view === 'helpers'} onClick={() => switchView('helpers')} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 font-bold transition ${view === 'helpers' ? 'bg-[#187864] text-white' : 'bg-[#eff7f4] text-[#28554d] hover:bg-[#e1f0eb]'}`}><HandHeart size={19}/> Helpers <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">{helpers.length}</span></button><button role="tab" aria-selected={view === 'requesters'} onClick={() => switchView('requesters')} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 font-bold transition ${view === 'requesters' ? 'bg-[#187864] text-white' : 'bg-[#eff7f4] text-[#28554d] hover:bg-[#e1f0eb]'}`}><UsersRound size={19}/> Help finders <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">{requesters.length}</span></button></div><Link href={view === 'helpers' ? '/signup-requester' : '/signup-helper'} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#c9ddd7] px-4 font-bold text-[#28554d] hover:border-[#187864]">{view === 'helpers' ? <>I need help <ArrowLeft className="rotate-180" size={18}/></> : <>I want to help <HandHeart size={18}/></>}</Link></div></div>

      {message && <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#b9decf] bg-[#e8f6ef] p-4 text-[#1b684f]"><ShieldCheck size={22}/><p className="font-bold">{message}</p></div>}
      {loadError && <div role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 font-semibold text-red-700">{loadError}</div>}
      <div className="mt-8 flex max-w-xl items-center gap-3 rounded-xl border-2 border-[#d8e7e2] bg-white px-4 focus-within:border-[#187864]"><Search size={20} className="text-[#6e8880]"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={view === 'helpers' ? 'Search by area or availability' : 'Search by area or help needed'} className="w-full bg-transparent py-4 text-[16px] outline-none placeholder:text-[#99ada8]"/></div>

      {loading ? <div className="mt-10 grid place-items-center rounded-2xl bg-white p-14 text-[#66817b]">Loading saved community profiles…</div> : view === 'helpers' ? <HelperList helpers={filteredHelpers} loadError={loadError} /> : <RequesterList requesters={filteredRequesters} loadError={loadError} />}
    </section>
  </main>
}

function HelperList({ helpers, loadError }: { helpers: LocalHelper[]; loadError: string }) {
  if (helpers.length) return <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{helpers.map((helper) => <article key={helper.id} className="rounded-2xl border border-[#dbe9e4] bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#e7f5ef] text-lg font-extrabold text-[#187864]">{helper.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-[#187864]"><HandHeart size={15}/> Helper</span></div><h2 className="mt-5 text-xl font-extrabold">{helper.name}</h2><div className="mt-5 grid gap-3 text-sm text-[#59756d]"><p className="flex gap-2"><Clock3 size={18} className="shrink-0 text-[#187864]"/><span><strong className="block text-[#28554d]">Available</strong>{helper.timeAvailableForWork}</span></p><p className="flex gap-2"><Wallet size={18} className="shrink-0 text-[#187864]"/><span><strong className="block text-[#28554d]">Pay</strong>{helper.pay}</span></p><p className="flex gap-2"><MapPin size={18} className="shrink-0 text-[#187864]"/><span><strong className="block text-[#28554d]">Area</strong>{helper.address}</span></p></div><a href={`tel:${helper.phoneNumber.replace(/\s/g, '')}`} className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#187864] px-4 font-bold text-white hover:bg-[#126653]"><Phone size={18}/> Contact {helper.name.split(' ')[0]}</a></article>)}</div>
  if (loadError) return null
  return <EmptyState icon={<HandHeart size={27}/>} title="No helper profile yet." copy="Create a helper profile to list the kind of help you can offer." href="/signup-helper" action="Create a helper profile" />
}

function RequesterList({ requesters, loadError }: { requesters: LocalRequester[]; loadError: string }) {
  if (requesters.length) return <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{requesters.map((requester) => <article key={requester.id} className="rounded-2xl border border-[#dbe9e4] bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#fff1e9] text-lg font-extrabold text-[#de7c4d]">{requester.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-[#de7c4d]"><UsersRound size={15}/> Help finder</span></div><h2 className="mt-5 text-xl font-extrabold">{requester.name}</h2><div className="mt-5 grid gap-3 text-sm text-[#59756d]"><p className="flex gap-2"><MapPin size={18} className="shrink-0 text-[#de7c4d]"/><span><strong className="block text-[#28554d]">Area</strong>{requester.address}</span></p><p className="rounded-xl bg-[#fdf5f0] p-3 leading-6"><strong className="block text-[#28554d]">Help needed</strong>{requester.description || 'Looking for local everyday help.'}</p></div><a href={`tel:${requester.phoneNumber.replace(/\s/g, '')}`} className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#de7c4d] px-4 font-bold text-white hover:bg-[#c9683b]"><Phone size={18}/> Contact {requester.name.split(' ')[0]}</a></article>)}</div>
  if (loadError) return null
  return <EmptyState icon={<UsersRound size={27}/>} title="No help finder profile yet." copy="Create a help finder profile to save what you need and appear in this view." href="/signup-requester" action="Create a help finder profile" />
}

function EmptyState({ icon, title, copy, href, action }: { icon: React.ReactNode; title: string; copy: string; href: string; action: string }) {
  return <div className="mt-8 rounded-[28px] border border-[#dceae5] bg-white p-10 text-center shadow-sm"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e7f5ef] text-[#187864]">{icon}</span><h2 className="mt-5 text-2xl font-extrabold">{title}</h2><p className="mt-3 text-[#678079]">{copy}</p><Link href={href} className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[#187864] px-5 font-bold text-white">{action}</Link></div>
}
