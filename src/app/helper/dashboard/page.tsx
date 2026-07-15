import Link from 'next/link'
import { Clock3, Heart, MapPin, ShieldCheck } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/auth/sign-out-button'

export const dynamic = 'force-dynamic'

export default async function HelperDashboardPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return <main className="grid min-h-screen place-items-center p-6 text-center">Supabase must be connected before accounts can be used.</main>
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login-helper')
  const { data: profile } = await supabase.from('profiles').select('full_name, address, phone, role').eq('id', user.id).single()
  if (!profile || profile.role !== 'volunteer') redirect('/login-help-finder')
  const { data: volunteer } = await supabase.from('volunteer_profiles').select('availability, pay_details, verification_status').eq('user_id', user.id).single()
  const availability = typeof volunteer?.availability === 'object' && volunteer.availability !== null && 'time_available_for_work' in volunteer.availability
    ? String((volunteer.availability as Record<string, unknown>).time_available_for_work) : 'Not specified'

  return <main className="min-h-screen bg-[#f4f9f7] text-[#183d38]"><header className="mx-auto flex max-w-[1000px] items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#187864] text-white"><Heart size={22} fill="currentColor"/></span><span className="text-xl font-extrabold tracking-[-.04em]">Neighbourly<span className="text-[#de7c4d]">.</span></span></Link><SignOutButton /></header><section className="mx-auto max-w-[1000px] px-5 pb-20 pt-10"><p className="font-bold uppercase tracking-[.12em] text-sm text-[#e07b4c]">Helper account</p><h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em]">Hello, {profile.full_name.split(' ')[0]}.</h1><p className="mt-4 max-w-2xl text-[17px] leading-7 text-[#678079]">Your account is saved securely. Return here whenever you want to manage your availability.</p><div className="mt-8 grid gap-5 md:grid-cols-[1.25fr_.75fr]"><article className="rounded-[28px] border border-[#dceae5] bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e7f5ef] text-[#187864]"><ShieldCheck size={25}/></span><div><h2 className="text-xl font-extrabold">Verification status</h2><p className="text-sm text-[#678079]">Trust and safety for every neighbour</p></div></div><div className="mt-6 rounded-2xl bg-[#fff7e9] p-5 text-[#705b24]"><p className="font-extrabold">{volunteer?.verification_status === 'verified' ? 'Your profile is verified.' : 'Your profile is awaiting verification.'}</p><p className="mt-2 text-sm leading-6">{volunteer?.verification_status === 'verified' ? 'You are visible in the public helper directory.' : 'We will review your information before making your helper profile public.'}</p></div></article><article className="rounded-[28px] border border-[#dceae5] bg-white p-7 shadow-sm"><h2 className="text-xl font-extrabold">Your profile</h2><div className="mt-5 grid gap-4 text-sm text-[#59756d]"><p className="flex gap-2"><Clock3 size={18} className="shrink-0 text-[#187864]"/><span><strong className="block text-[#28554d]">Available</strong>{availability}</span></p><p className="flex gap-2"><MapPin size={18} className="shrink-0 text-[#187864]"/><span><strong className="block text-[#28554d]">Area</strong>{profile.address ?? 'Not specified'}</span></p></div></article></div></section></main>
}
