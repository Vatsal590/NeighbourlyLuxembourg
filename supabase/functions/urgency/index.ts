import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!
const URGENCIES = ['low','normal','high','critical']

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  try {
    const { text, locale = 'en' } = (await req.json()) as { text: string; locale?: string }
    if (!text) return new Response(JSON.stringify({ error: 'text required' }), { status: 400 })
    const sys = `You assess urgency for senior help requests in Luxembourg. Return valid JSON: {"urgency":"low|normal|high|critical","reasons":["..."], "emergency":boolean, "should_call_emergency":boolean, "explanation":"..."}.`
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'authorization': `Bearer ${OPENAI_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: `Locale: ${locale}\nText: ${text}` }
        ]
      })
    })
    if (!r.ok) return new Response(JSON.stringify({ error: 'upstream' }), { status: 502, headers: { 'content-type': 'application/json' } })
    const j = await r.json() as { choices: { message: { content: string } }[] }
    let parsed: Record<string, unknown> = {}
    try { parsed = JSON.parse(j.choices[0].message.content) } catch { parsed = {} }
    const urg = (parsed.urgency as string) ?? 'normal'
    return new Response(JSON.stringify({ parsed, urgency: URGENCIES.includes(urg) ? urg : 'normal' }), { headers: { 'content-type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
})
