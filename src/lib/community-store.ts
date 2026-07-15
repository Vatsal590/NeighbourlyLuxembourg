export type Helper = {
  id: string
  name: string
  phoneNumber: string
  timeAvailableForWork: string
  pay: string
  address: string
  createdAt: string
}

export type Requester = {
  id: string
  name: string
  phoneNumber: string
  address: string
  description?: string
  createdAt: string
}

const helpers: Helper[] = []
const requesters: Requester[] = []

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const communityStore = {
  listHelpers: () => [...helpers].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  addHelper: (helper: Omit<Helper, 'id' | 'createdAt'>) => {
    const record = { ...helper, id: createId(), createdAt: new Date().toISOString() }
    helpers.unshift(record)
    return record
  },
  addRequester: (requester: Omit<Requester, 'id' | 'createdAt'>) => {
    const record = { ...requester, id: createId(), createdAt: new Date().toISOString() }
    requesters.unshift(record)
    return record
  }
}
