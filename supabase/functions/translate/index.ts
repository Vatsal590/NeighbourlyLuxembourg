// Supabase Edge Function: translate
// POST { text: string, to: 'en'|'fr'|'de'|'lbs', from?: string }
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!
const LOCALE_NAMES: Record<string, string> = { en: 'English', fr: 'French', de: 'German', lbs: 'Luxembourgish' }

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  try {
    const { text, to, from } = (await req.json()) as { text: string; to: string; from?: string }
    if (!text || !to) return new Response(JSON.stringify({ error: 'text and to required' }), { status: 400 })
    const target = LOCALE_NAMES[to] ?? 'English'
    const sys = from
      ? `You are a translator. Translate the user text from ${LOCALE_NAMES[from] ?? from} into ${target}. Preserve meaning, tone, and any medical or safety-related phrasing. Return only the translation, no commentary.`
      : `You are a translator. Detect the source language and translate the user text into ${target}. Preserve meaning, tone, and any medical or safety-related phrasing. Return only the translation, no commentary.`
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'authorization': `Bearer ${OPENAI_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: text }
        ]
      })
    })
    if (!r.ok) {
      const t = await r.text()
      return new Response(JSON.stringify({ error: 'upstream', detail: t }), { status: 502, headers: { 'content-type': 'application/json' } })
    }
    const j = await r.json() as { choices: { message: { content: string } }[] }
    const translation = j.choices?.[0]?.message?.content?.trim() ?? text
    return new Response(JSON.stringify({ translation, to }), { headers: { 'content-type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
})
