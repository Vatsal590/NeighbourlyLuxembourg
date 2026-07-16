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

export type ActiveProfile = { role: 'helper' | 'requester'; id: string }

const HELPERS_KEY = 'neighbourly.helpers'
const REQUESTER_KEY = 'neighbourly.requester'
const ACTIVE_PROFILE_KEY = 'neighbourly.active-profile'

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
export const getLocalActiveProfile = () => read<ActiveProfile | null>(ACTIVE_PROFILE_KEY, null)

const setActiveProfile = (profile: ActiveProfile) => window.localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(profile))
const clearActiveProfile = () => window.localStorage.removeItem(ACTIVE_PROFILE_KEY)

export function saveLocalHelper(helper: Omit<LocalHelper, 'id' | 'createdAt'>) {
  const record: LocalHelper = { ...helper, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  window.localStorage.setItem(HELPERS_KEY, JSON.stringify([record, ...getLocalHelpers()]))
  setActiveProfile({ role: 'helper', id: record.id })
  return record
}

export function saveLocalRequester(requester: Omit<LocalRequester, 'id' | 'savedAt'>) {
  const record: LocalRequester = { ...requester, id: crypto.randomUUID(), savedAt: new Date().toISOString() }
  window.localStorage.setItem(REQUESTER_KEY, JSON.stringify([record, ...getLocalRequesters()]))
  setActiveProfile({ role: 'requester', id: record.id })
  return record
}

export function deleteLocalHelper(id: string) {
  const active = getLocalActiveProfile()
  if (!active || active.role !== 'helper' || active.id !== id) return false
  window.localStorage.setItem(HELPERS_KEY, JSON.stringify(getLocalHelpers().filter((helper) => helper.id !== id)))
  clearActiveProfile()
  return true
}

export function deleteLocalRequester(id: string) {
  const active = getLocalActiveProfile()
  if (!active || active.role !== 'requester' || active.id !== id) return false
  window.localStorage.setItem(REQUESTER_KEY, JSON.stringify(getLocalRequesters().filter((requester) => requester.id !== id)))
  clearActiveProfile()
  return true
}
