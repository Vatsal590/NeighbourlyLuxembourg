export const SITE = {
  name: 'Neighbourly Luxembourg',
  shortName: 'Neighbourly',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  emergencyPhone: process.env.EMERGENCY_PHONE ?? '112',
  description:
    'A community assistance platform connecting senior citizens in Luxembourg with trusted volunteers.'
} as const

export const ROLES = ['senior', 'volunteer', 'family', 'admin'] as const
export type Role = (typeof ROLES)[number]

export const REQUEST_STATUSES = [
  'draft', 'pending', 'matched', 'accepted', 'in_progress', 'completed', 'cancelled', 'reported', 'escalated'
] as const
export type RequestStatus = (typeof REQUEST_STATUSES)[number]

export const URGENCY_LEVELS = ['low', 'normal', 'high', 'critical'] as const
export type Urgency = (typeof URGENCY_LEVELS)[number]

export const CATEGORIES = [
  { value: 'groceries', icon: 'shopping-cart' },
  { value: 'pharmacy', icon: 'pill' },
  { value: 'dog_walking', icon: 'dog' },
  { value: 'gardening', icon: 'leaf' },
  { value: 'lawn_mowing', icon: 'scissors' },
  { value: 'heavy_lifting', icon: 'package' },
  { value: 'tech_support', icon: 'smartphone' },
  { value: 'medical_companion', icon: 'heart-pulse' },
  { value: 'friendly_visit', icon: 'coffee' },
  { value: 'translation', icon: 'languages' },
  { value: 'home_maintenance', icon: 'wrench' },
  { value: 'transport', icon: 'car' }
] as const
export type CategoryValue = (typeof CATEGORIES)[number]['value']

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'lbs', label: 'Lëtzebuergesch', flag: '🇱🇺' }
] as const
export type LanguageCode = (typeof LANGUAGES)[number]['code']

export const SUPPORTED_LOCALES = (process.env.SUPPORTED_LOCALES ?? 'en,fr,de,lbs').split(',') as LanguageCode[]
export const DEFAULT_LOCALE = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? 'en') as LanguageCode

export const URGENCY_KEYWORDS: Record<string, Urgency> = {
  'chest pain': 'critical',
  'can\u2019t breathe': 'critical',
  "can't breathe": 'critical',
  'fell down': 'critical',
  'unconscious': 'critical',
  'stroke': 'critical',
  'heart attack': 'critical',
  bleeding: 'critical',
  overdose: 'critical',
  fire: 'critical',
  flood: 'critical',
  'gas leak': 'critical',
  'lost': 'high',
  'locked out': 'high',
  'no medication': 'high',
  'running out': 'high',
  urgent: 'high',
  asap: 'high',
  'as soon as possible': 'high',
  soon: 'normal',
  tomorrow: 'normal',
  next: 'normal',
  this: 'normal',
  whenever: 'low'
}

export const URGENT_TRIGGERS = [
  'chest pain', 'can\u2019t breathe', "can't breathe", 'unconscious', 'stroke', 'fell down',
  'bleeding heavily', 'heart attack', 'gas leak', 'fire', 'flood', 'overdose'
]
