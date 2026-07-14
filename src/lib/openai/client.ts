import OpenAI from 'openai'

let _client: OpenAI | null = null
export function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null
  if (!_client) _client = new OpenAI({ apiKey: key, timeout: 20_000, maxRetries: 2 })
  return _client
}
