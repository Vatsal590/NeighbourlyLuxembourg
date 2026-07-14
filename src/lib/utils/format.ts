export const formatDate = (date: string | Date, locale: string = 'en') =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))

export const formatRelative = (date: string | Date, locale: string = 'en') => {
  const diff = (Date.now() - new Date(date).getTime()) / 1000
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  if (diff < 60) return rtf.format(-Math.round(diff), 'second')
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), 'minute')
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), 'hour')
  if (diff < 604800) return rtf.format(-Math.round(diff / 86400), 'day')
  return formatDate(date, locale)
}

export const formatDistance = (km: number, locale: string = 'en') =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(km) + ' km'

export const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export const truncate = (s: string, n: number) => (s.length <= n ? s : s.slice(0, n - 1) + '\u2026')

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const withTimeout = async <T>(p: Promise<T>, ms: number, label = 'op'): Promise<T> => {
  let t: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, rej) => {
    t = setTimeout(() => rej(new Error(`${label} timed out after ${ms}ms`)), ms)
  })
  try {
    return (await Promise.race([p, timeout])) as T
  } finally {
    if (t) clearTimeout(t)
  }
}

export const retry = async <T>(fn: () => Promise<T>, attempts = 3, baseDelay = 250): Promise<T> => {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try { return await fn() } catch (e) { lastErr = e; await sleep(baseDelay * 2 ** i) }
  }
  throw lastErr
}

export const safeJson = async <T = unknown>(req: Request): Promise<T | null> => {
  try {
    const text = await req.text()
    return text ? (JSON.parse(text) as T) : null
  } catch { return null }
}
