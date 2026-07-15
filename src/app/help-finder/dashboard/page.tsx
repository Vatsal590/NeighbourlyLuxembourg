import Link from 'next/link'
import { Heart, MapPin, Search, ShieldCheck } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/auth/sign-out-button'

export const dynamic = 'force-dynamic'

export default async function HelpFinderDashboardPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return <main className="grid min-h-screen place-items-center p-6 text-center">Supabase must be connected before accounts can be used.</main>
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login-help-finder')
  const { data: profile } = await supabase.from('profiles').select('full_name, address, bio, role').eq('id', user.id).single()
  if (!profile || profile.role !== 'senior') redirect('/login-helper')

  return <main className="min-h-screen bg-[#f4f9f7] text-[#183d38]"><header className="mx-auto flex max-w-[1000px] items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#187864] text-white"><Heart size={22} fill="currentColor"/></span><span className="text-xl font-extrabold tracking-[-.04em]">Neighbourly<span className="text-[#de7c4d]">.</span></span></Link><SignOutButton /></header><section className="mx-auto max-w-[1000px] px-5 pb-20 pt-10"><p className="font-bold uppercase tracking-[.12em] text-sm text-[#e07b4c]">Help finder account</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em]">Hello, {profile.full_name.split(' ')[0]}.</h1><p className="mt-4 max-w-2xl text-[17px] leading-7 text-[#678079]">Your details are saved, so finding help is quicker and easier each time you return.</p><div className="mt-8 grid gap-5 md:grid-cols-[1.25fr_.75fr]"><article className="rounded-[28px] border border-[#dceae5] bg-white p-7 shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e7f5ef] text-[#187864]"><Search size={25}/></span><h2 className="mt-5 text-2xl font-extrabold">Find a trusted helper</h2><p className="mt-3 max-w-lg leading-7 text-[#678079]">Browse verified neighbours who are ready to lend a hand near you.</p><Link href="/helpers" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#187864] px-5 font-bold text-white">Browse helpers</Link></article><article className="rounded-[28px] border border-[#dceae5] bg-white p-7 shadow-sm"><h2 className="text-xl font-extrabold">Your saved details</h2><p className="mt-5 flex gap-2 text-sm text-[#59756d]"><MapPin size={18} className="shrink-0 text-[#187864]"/><span><strong className="block text-[#28554d]">Area</strong>{profile.address ?? 'Not specified'}</span></p>{profile.bio && <p className="mt-5 rounded-2xl bg-[#f4f9f7] p-4 text-sm leading-6 text-[#59756d]">{profile.bio}</p>}<p className="mt-5 flex gap-2 text-sm font-semibold text-[#187864]"><ShieldCheck size={18}/> Your contact information stays private.</p></article></div></section></main>
}
