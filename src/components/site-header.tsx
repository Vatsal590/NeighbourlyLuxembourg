'use client'

import Link from 'next/link'
import { Heart, Menu, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/lib/language'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()
  const links = [{ href: '/services', label: 'Find help' }, { href: '/bookings', label: 'My bookings' }, { href: '/become-helper', label: 'Become a helper' }, { href: '/help', label: 'Help & contact' }]
  return <header className="border-b border-[#e1ece8] bg-white"><div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-5 py-4"><Link href="/" className="flex items-center gap-3" aria-label={`${t('brand')} home`}><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#187864] text-white"><Heart size={23} fill="currentColor"/></span><span className="text-xl font-extrabold tracking-[-.04em] text-[#17453d]">{t('brand')}</span></Link><nav className="hidden items-center gap-5 text-sm font-bold text-[#315a51] lg:flex">{links.map((link) => <Link key={link.href} href={link.href} className="rounded-lg px-2 py-2 hover:text-[#187864]">{link.label}</Link>)}<LanguageToggle/><a href="tel:+35227123456" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#e7f5ef] px-3 text-[#176651]"><Phone size={17}/> Call support</a></nav><div className="flex items-center gap-2 lg:hidden"><LanguageToggle/><button onClick={() => setOpen(!open)} className="grid h-12 w-12 place-items-center rounded-xl bg-[#eff7f4] text-[#28554d]" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X/> : <Menu/>}</button></div></div>{open && <nav className="mx-5 mb-4 grid gap-2 rounded-2xl border border-[#dceae5] bg-[#f8fbfa] p-3 text-center font-bold text-[#28554d] lg:hidden">{links.map((link) => <Link onClick={() => setOpen(false)} key={link.href} href={link.href} className="rounded-xl px-4 py-3 hover:bg-white">{link.label}</Link>)}<a href="tel:+35227123456" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#187864] px-4 text-white"><Phone size={18}/> Call support</a></nav>}</header>
}
