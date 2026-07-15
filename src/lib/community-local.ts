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
export const getLocalRequester = () => read<LocalRequester | null>(REQUESTER_KEY, null)

export function saveLocalHelper(helper: Omit<LocalHelper, 'id' | 'createdAt'>) {
  const record: LocalHelper = { ...helper, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  window.localStorage.setItem(HELPERS_KEY, JSON.stringify([record, ...getLocalHelpers()]))
  return record
}

export function saveLocalRequester(requester: Omit<LocalRequester, 'savedAt'>) {
  const record: LocalRequester = { ...requester, savedAt: new Date().toISOString() }
  window.localStorage.setItem(REQUESTER_KEY, JSON.stringify(record))
  return record
}
