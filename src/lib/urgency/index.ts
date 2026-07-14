import { getOpenAIClient } from '@/lib/openai/client'
import { URGENCY_LEVELS, URGENCY_KEYWORDS, URGENT_TRIGGERS, type Urgency } from '@/lib/constants'
import { withTimeout, retry, type Result, ok, err } from '@/lib/utils'

export function heuristicUrgency(text: string): Urgency {
  const t = text.toLowerCase()
  for (const trigger of URGENT_TRIGGERS) {
    if (t.includes(trigger)) return 'critical'
  }
  // Find the highest urgency keyword present
  let best: Urgency = 'normal'
  const rank: Record<Urgency, number> = { low: 0, normal: 1, high: 2, critical: 3 }
  for (const [kw, u] of Object.entries(URGENCY_KEYWORDS)) {
    if (t.includes(kw) && rank[u] > rank[best]) best = u
  }
  return best
}

export async function assessUrgency(text: string, locale: 'en' | 'fr' | 'de' | 'lbs' = 'en'): Promise<Result<{ urgency: Urgency; reasons: string[]; emergency: boolean; shouldCallEmergency: boolean; explanation: string }, Error>> {
  const ai = getOpenAIClient()
  const fallback: { urgency: Urgency; reasons: string[]; emergency: boolean; shouldCallEmergency: boolean; explanation: string } = {
    urgency: heuristicUrgency(text),
    reasons: ['Local keyword analysis'],
    emergency: heuristicUrgency(text) === 'critical',
    shouldCallEmergency: heuristicUrgency(text) === 'critical',
    explanation: 'Used on-device analysis because AI service is unavailable.'
  }
  if (!ai) return ok(fallback)
  try {
    const completion = await retry(() =>
      withTimeout(
        ai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'You assess urgency for senior-help requests in Luxembourg. Reply with strict JSON: {"urgency":"low|normal|high|critical","reasons":["..."],"emergency":boolean,"should_call_emergency":boolean,"explanation":"..."}. Consider medical, safety, fall, breathing, chest pain, gas leak, fire, flood, locked-out, lost, missing medication as critical/high.'
            },
            { role: 'user', content: `Locale: ${locale}\nText: ${text}` }
          ]
        }),
        15000,
        'openai.urgency'
      ),
      2,
      300
    )
    const content = completion.choices?.[0]?.message?.content ?? '{}'
    let parsed: Record<string, unknown> = {}
    try { parsed = JSON.parse(content) } catch { parsed = {} }
    const urgency = (URGENCY_LEVELS.includes(parsed.urgency as Urgency) ? (parsed.urgency as Urgency) : fallback.urgency)
    return ok({
      urgency,
      reasons: Array.isArray(parsed.reasons) ? (parsed.reasons as string[]).map(String) : fallback.reasons,
      emergency: Boolean(parsed.emergency ?? urgency === 'critical'),
      shouldCallEmergency: Boolean(parsed.should_call_emergency ?? urgency === 'critical'),
      explanation: typeof parsed.explanation === 'string' ? (parsed.explanation as string) : fallback.explanation
    })
  } catch (e) {
    return ok(fallback)
  }
}
