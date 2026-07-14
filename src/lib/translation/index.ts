import { getOpenAIClient } from '@/lib/openai/client'
import { withTimeout, retry, type Result, ok, err } from '@/lib/utils'

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'French',
  de: 'German',
  lbs: 'Luxembourgish'
}

export async function translateText(opts: {
  text: string
  to: 'en' | 'fr' | 'de' | 'lbs'
  from?: 'en' | 'fr' | 'de' | 'lbs'
}): Promise<Result<{ translation: string; to: string; from?: string }, Error>> {
  const ai = getOpenAIClient()
  if (!ai) {
    return err(new Error('Translation service unavailable'))
  }
  const target = LOCALE_NAMES[opts.to] ?? 'English'
  const source = opts.from ? LOCALE_NAMES[opts.from] : null
  const sys = source
    ? `You are a careful translator. Translate the user's text from ${source} into ${target}. Preserve tone, register, and any medical or safety-related phrasing. Return ONLY the translation, with no surrounding quotes or commentary.`
    : `You are a careful translator. Detect the source language and translate the user's text into ${target}. Preserve tone, register, and any medical or safety-related phrasing. Return ONLY the translation, with no surrounding quotes or commentary.`

  try {
    const completion = await retry(() =>
      withTimeout(
        ai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0.2,
          messages: [
            { role: 'system', content: sys },
            { role: 'user', content: opts.text }
          ]
        }),
        15000,
        'openai.translate'
      ),
      2,
      300
    )
    const translation = completion.choices?.[0]?.message?.content?.trim() ?? opts.text
    return ok({ translation, to: opts.to, from: opts.from })
  } catch (e) {
    return err(e instanceof Error ? e : new Error('Unknown translation error'))
  }
}

export async function translateBatch(texts: string[], to: 'en' | 'fr' | 'de' | 'lbs') {
  return Promise.all(texts.map((t) => translateText({ text: t, to })))
}
