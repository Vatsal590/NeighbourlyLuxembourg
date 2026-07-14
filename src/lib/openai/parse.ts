import { getOpenAIClient } from '@/lib/openai/client'
import { CATEGORIES, URGENCY_LEVELS, type CategoryValue, type Urgency } from '@/lib/constants'
import { withTimeout, retry, ok, err, type Result } from '@/lib/utils'

export interface ParsedRequest {
  title: string
  description: string
  category: CategoryValue | 'other'
  urgency: Urgency
  summary: string
  flags: string[]
  language: 'en' | 'fr' | 'de' | 'lbs'
}

const VALID_CATEGORIES = CATEGORIES.map((c) => c.value) as CategoryValue[]

export async function parseHelpRequest(text: string, locale: 'en' | 'fr' | 'de' | 'lbs' = 'en'): Promise<Result<ParsedRequest, Error>> {
  const ai = getOpenAIClient()
  if (!ai) {
    return err(new Error('AI service unavailable'))
  }
  const sys = `You classify Luxembourg senior-help requests. Always return strict JSON with keys: title (4-120 chars), description (8-2000 chars), category (one of: ${VALID_CATEGORIES.join(',')}), urgency (one of: ${URGENCY_LEVELS.join(',')}), summary (1-2 sentences), flags (string array, e.g. "medical","safety","urgent","pet","heavy"), language (one of en,fr,de,lbs). Do not add any text outside the JSON.`
  try {
    const completion = await retry(() =>
      withTimeout(
        ai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0.1,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: sys },
            { role: 'user', content: `Locale hint: ${locale}\nRequest: ${text}` }
          ]
        }),
        15000,
        'openai.parse'
      ),
      2,
      300
    )
    const content = completion.choices?.[0]?.message?.content ?? '{}'
    let parsed: Record<string, unknown> = {}
    try { parsed = JSON.parse(content) } catch { parsed = {} }
    const result: ParsedRequest = {
      title: String(parsed.title ?? '').slice(0, 120),
      description: String(parsed.description ?? text).slice(0, 2000),
      category: (VALID_CATEGORIES.includes(parsed.category as CategoryValue) ? (parsed.category as CategoryValue) : 'other'),
      urgency: (URGENCY_LEVELS.includes(parsed.urgency as Urgency) ? (parsed.urgency as Urgency) : 'normal'),
      summary: String(parsed.summary ?? '').slice(0, 500),
      flags: Array.isArray(parsed.flags) ? (parsed.flags as unknown[]).map(String).slice(0, 10) : [],
      language: (['en', 'fr', 'de', 'lbs'].includes(parsed.language as string) ? (parsed.language as ParsedRequest['language']) : locale)
    }
    return ok(result)
  } catch (e) {
    return err(e instanceof Error ? e : new Error('Unknown parse error'))
  }
}
