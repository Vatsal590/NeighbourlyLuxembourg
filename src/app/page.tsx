'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, Check, Clock3, Heart, Menu, MessageCircle, ShieldCheck, Star, UsersRound, X
} from 'lucide-react'
import { getLocalHelpers, getLocalRequester } from '@/lib/community-local'

const categories = [
  { icon: '🛒', title: 'Shopping & errands', note: 'Groceries, pharmacy & more', color: 'bg-orange-50' },
  { icon: '🪴', title: 'Home & garden', note: 'Small jobs around home', color: 'bg-emerald-50' },
  { icon: '💻', title: 'Tech support', note: 'Phones, video calls & devices', color: 'bg-sky-50' },
  { icon: '🚗', title: 'Rides & transport', note: 'Appointments & getting around', color: 'bg-violet-50' },
  { icon: '🐕', title: 'Pet care', note: 'Dog walking & pet help', color: 'bg-amber-50' },
  { icon: '☕', title: 'Company & chats', note: 'A friendly face nearby', color: 'bg-rose-50' },
]

const volunteers = [
  { initials: 'ML', name: 'Marie L.', role: 'Community volunteer', distance: '0.8 km away', rating: '4.9', color: 'bg-[#d7ece5]' },
  { initials: 'DT', name: 'David T.', role: 'Community volunteer', distance: '1.2 km away', rating: '5.0', color: 'bg-[#f6e4c9]' },
  { initials: 'SA', name: 'Sofia A.', role: 'Neighbourhood helper', distance: '1.6 km away', rating: '4.8', color: 'bg-[#d9e6fb]' },
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [savedName, setSavedName] = useState('')

  useEffect(() => {
    const requester = getLocalRequester()
    const helper = getLocalHelpers()[0]
    setSavedName(requester?.name ?? helper?.name ?? '')
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-[#fcfdfc] text-[#183d38]">
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 lg:px-8">
        <a className="flex items-center gap-3" href="#top" aria-label="Neighbourly Luxembourg home">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#187864] text-white shadow-sm"><Heart size={23} fill="currentColor" /></span>
          <span className="text-[22px] font-extrabold tracking-[-0.04em] text-[#17453d]">Neighbourly<span className="text-[#de7c4d]">.</span></span>
        </a>
        <nav className="hidden items-center gap-8 text-[15px] font-semibold text-[#47645f] md:flex">
          <a href="#how" className="hover:text-[#187864]">How it works</a><a href="#community" className="hover:text-[#187864]">Our community</a><a href="#safety" className="hover:text-[#187864]">Safety</a>
        </nav>
        <Link href="/signup-requester" className="hidden rounded-xl bg-[#187864] px-5 py-3 text-sm font-bold text-white shadow-[0_5px_12px_rgba(24,120,100,.2)] transition hover:bg-[#126653] md:block">Request help</Link>
        <button className="grid h-11 w-11 place-items-center rounded-xl bg-[#eff7f4] md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open navigation">{menuOpen ? <X/> : <Menu/>}</button>
      </header>
      {menuOpen && <div className="mx-5 rounded-2xl border border-[#dbe9e4] bg-white p-4 shadow-lg md:hidden"><div className="grid gap-2 text-center font-semibold"><a href="#how">How it works</a><a href="#safety">Safety</a><Link href="/signup-requester" className="rounded-xl bg-[#187864] p-3 text-white">Request help</Link></div></div>}

      <section id="top" className="relative mx-auto max-w-[1240px] px-5 pb-16 pt-12 lg:px-8 lg:pb-24 lg:pt-20" aria-labelledby="hero-title">
        <div className="absolute left-[-10%] top-20 -z-10 h-72 w-72 rounded-full bg-[#dcefe8] blur-3xl opacity-65"/>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-[640px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e7f5ef] px-4 py-2 text-sm font-bold text-[#187864]"><span className="h-2 w-2 rounded-full bg-[#48af7c]"/> {savedName ? `Welcome back, ${savedName.split(' ')[0]}` : 'Kind help, close to home'}</div>
            <h1 id="hero-title" className="max-w-[680px] text-[47px] font-extrabold leading-[1.08] tracking-[-.055em] text-[#173f39] sm:text-[64px]">A helping hand is <span className="text-[#e87d4e]">just around</span> the corner.</h1>
            <p className="mt-6 max-w-[570px] text-[19px] leading-8 text-[#5b7771]">Neighbourly connects you with trusted people nearby for everyday help — simply, safely, and on your terms.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/signup-requester" className="group flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[#187864] px-6 text-[17px] font-bold text-white shadow-[0_8px_16px_rgba(24,120,100,.22)] transition hover:-translate-y-0.5 hover:bg-[#126653]">I need some help <ArrowRight className="transition group-hover:translate-x-1" size={20}/></Link><Link href="/signup-helper" className="flex min-h-14 items-center justify-center gap-3 rounded-xl border-2 border-[#c9ddd7] bg-white px-6 text-[17px] font-bold text-[#28554d] transition hover:border-[#187864]">I want to help <Heart size={19} fill="currentColor" className="text-[#e87d4e]"/></Link></div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#59736d]"><span className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#187864]"/> Verified neighbours</span><span className="flex items-center gap-2"><Clock3 size={18} className="text-[#187864]"/> Help when you need it</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="absolute -right-6 top-7 h-[350px] w-[350px] rounded-full bg-[#dcefe8] sm:h-[420px] sm:w-[420px]"/>
            <div className="relative overflow-hidden rounded-[36px] bg-[#cbe4db] p-5 shadow-[0_24px_50px_rgba(37,86,75,.16)]">
              <div className="relative flex min-h-[390px] flex-col justify-end overflow-hidden rounded-[26px] bg-gradient-to-br from-[#8ec9b8] via-[#c6e4c6] to-[#f0d1a9] p-7">
                <div className="absolute -right-8 top-10 h-36 w-36 rounded-full bg-[#f7e6bc] opacity-75"/><div className="absolute left-10 top-12 h-20 w-20 rounded-full bg-[#f1b47e] opacity-70"/>
                <div className="absolute left-[22%] top-[16%] text-8xl">👵</div><div className="absolute right-[12%] top-[26%] text-8xl">🧑🏽</div><div className="absolute left-[34%] top-[43%] text-6xl">🤝</div>
                <div className="relative rounded-2xl bg-white/94 p-4 shadow-lg backdrop-blur"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#e7f5ef]"><Heart size={20} className="text-[#187864]" fill="currentColor"/></span><div><p className="text-sm font-extrabold">You&apos;re not alone</p><p className="text-xs text-[#66817b]">Your community is here for you.</p></div></div></div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-[#d8e8e2] bg-white p-3.5 shadow-lg"><div className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#fff1e9] text-[#de7c4d]"><ShieldCheck size={21}/></span><div><p className="text-xs font-extrabold">Your safety matters</p><p className="text-[11px] text-[#66817b]">Every helper is verified</p></div></div></div>
          </div>
        </div>
      </section>

      <section id="main" className="border-y border-[#e3eeea] bg-[#f4f9f7] py-16" aria-labelledby="help-title"><div className="mx-auto max-w-[1240px] px-5 lg:px-8"><div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-bold uppercase tracking-[.12em] text-[#e07b4c]">Everyday help</p><h2 id="help-title" className="text-4xl font-extrabold tracking-[-.04em]">What can we help with?</h2></div><Link href="/signup-requester" className="flex items-center gap-2 font-bold text-[#187864] hover:underline">See all ways to get help <ArrowRight size={18}/></Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map((item) => <Link href="/signup-requester" key={item.title} className="group flex items-center gap-4 rounded-2xl border border-[#dfebe7] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#9ac6b8] hover:shadow-md"><span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl ${item.color}`}>{item.icon}</span><span><span className="block text-[17px] font-extrabold text-[#214a42]">{item.title}</span><span className="mt-1 block text-sm text-[#68807a]">{item.note}</span></span><ArrowRight className="ml-auto text-[#9db7b0] transition group-hover:translate-x-1 group-hover:text-[#187864]" size={20}/></Link>)}</div></div></section>

      <section id="how" className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="mb-3 text-sm font-bold uppercase tracking-[.12em] text-[#e07b4c]">Simple by design</p><h2 className="text-4xl font-extrabold leading-tight tracking-[-.045em]">Getting help should feel easy.</h2><p className="mt-5 max-w-sm text-[17px] leading-7 text-[#66817b]">Tell us what you need in your own words. We&apos;ll take care of finding the right person nearby.</p><Link href="/helpers" className="mt-7 flex w-fit items-center gap-2 rounded-xl bg-[#187864] px-5 py-3 font-bold text-white">Find me a helper <ArrowRight size={18}/></Link></div><div className="grid gap-4 md:grid-cols-3">{[["01","Tell us", "Speak or type what you need. Our friendly AI makes it simple."],["02","Meet your match", "We find a verified helper who is nearby and ready."],["03","Feel supported", "Stay in touch, track your request, and rate your experience."]].map(([num,title,copy])=><div key={num} className="rounded-2xl border border-[#dfece7] p-6"><span className="text-4xl font-extrabold text-[#d2e8e0]">{num}</span><h3 className="mt-12 text-xl font-extrabold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#69817b]">{copy}</p></div>)}</div></div></section>

      <section id="community" className="bg-[#174d43] py-20 text-white"><div className="mx-auto grid max-w-[1240px] gap-12 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div><div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-[#c4e5d9]"><UsersRound size={17}/> Our community</div><h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-.045em]">Good people are already close by.</h2><p className="mt-5 max-w-sm text-[17px] leading-7 text-[#c5dcd6]">Our helpers are local, rated by neighbours, and carefully verified before they join.</p><a href="#safety" className="mt-7 inline-flex items-center gap-2 font-bold text-[#c5e8dc] hover:text-white">How we keep you safe <ArrowRight size={18}/></a></div><div className="grid gap-3 sm:grid-cols-3">{volunteers.map(v => <div key={v.name} className="rounded-2xl bg-white p-4 text-[#214a42] shadow-lg"><div className={`grid h-14 w-14 place-items-center rounded-full text-sm font-extrabold ${v.color}`}>{v.initials}</div><p className="mt-4 font-extrabold">{v.name}</p><p className="mt-1 text-xs text-[#6a817b]">{v.role}</p><div className="mt-5 border-t pt-3"><div className="flex items-center gap-1 text-xs font-bold"><Star size={14} fill="#e8a54a" className="text-[#e8a54a]"/>{v.rating}<span className="ml-auto text-[#6c857e]">{v.distance}</span></div></div><div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#187864]"><ShieldCheck size={14}/> Verified</div></div>)}</div></div></section>

      <section id="safety" className="mx-auto max-w-[1000px] px-5 py-20 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e7f5ef] text-[#187864]"><ShieldCheck size={29}/></span><h2 className="mt-5 text-4xl font-extrabold tracking-[-.04em]">Help with heart. Safety from the start.</h2><p className="mx-auto mt-4 max-w-2xl text-[17px] leading-7 text-[#66817b]">From identity checks to emergency contacts, every part of Neighbourly is designed to help you feel confident and in control.</p><div className="mt-10 grid gap-3 sm:grid-cols-3 text-left">{[["Verified people", "Every helper completes an identity check."],["Private messages", "Keep conversations safe and secure."],["You&apos;re in control", "Choose your helper and share only what&apos;s needed."]].map(([t,c])=><div key={t} className="rounded-2xl bg-[#f4f9f7] p-5"><Check className="text-[#187864]"/><h3 className="mt-4 font-extrabold">{t}</h3><p className="mt-2 text-sm leading-6 text-[#69817b]">{c}</p></div>)}</div></section>

      <footer className="border-t border-[#e0ebe7] bg-white"><div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-6 px-5 py-8 text-sm text-[#6a817b] sm:flex-row lg:px-8"><div className="flex items-center gap-2 font-bold text-[#214a42]"><Heart size={18} fill="#187864" className="text-[#187864]"/> Neighbourly Luxembourg</div><div className="flex flex-wrap gap-5"><a href="#safety">Safety centre</a><a href="#how">How it works</a><a href="mailto:hello@neighbourly.lu">Contact us</a></div><p>© 2026 Neighbourly</p></div></footer>

      <Link href="/signup-requester" className="fixed bottom-5 right-5 z-20 grid h-14 w-14 place-items-center rounded-full bg-[#e97e4f] text-white shadow-xl transition hover:scale-105" aria-label="Request help"><MessageCircle size={24}/></Link>
    </main>
  )
}
