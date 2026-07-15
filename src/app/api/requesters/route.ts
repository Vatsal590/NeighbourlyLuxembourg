import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'Create an account through the help finder signup page.' }, { status: 410 })
}
