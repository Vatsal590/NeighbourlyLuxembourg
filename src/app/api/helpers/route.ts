import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type HelperRow = {
  id: string
  full_name: string
  phone: string | null
  address: string | null
  volunteer_profiles: Array<{
    availability: unknown
    pay_details: string | null
    verification_status: string
  }>
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    return NextResponse.json({ error: 'The helper directory is not connected to Supabase yet.' }, { status: 503 })
  }

  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, address, volunteer_profiles!inner(availability, pay_details, verification_status)')
    .eq('role', 'volunteer')
    .eq('volunteer_profiles.verification_status', 'verified')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'We could not load helpers right now.' }, { status: 500 })
  const helpers = ((data ?? []) as HelperRow[]).map((profile) => {
    const volunteer = profile.volunteer_profiles[0]
    const availability = volunteer?.availability
    const timeAvailableForWork = typeof availability === 'object' && availability !== null && 'time_available_for_work' in availability
      ? String((availability as Record<string, unknown>).time_available_for_work)
      : 'Not specified'
    return {
      id: profile.id,
      name: profile.full_name,
      phoneNumber: profile.phone ?? '',
      timeAvailableForWork,
      pay: volunteer?.pay_details ?? 'Discuss together',
      address: profile.address ?? 'Luxembourg',
      createdAt: ''
    }
  })
  return NextResponse.json({ helpers })
}
