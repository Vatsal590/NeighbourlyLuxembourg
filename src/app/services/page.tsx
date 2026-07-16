'use client'

import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { getLocalizedServices } from '@/lib/services'
import { useLanguage } from '@/lib/language'

export default function ServicesPage() {
  const { t } = useLanguage()
  const services = getLocalizedServices(t)
  return <main className="min-h-screen bg-[#f7fbf9] text-[#183d38]"><SiteHeader/><section className="mx-auto max-w-[1180px] px-5 py-14"><p className="font-bold uppercase tracking-[.12em] text-[#df7648]">{t('servicesEyebrow')}</p><h1 className="mt-2 text-5xl font-extrabold tracking-[-.055em]">{t('servicesTitle')}</h1><p className="mt-5 max-w-2xl text-xl leading-8 text-[#58746d]">{t('servicesCopy')}</p><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map((service) => { const Icon = service.icon; return <Link key={service.id} href={`/helpers?service=${service.id}`} className="group rounded-2xl border border-[#dceae5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#98c9b9] hover:shadow-md"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#e7f5ef] text-[#187864]"><Icon size={30}/></span><h2 className="mt-6 text-2xl font-extrabold">{service.name}</h2><p className="mt-3 text-lg leading-7 text-[#607b74]">{service.description}</p><span className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-[#187864]">{t('servicesSeeHelpers')} <ArrowRight size={18}/></span></Link>})}</div><aside className="mt-12 rounded-2xl border border-[#c8e1d7] bg-[#e8f6ef] p-6"><h2 className="text-2xl font-extrabold">{t('servicesUnsure')}</h2><p className="mt-2 text-lg text-[#446b61]">{t('servicesUnsureCopy')}</p><a href="tel:+35227123456" className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#187864] px-5 text-lg font-bold text-white"><Phone size={19}/> {t('callSupport')}: +352 27 12 34 56</a></aside></section></main>
}
