export type LocalHelper = {
  id: string
  name: string
  phoneNumber: string
  timeAvailableForWork: string
  pay: string
  address: string
  createdAt: string
}

export type LocalRequester = {
  id: string
  name: string
  phoneNumber: string
  address: string
  description?: string
  savedAt: string
}

const HELPERS_KEY = 'neighbourly.helpers'
const REQUESTER_KEY = 'neighbourly.requester'

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try { return JSON.parse(window.localStorage.getItem(key) ?? JSON.stringify(fallback)) as T } catch { return fallback }
}

export const getLocalHelpers = () => read<LocalHelper[]>(HELPERS_KEY, [])

type StoredRequester = Omit<LocalRequester, 'id'> & { id?: string }

export const getLocalRequesters = () => {
  const stored = read<StoredRequester | StoredRequester[] | null>(REQUESTER_KEY, null)
  const records = Array.isArray(stored) ? stored : stored ? [stored] : []
  return records.map((requester, index): LocalRequester => ({
    ...requester,
    id: requester.id ?? `${requester.savedAt ?? 'saved'}-${requester.name}-${index}`
  }))
}

export const getLocalRequester = () => getLocalRequesters()[0] ?? null

export function saveLocalHelper(helper: Omit<LocalHelper, 'id' | 'createdAt'>) {
  const record: LocalHelper = { ...helper, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  window.localStorage.setItem(HELPERS_KEY, JSON.stringify([record, ...getLocalHelpers()]))
  return record
}

export function saveLocalRequester(requester: Omit<LocalRequester, 'id' | 'savedAt'>) {
  const record: LocalRequester = { ...requester, id: crypto.randomUUID(), savedAt: new Date().toISOString() }
  window.localStorage.setItem(REQUESTER_KEY, JSON.stringify([record, ...getLocalRequesters()]))
  return record
}
