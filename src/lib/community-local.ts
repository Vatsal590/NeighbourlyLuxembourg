export type LocalHelper = {
  id: string
  name: string
  phoneNumber: string
  timeAvailableForWork: string
  pay: string
  address: string
  services?: string[]
  languages?: string[]
  bio?: string
  verificationStatus?: 'pending' | 'identity-checked'
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

export type LocalBooking = {
  id: string
  helperId: string
  helperName: string
  service: string
  date: string
  time: string
  address: string
  notes?: string
  bookedFor: string
  contactName: string
  phoneNumber: string
  createdAt: string
  status: 'requested' | 'confirmed' | 'cancelled'
}

const HELPERS_KEY = 'neighbourly.helpers'
const REQUESTER_KEY = 'neighbourly.requester'
const ACTIVE_PROFILE_KEY = 'neighbourly.active-profile'
const BOOKINGS_KEY = 'neighbourly.bookings'

const demoHelpers: LocalHelper[] = [
  { id: 'demo-marie', name: 'Marie Laurent', phoneNumber: '+352 621 123 456', timeAvailableForWork: 'Weekday mornings and Tuesday afternoons', pay: 'Volunteer or €20/hour', address: 'Luxembourg City, Gare', services: ['Groceries & pharmacy', 'Companionship visits'], languages: ['French', 'English', 'Luxembourgish'], bio: 'I enjoy helping neighbours with errands, a friendly walk and everyday support.', verificationStatus: 'identity-checked', createdAt: '2026-07-01T09:00:00.000Z' },
  { id: 'demo-david', name: 'David Theis', phoneNumber: '+352 621 234 567', timeAvailableForWork: 'Weekday evenings and Saturdays', pay: '€22/hour', address: 'Luxembourg City, Kirchberg', services: ['Technology help', 'Rides & transport'], languages: ['German', 'English', 'French'], bio: 'I can help with phones, video calls and getting to local appointments.', verificationStatus: 'identity-checked', createdAt: '2026-07-02T09:00:00.000Z' },
  { id: 'demo-sofia', name: 'Sofia Alves', phoneNumber: '+352 621 345 678', timeAvailableForWork: 'Monday to Friday, 10:00–16:00', pay: '€20/hour', address: 'Esch-sur-Alzette', services: ['Cleaning & home care', 'Small home tasks'], languages: ['French', 'Portuguese', 'English'], bio: 'I offer calm, practical help around the home and can explain each task clearly.', verificationStatus: 'identity-checked', createdAt: '2026-07-03T09:00:00.000Z' },
]

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback
  try { return JSON.parse(window.localStorage.getItem(key) ?? JSON.stringify(fallback)) as T } catch { return fallback }
}

const isTestProfile = (name: string) => ['h', 'john ag', 'abc'].includes(name.trim().toLowerCase())

export const getLocalHelpers = () => {
  const helpers = read<LocalHelper[]>(HELPERS_KEY, demoHelpers)
  const cleaned = helpers.filter((helper) => !isTestProfile(helper.name))
  if (typeof window !== 'undefined' && cleaned.length !== helpers.length) window.localStorage.setItem(HELPERS_KEY, JSON.stringify(cleaned))
  return cleaned
}

type StoredRequester = Omit<LocalRequester, 'id'> & { id?: string }

export const getLocalRequesters = () => {
  const stored = read<StoredRequester | StoredRequester[] | null>(REQUESTER_KEY, null)
  const records = Array.isArray(stored) ? stored : stored ? [stored] : []
  const requesters = records.map((requester, index): LocalRequester => ({
    ...requester,
    id: requester.id ?? `${requester.savedAt ?? 'saved'}-${requester.name}-${index}`
  }))
  const cleaned = requesters.filter((requester) => !isTestProfile(requester.name))
  if (typeof window !== 'undefined' && cleaned.length !== requesters.length) window.localStorage.setItem(REQUESTER_KEY, JSON.stringify(cleaned))
  return cleaned
}

export const getLocalRequester = () => getLocalRequesters()[0] ?? null
export const getLocalActiveProfile = () => {
  const active = read<ActiveProfile | null>(ACTIVE_PROFILE_KEY, null)
  if (!active || typeof window === 'undefined') return active
  const exists = active.role === 'helper' ? getLocalHelpers().some((helper) => helper.id === active.id) : getLocalRequesters().some((requester) => requester.id === active.id)
  if (!exists) { window.localStorage.removeItem(ACTIVE_PROFILE_KEY); return null }
  return active
}
export const getLocalBookings = () => read<LocalBooking[]>(BOOKINGS_KEY, [])

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

export function saveLocalBooking(booking: Omit<LocalBooking, 'id' | 'createdAt' | 'status'>) {
  const record: LocalBooking = { ...booking, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'requested' }
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify([record, ...getLocalBookings()]))
  return record
}

export function cancelLocalBooking(id: string) {
  const bookings = getLocalBookings()
  const exists = bookings.some((booking) => booking.id === id)
  if (!exists) return false
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings.map((booking) => booking.id === id ? { ...booking, status: 'cancelled' } : booking)))
  return true
}
