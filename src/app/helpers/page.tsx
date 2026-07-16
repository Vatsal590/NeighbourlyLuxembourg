'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Clock3, HandHeart, Heart, MapPin, Phone, Search, ShieldCheck, UsersRound, Wallet } from 'lucide-react'
import { deleteLocalHelper, deleteLocalRequester, getLocalActiveProfile, getLocalHelpers, getLocalRequesters, type ActiveProfile, type LocalHelper, type LocalRequester } from '@/lib/community-local'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/lib/language'
import { services } from '@/lib/services'

type CommunityView = 'helpers' | 'requesters'

export default function HelpersPage() {
  const { t } = useLanguage()
  const [helpers, setHelpers] = useState<LocalHelper[]>([])
  const [requesters, setRequesters] = useState<LocalRequester[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [loadError, setLoadError] = useState('')
  const [view, setView] = useState<CommunityView>('helpers')
  const [activeProfile, setActiveProfile] = useState<ActiveProfile | null>(null)
  const [serviceFilter, setServiceFilter] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setServiceFilter(params.get('service') ?? '')
    setView(params.get('view') === 'requesters' ? 'requesters' : 'helpers')
    const messageKey = params.get('message')
    setMessage(messageKey === 'helper-joined' ? t('savedHelper') : messageKey === 'requester-joined' ? t('savedFinder') : '')
    try {
      setHelpers(getLocalHelpers())
      setRequesters(getLocalRequesters())
      setActiveProfile(getLocalActiveProfile())
    } catch {
      setLoadError('We could not load saved community profiles on this device.')
    } finally {
      setLoading(false)
    }
  }, [t])

  const filteredHelpers = useMemo(() => helpers.filter((helper) => `${helper.address} ${helper.timeAvailableForWork} ${helper.name} ${helper.services?.join(' ') ?? ''}`.toLowerCase().includes(query.toLowerCase()) && (!serviceFilter || helper.services?.some((service) => service === services.find((item) => item.id === serviceFilter)?.name)) && (!languageFilter || helper.languages?.includes(languageFilter))), [helpers, query, serviceFilter, languageFilter])
  const filteredRequesters = useMemo(() => requesters.filter((requester) => `${requester.address} ${requester.description ?? ''} ${requester.name}`.toLowerCase().includes(query.toLowerCase())), [requesters, query])

  const switchView = (next: CommunityView) => {
    setView(next)
    setQuery('')
    window.history.replaceState(null, '', `/helpers?view=${next}`)
  }

  const deleteProfile = (role: 'helper' | 'requester', id: string) => {
    const deleted = role === 'helper' ? deleteLocalHelper(id) : deleteLocalRequester(id)
    if (!deleted) return
    if (role === 'helper') setHelpers(getLocalHelpers())
    else setRequesters(getLocalRequesters())
    setActiveProfile(null)
    setMessage(t('deleted'))
  }

  const pageTitle = view === 'helpers' ? t('helpersNearby') : t('peopleLooking')
  const pageDescription = view === 'helpers' ? t('helperDescription') : t('requesterDescription')

  return <main className="min-h-screen bg-[#f4f9f7] text-[#183d38]">
    <header className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 py-5"><Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#187864] text-white"><Heart size={22} fill="currentColor"/></span><span className="text-xl font-extrabold tracking-[-.04em]">{t('brand')}</span></Link><div className="flex items-center gap-3"><LanguageToggle/><Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#47716a]"><ArrowLeft size={17}/> {t('backHome')}</Link></div></header>
    <section className="mx-auto max-w-[1180px] px-5 pb-20 pt-10"><p className="font-bold uppercase tracking-[.12em] text-sm text-[#e07b4c]">{t('savedCommunity')}</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em] sm:text-5xl">{pageTitle}</h1><p className="mt-4 max-w-2xl text-[17px] leading-7 text-[#678079]">{pageDescription}</p>

      <div className="mt-7 rounded-2xl border border-[#d8e7e2] bg-white p-3 shadow-sm"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div role="tablist" aria-label="Choose a community profile type" className="grid gap-2 sm:flex"><button role="tab" aria-selected={view === 'helpers'} onClick={() => switchView('helpers')} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 font-bold transition ${view === 'helpers' ? 'bg-[#187864] text-white' : 'bg-[#eff7f4] text-[#28554d] hover:bg-[#e1f0eb]'}`}><HandHeart size={19}/> {t('helperTab')} <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">{helpers.length}</span></button><button role="tab" aria-selected={view === 'requesters'} onClick={() => switchView('requesters')} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 font-bold transition ${view === 'requesters' ? 'bg-[#187864] text-white' : 'bg-[#eff7f4] text-[#28554d] hover:bg-[#e1f0eb]'}`}><UsersRound size={19}/> {t('finderTab')} <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs">{requesters.length}</span></button></div><Link href={view === 'helpers' ? '/signup-requester' : '/signup-helper'} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#c9ddd7] px-4 font-bold text-[#28554d] hover:border-[#187864]">{view === 'helpers' ? <>{t('needHelp')} <ArrowRight size={18}/></> : <>{t('wantHelp')} <HandHeart size={18}/></>}</Link></div></div>

      {message && <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#b9decf] bg-[#e8f6ef] p-4 text-[#1b684f]"><ShieldCheck size={22}/><p className="font-bold">{message}</p></div>}
      {loadError && <div role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 font-semibold text-red-700">{loadError}</div>}
      <div className="mt-8 grid max-w-3xl gap-3 md:grid-cols-[1fr_auto_auto]"><div className="flex items-center gap-3 rounded-xl border-2 border-[#d8e7e2] bg-white px-4 focus-within:border-[#187864]"><Search size={20} className="text-[#6e8880]"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={view === 'helpers' ? t('searchHelpers') : t('searchFinders')} className="w-full bg-transparent py-4 text-[16px] outline-none placeholder:text-[#99ada8]"/></div>{view === 'helpers' && <><select aria-label="Filter by service" value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)} className="min-h-14 rounded-xl border-2 border-[#d8e7e2] bg-white px-4 font-bold text-[#28554d]"><option value="">All services</option>{services.map((service) => <option value={service.id} key={service.id}>{service.name}</option>)}</select><select aria-label="Filter by language" value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)} className="min-h-14 rounded-xl border-2 border-[#d8e7e2] bg-white px-4 font-bold text-[#28554d]"><option value="">All languages</option>{['English', 'French', 'German', 'Luxembourgish'].map((language) => <option value={language} key={language}>{language}</option>)}</select></>}</div>

      {loading ? <div className="mt-10 grid place-items-center rounded-2xl bg-white p-14 text-[#66817b]">{t('loading')}</div> : view === 'helpers' ? <HelperList helpers={filteredHelpers} activeProfile={activeProfile} onDelete={deleteProfile} loadError={loadError} /> : <RequesterList requesters={filteredRequesters} activeProfile={activeProfile} onDelete={deleteProfile} loadError={loadError} />}
    </section>
  </main>
}

function HelperList({ helpers, activeProfile, onDelete, loadError }: { helpers: LocalHelper[]; activeProfile: ActiveProfile | null; onDelete: (role: 'helper' | 'requester', id: string) => void; loadError: string }) {
  const { t } = useLanguage()
  if (helpers.length) return <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{helpers.map((helper) => { const isOwn = activeProfile?.role === 'helper' && activeProfile.id === helper.id; return <article key={helper.id} className="rounded-2xl border border-[#dbe9e4] bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#e7f5ef] text-lg font-extrabold text-[#187864]">{helper.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-[#187864]">{isOwn ? t('yourProfile') : <><HandHeart size={15}/> {helper.verificationStatus === 'identity-checked' ? 'Identity checked' : 'Community helper'}</>}</span></div><h2 className="mt-5 text-xl font-extrabold">{helper.name}</h2><p className="mt-2 text-sm font-semibold text-[#58746d]">{helper.services?.join(' · ') || 'Everyday support'}</p><div className="mt-5 grid gap-3 text-sm text-[#59756d]"><p className="flex gap-2"><Clock3 size={18} className="shrink-0 text-[#187864]"/><span><strong className="block text-[#28554d]">{t('available')}</strong>{helper.timeAvailableForWork}</span></p><p className="flex gap-2"><Wallet size={18} className="shrink-0 text-[#187864]"/><span><strong className="block text-[#28554d]">{t('pay')}</strong>{helper.pay}</span></p><p className="flex gap-2"><MapPin size={18} className="shrink-0 text-[#187864]"/><span><strong className="block text-[#28554d]">{t('area')}</strong>{helper.address}</span></p></div>{isOwn ? <OwnProfileActions onDelete={() => onDelete('helper', helper.id)} /> : <div className="mt-6 grid gap-2"><Link href={`/helpers/${helper.id}`} className="flex min-h-12 items-center justify-center rounded-xl border-2 border-[#c9ddd7] px-4 font-bold text-[#28554d]">View helper</Link><Link href={`/book/${helper.id}`} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#187864] px-4 font-bold text-white hover:bg-[#126653]">Request a visit <ArrowRight size={18}/></Link></div>}</article> })}</div>
  if (loadError) return null
  return <EmptyState icon={<HandHeart size={27}/>} title="No helper profile yet." copy="Create a helper profile to list the kind of help you can offer." href="/signup-helper" action="Create a helper profile" />
}

function RequesterList({ requesters, activeProfile, onDelete, loadError }: { requesters: LocalRequester[]; activeProfile: ActiveProfile | null; onDelete: (role: 'helper' | 'requester', id: string) => void; loadError: string }) {
  const { t } = useLanguage()
  if (requesters.length) return <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{requesters.map((requester) => { const isOwn = activeProfile?.role === 'requester' && activeProfile.id === requester.id; return <article key={requester.id} className="rounded-2xl border border-[#dbe9e4] bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#fff1e9] text-lg font-extrabold text-[#de7c4d]">{requester.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-[#de7c4d]">{isOwn ? t('yourProfile') : <><UsersRound size={15}/> {t('helpFinder')}</>}</span></div><h2 className="mt-5 text-xl font-extrabold">{requester.name}</h2><div className="mt-5 grid gap-3 text-sm text-[#59756d]"><p className="flex gap-2"><MapPin size={18} className="shrink-0 text-[#de7c4d]"/><span><strong className="block text-[#28554d]">{t('area')}</strong>{requester.address}</span></p><p className="rounded-xl bg-[#fdf5f0] p-3 leading-6"><strong className="block text-[#28554d]">{t('helpNeeded')}</strong>{requester.description || t('helpNeeded')}</p></div>{isOwn ? <OwnProfileActions onDelete={() => onDelete('requester', requester.id)} accent="orange" /> : <a href={`tel:${requester.phoneNumber.replace(/\s/g, '')}`} className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#de7c4d] px-4 font-bold text-white hover:bg-[#c9683b]"><Phone size={18}/> {t('contact')} {requester.name.split(' ')[0]}</a>}</article> })}</div>
  if (loadError) return null
  return <EmptyState icon={<UsersRound size={27}/>} title="No help finder profile yet." copy="Create a help finder profile to save what you need and appear in this view." href="/signup-requester" action="Create a help finder profile" />
}

function OwnProfileActions({ onDelete, accent = 'green' }: { onDelete: () => void; accent?: 'green' | 'orange' }) {
  const { t } = useLanguage()
  return <div className={`mt-6 rounded-xl p-3 text-sm ${accent === 'orange' ? 'bg-[#fdf5f0] text-[#7b5a49]' : 'bg-[#eff7f4] text-[#446b61]'}`}><p className="font-bold">{t('thisIsYourProfile')}</p><p className="mt-1">{t('phoneHidden')}</p><button onClick={() => { if (window.confirm(t('deleteConfirm'))) onDelete() }} className="mt-3 min-h-10 rounded-lg border border-current px-3 font-bold hover:bg-white">{t('deleteProfile')}</button></div>
}

function EmptyState({ icon, title, copy, href, action }: { icon: React.ReactNode; title: string; copy: string; href: string; action: string }) {
  return <div className="mt-8 rounded-[28px] border border-[#dceae5] bg-white p-10 text-center shadow-sm"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e7f5ef] text-[#187864]">{icon}</span><h2 className="mt-5 text-2xl font-extrabold">{title}</h2><p className="mt-3 text-[#678079]">{copy}</p><Link href={href} className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[#187864] px-5 font-bold text-white">{action}</Link></div>
}
