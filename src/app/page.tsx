'use client'

import { useState } from 'react'
import {
  ArrowRight, Check, ChevronDown, Clock3, Heart, Languages, Menu, MessageCircle,
  Phone, ShieldCheck, Sparkles, Star, UsersRound, X, Zap
} from 'lucide-react'

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
  const [requestOpen, setRequestOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [request, setRequest] = useState('')
  const [sent, setSent] = useState(false)
  const [language, setLanguage] = useState('EN')

  const submit = () => { if (request.trim()) { setSent(true); setTimeout(() => { setSent(false); setRequestOpen(false); setRequest('') }, 1800) } }

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
        <div className="hidden items-center gap-3 md:flex">
          <button onClick={() => setLanguage(language === 'EN' ? 'FR' : 'EN')} className="flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[#47645f] hover:bg-[#eff7f4]" aria-label="Change language"><Languages size={18}/>{language}<ChevronDown size={15}/></button>
          <button onClick={() => setRequestOpen(true)} className="rounded-xl bg-[#187864] px-5 py-3 text-sm font-bold text-white shadow-[0_5px_12px_rgba(24,120,100,.2)] transition hover:bg-[#126653]">Request help</button>
        </div>
        <button className="grid h-11 w-11 place-items-center rounded-xl bg-[#eff7f4] md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open navigation">{menuOpen ? <X/> : <Menu/>}</button>
      </header>
      {menuOpen && <div className="mx-5 rounded-2xl border border-[#dbe9e4] bg-white p-4 shadow-lg md:hidden"><div className="grid gap-2 text-center font-semibold"><a href="#how">How it works</a><a href="#safety">Safety</a><button onClick={() => setRequestOpen(true)} className="mt-2 rounded-xl bg-[#187864] p-3 text-white">Request help</button></div></div>}

      <section id="top" className="relative mx-auto max-w-[1240px] px-5 pb-16 pt-12 lg:px-8 lg:pb-24 lg:pt-20" aria-labelledby="hero-title">
        <div className="absolute left-[-10%] top-20 -z-10 h-72 w-72 rounded-full bg-[#dcefe8] blur-3xl opacity-65"/>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-[640px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e7f5ef] px-4 py-2 text-sm font-bold text-[#187864]"><span className="h-2 w-2 rounded-full bg-[#48af7c]"/> Kind help, close to home</div>
            <h1 id="hero-title" className="max-w-[680px] text-[47px] font-extrabold leading-[1.08] tracking-[-.055em] text-[#173f39] sm:text-[64px]">A helping hand is <span className="text-[#e87d4e]">just around</span> the corner.</h1>
            <p className="mt-6 max-w-[570px] text-[19px] leading-8 text-[#5b7771]">Neighbourly connects you with trusted people nearby for everyday help — simply, safely, and on your terms.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><button onClick={() => setRequestOpen(true)} className="group flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[#187864] px-6 text-[17px] font-bold text-white shadow-[0_8px_16px_rgba(24,120,100,.22)] transition hover:-translate-y-0.5 hover:bg-[#126653]">I need some help <ArrowRight className="transition group-hover:translate-x-1" size={20}/></button><a href="#community" className="flex min-h-14 items-center justify-center gap-3 rounded-xl border-2 border-[#c9ddd7] bg-white px-6 text-[17px] font-bold text-[#28554d] transition hover:border-[#187864]">I want to help <Heart size={19} fill="currentColor" className="text-[#e87d4e]"/></a></div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#59736d]"><span className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#187864]"/> Verified neighbours</span><span className="flex items-center gap-2"><Languages size={18} className="text-[#187864]"/> 4 languages</span><span className="flex items-center gap-2"><Clock3 size={18} className="text-[#187864]"/> Help when you need it</span></div>
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

      <section id="main" className="border-y border-[#e3eeea] bg-[#f4f9f7] py-16" aria-labelledby="help-title"><div className="mx-auto max-w-[1240px] px-5 lg:px-8"><div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-bold uppercase tracking-[.12em] text-[#e07b4c]">Everyday help</p><h2 id="help-title" className="text-4xl font-extrabold tracking-[-.04em]">What can we help with?</h2></div><button onClick={() => setRequestOpen(true)} className="flex items-center gap-2 font-bold text-[#187864] hover:underline">See all ways to get help <ArrowRight size={18}/></button></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map((item) => <button key={item.title} onClick={() => {setRequest(item.title);setRequestOpen(true)}} className="group flex items-center gap-4 rounded-2xl border border-[#dfebe7] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#9ac6b8] hover:shadow-md"><span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl ${item.color}`}>{item.icon}</span><span><span className="block text-[17px] font-extrabold text-[#214a42]">{item.title}</span><span className="mt-1 block text-sm text-[#68807a]">{item.note}</span></span><ArrowRight className="ml-auto text-[#9db7b0] transition group-hover:translate-x-1 group-hover:text-[#187864]" size={20}/></button>)}</div></div></section>

      <section id="how" className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="mb-3 text-sm font-bold uppercase tracking-[.12em] text-[#e07b4c]">Simple by design</p><h2 className="text-4xl font-extrabold leading-tight tracking-[-.045em]">Getting help should feel easy.</h2><p className="mt-5 max-w-sm text-[17px] leading-7 text-[#66817b]">Tell us what you need in your own words. We&apos;ll take care of finding the right person nearby.</p><button onClick={() => setRequestOpen(true)} className="mt-7 flex items-center gap-2 rounded-xl bg-[#187864] px-5 py-3 font-bold text-white">Get started <ArrowRight size={18}/></button></div><div className="grid gap-4 md:grid-cols-3">{[["01","Tell us", "Speak or type what you need. Our friendly AI makes it simple."],["02","Meet your match", "We find a verified helper who is nearby and ready."],["03","Feel supported", "Stay in touch, track your request, and rate your experience."]].map(([num,title,copy])=><div key={num} className="rounded-2xl border border-[#dfece7] p-6"><span className="text-4xl font-extrabold text-[#d2e8e0]">{num}</span><h3 className="mt-12 text-xl font-extrabold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#69817b]">{copy}</p></div>)}</div></div></section>

      <section id="community" className="bg-[#174d43] py-20 text-white"><div className="mx-auto grid max-w-[1240px] gap-12 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div><div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-[#c4e5d9]"><UsersRound size={17}/> Our community</div><h2 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-.045em]">Good people are already close by.</h2><p className="mt-5 max-w-sm text-[17px] leading-7 text-[#c5dcd6]">Our helpers are local, rated by neighbours, and carefully verified before they join.</p><a href="#safety" className="mt-7 inline-flex items-center gap-2 font-bold text-[#c5e8dc] hover:text-white">How we keep you safe <ArrowRight size={18}/></a></div><div className="grid gap-3 sm:grid-cols-3">{volunteers.map(v => <div key={v.name} className="rounded-2xl bg-white p-4 text-[#214a42] shadow-lg"><div className={`grid h-14 w-14 place-items-center rounded-full text-sm font-extrabold ${v.color}`}>{v.initials}</div><p className="mt-4 font-extrabold">{v.name}</p><p className="mt-1 text-xs text-[#6a817b]">{v.role}</p><div className="mt-5 border-t pt-3"><div className="flex items-center gap-1 text-xs font-bold"><Star size={14} fill="#e8a54a" className="text-[#e8a54a]"/>{v.rating}<span className="ml-auto text-[#6c857e]">{v.distance}</span></div></div><div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#187864]"><ShieldCheck size={14}/> Verified</div></div>)}</div></div></section>

      <section id="safety" className="mx-auto max-w-[1000px] px-5 py-20 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e7f5ef] text-[#187864]"><ShieldCheck size={29}/></span><h2 className="mt-5 text-4xl font-extrabold tracking-[-.04em]">Help with heart. Safety from the start.</h2><p className="mx-auto mt-4 max-w-2xl text-[17px] leading-7 text-[#66817b]">From identity checks to emergency contacts, every part of Neighbourly is designed to help you feel confident and in control.</p><div className="mt-10 grid gap-3 sm:grid-cols-3 text-left">{[["Verified people", "Every helper completes an identity check."],["Private messages", "Keep conversations safe and secure."],["You&apos;re in control", "Choose your helper and share only what&apos;s needed."]].map(([t,c])=><div key={t} className="rounded-2xl bg-[#f4f9f7] p-5"><Check className="text-[#187864]"/><h3 className="mt-4 font-extrabold">{t}</h3><p className="mt-2 text-sm leading-6 text-[#69817b]">{c}</p></div>)}</div></section>

      <footer className="border-t border-[#e0ebe7] bg-white"><div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-6 px-5 py-8 text-sm text-[#6a817b] sm:flex-row lg:px-8"><div className="flex items-center gap-2 font-bold text-[#214a42]"><Heart size={18} fill="#187864" className="text-[#187864]"/> Neighbourly Luxembourg</div><div className="flex flex-wrap gap-5"><a href="#safety">Safety centre</a><a href="#how">How it works</a><a href="mailto:hello@neighbourly.lu">Contact us</a></div><p>© 2026 Neighbourly</p></div></footer>

      <button onClick={() => setRequestOpen(true)} className="fixed bottom-5 right-5 z-20 grid h-14 w-14 place-items-center rounded-full bg-[#e97e4f] text-white shadow-xl transition hover:scale-105" aria-label="Request help"><MessageCircle size={24}/></button>

      {requestOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#123d35]/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="request-title"><div className="w-full max-w-[570px] animate-slide-up rounded-[28px] bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2 text-sm font-bold text-[#e07b4c]"><Sparkles size={17}/> AI-assisted request</div><h2 id="request-title" className="mt-2 text-3xl font-extrabold tracking-[-.04em]">How can we help?</h2></div><button onClick={() => setRequestOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl bg-[#f2f7f5]" aria-label="Close"><X size={20}/></button></div>{sent ? <div className="mt-8 rounded-2xl bg-[#e8f6ef] p-7 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#187864] text-white"><Check size={30}/></span><h3 className="mt-4 text-xl font-extrabold">Your request is on its way!</h3><p className="mt-2 text-[#55726a]">We&apos;re finding a trusted helper near you.</p></div> : <><p className="mt-4 text-[#66817b]">Tell us in your own words. You can write in English, French, German or Luxembourgish.</p><div className="mt-5 rounded-2xl border-2 border-[#d7e6e1] p-1 focus-within:border-[#187864]"><textarea autoFocus value={request} onChange={e=>setRequest(e.target.value)} placeholder="For example: I need help collecting my prescription tomorrow afternoon..." className="h-32 w-full resize-none rounded-xl p-4 text-[16px] outline-none placeholder:text-[#91a7a0]"/><div className="flex items-center justify-between px-3 pb-2"><span className="flex items-center gap-1.5 text-xs font-semibold text-[#187864]"><Zap size={14}/> We&apos;ll understand the details</span><button className="text-xs font-bold text-[#5a756e]"><Phone size={14} className="mr-1 inline"/> Prefer to call?</button></div></div><div className="mt-4 flex flex-wrap gap-2">{['Shopping', 'A ride', 'Home help', 'A friendly chat'].map(q=><button onClick={()=>setRequest(q)} key={q} className="rounded-full bg-[#f1f7f5] px-3 py-2 text-sm font-semibold text-[#476b63] hover:bg-[#dff0e9]">{q}</button>)}</div><button onClick={submit} disabled={!request.trim()} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#187864] py-4 text-[17px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-45">Find me a helper <ArrowRight size={19}/></button><p className="mt-3 flex justify-center gap-1.5 text-center text-xs text-[#778e87]"><ShieldCheck size={15} className="text-[#187864]"/> Your request is private and secure.</p></>}</div></div>}
    </main>
  )
}
