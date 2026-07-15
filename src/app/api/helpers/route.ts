import { NextResponse } from 'next/server'
import { communityStore } from '@/lib/community-store'

const required = ['name', 'phoneNumber', 'timeAvailableForWork', 'pay', 'address'] as const

export async function GET() {
  return NextResponse.json({ helpers: communityStore.listHelpers() })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ error: 'Please provide helper details.' }, { status: 400 })

  const missing = required.filter((field) => !String(body[field] ?? '').trim())
  if (missing.length) return NextResponse.json({ error: 'Please complete all required fields.', fields: missing }, { status: 400 })

  const helper = communityStore.addHelper({
    name: String(body.name).trim(),
    phoneNumber: String(body.phoneNumber).trim(),
    timeAvailableForWork: String(body.timeAvailableForWork).trim(),
    pay: String(body.pay).trim(),
    address: String(body.address).trim()
  })
  return NextResponse.json({ helper }, { status: 201 })
}
