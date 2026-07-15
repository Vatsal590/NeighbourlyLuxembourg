import { NextResponse } from 'next/server'
import { communityStore } from '@/lib/community-store'

const required = ['name', 'phoneNumber', 'address'] as const

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ error: 'Please provide your details.' }, { status: 400 })

  const missing = required.filter((field) => !String(body[field] ?? '').trim())
  if (missing.length) return NextResponse.json({ error: 'Please complete all required fields.', fields: missing }, { status: 400 })

  const requester = communityStore.addRequester({
    name: String(body.name).trim(),
    phoneNumber: String(body.phoneNumber).trim(),
    address: String(body.address).trim(),
    description: String(body.description ?? '').trim() || undefined
  })
  return NextResponse.json({ requester }, { status: 201 })
}
