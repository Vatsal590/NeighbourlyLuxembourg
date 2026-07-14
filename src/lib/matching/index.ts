import { haversineKm } from '@/lib/utils/distance'
import type { Database, LocaleCode } from '@/lib/supabase/types'

export type VolunteerMatch = {
  user_id: string
  distance_km: number
  score: number
  language_score: number
  rating_score: number
  radius_score: number
  reasons: string[]
}

export type MatchingRequest = {
  lat: number
  lng: number
  urgency: 'low' | 'normal' | 'high' | 'critical'
  language: LocaleCode
  category: string
}

export type VolunteerCandidate = {
  user_id: string
  lat: number | null
  lng: number | null
  languages: LocaleCode[]
  service_radius_km: number
  rating_avg: number
  rating_count: number
  completed_count: number
  response_rate: number
  skills: string[]
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
}

const WEIGHTS = { language: 0.35, rating: 0.25, radius: 0.25, response: 0.15 }

function languageScore(needed: LocaleCode, offered: LocaleCode[]): number {
  if (offered.includes(needed)) return 1
  const fallback: Record<LocaleCode, LocaleCode[]> = {
    lbs: ['fr', 'de'],
    fr: ['lbs', 'en'],
    de: ['lbs', 'en'],
    en: ['fr', 'de']
  }
  if ((fallback[needed] ?? []).some((l) => offered.includes(l))) return 0.5
  return 0
}

function ratingScore(avg: number, count: number): number {
  const safeAvg = Math.max(0, Math.min(5, avg || 0))
  const norm = safeAvg / 5
  const confidence = Math.min(1, count / 5)
  return norm * (0.6 + 0.4 * confidence)
}

function radiusScore(distanceKm: number, radiusKm: number): number {
  if (distanceKm <= radiusKm * 0.5) return 1
  if (distanceKm <= radiusKm) return 0.7
  if (distanceKm <= radiusKm * 1.5) return 0.4
  return 0
}

function urgencyBoost(urgency: MatchingRequest['urgency'], responseRate: number): number {
  const base = urgency === 'critical' ? 1.0 : urgency === 'high' ? 0.7 : urgency === 'normal' ? 0.4 : 0.2
  return base * (0.5 + 0.5 * Math.max(0, Math.min(1, responseRate || 0)))
}

export function scoreVolunteer(v: VolunteerCandidate, req: MatchingRequest): VolunteerMatch | null {
  if (!v.lat || !v.lng) return null
  if (v.verification_status !== 'verified' && v.verification_status !== 'pending') return null
  const distance = haversineKm({ lat: req.lat, lng: req.lng }, { lat: v.lat, lng: v.lng })
  if (distance > v.service_radius_km * 1.5) return null
  const lang = languageScore(req.language, v.languages)
  const rating = ratingScore(v.rating_avg, v.rating_count)
  const radius = radiusScore(distance, v.service_radius_km)
  const response = Math.max(0, Math.min(1, v.response_rate || 0))
  const baseScore = WEIGHTS.language * lang + WEIGHTS.rating * rating + WEIGHTS.radius * radius + WEIGHTS.response * response
  const score = baseScore + 0.1 * urgencyBoost(req.urgency, v.response_rate)
  const reasons: string[] = []
  if (lang === 1) reasons.push('Speaks your language')
  else if (lang > 0) reasons.push('Familiar with a related language')
  if (rating >= 0.8) reasons.push('Highly rated')
  if (distance <= v.service_radius_km) reasons.push('Lives nearby')
  if (v.completed_count >= 5) reasons.push('Experienced helper')
  return {
    user_id: v.user_id,
    distance_km: Math.round(distance * 10) / 10,
    score: Math.round(score * 1000) / 1000,
    language_score: lang,
    rating_score: rating,
    radius_score: radius,
    reasons
  }
}

export function rankVolunteers(volunteers: VolunteerCandidate[], req: MatchingRequest): VolunteerMatch[] {
  return volunteers
    .map((v) => scoreVolunteer(v, req))
    .filter((m): m is VolunteerMatch => m !== null)
    .sort((a, b) => b.score - a.score || a.distance_km - b.distance_km)
}
