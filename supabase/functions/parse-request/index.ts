// Supabase Edge Function: parse-request
// POST { text: string, locale: string }
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!

const CATEGORIES = ['groceries','pharmacy','dog_walking','gardening','lawn_mowing','heavy_lifting','tech_support','medical_companion','friendly_visit','translation','home_maintenance','transport']
const URGENCIES = ['low','normal','high','critical']

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  try {
    const { text, locale = 'en' } = (await req.json()) as { text: string; locale?: string }
    if (!text) return new Response(JSON.stringify({ error: 'text required' }), { status: 400 })
    const sys = `You classify Luxembourg senior-help requests. Always return valid JSON with keys: title (4-120 chars), description (8-2000 chars), category (one of: ${CATEGORIES.join(',')}), urgency (one of: ${URGENCIES.join(',')}), summary (1-2 sentences), flags (string array, e.g. "medical","safety","urgent"), language (one of en,fr,de,lbs). Do not add any text outside the JSON.`
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'authorization': `Bearer ${OPENAI_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: `Locale hint: ${locale}\nRequest: ${text}` }
        ]
      })
    })
    if (!r.ok) return new Response(JSON.stringify({ error: 'upstream' }), { status: 502, headers: { 'content-type': 'application/json' } })
    const j = await r.json() as { choices: { message: { content: string } }[] }
    let parsed: Record<string, unknown> = {}
    try { parsed = JSON.parse(j.choices[0].message.content) } catch { parsed = {} }
    return new Response(JSON.stringify({ parsed, locale }), { headers: { 'content-type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
})
