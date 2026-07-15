import { z } from 'zod'
import { CATEGORIES, LANGUAGES, ROLES, URGENCY_LEVELS } from '@/lib/constants'

export const emailSchema = z.string().email().max(254)
export const localeSchema = z.enum(LANGUAGES.map((l) => l.code) as [string, ...string[]])

export const roleSchema = z.enum(ROLES)

export const profileSchema = z.object({
  full_name: z.string().min(2).max(80),
  phone: z.string().regex(/^\+?[0-9 \-()]{6,20}$/).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  locale: localeSchema,
  address: z.string().max(200).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  postal_code: z.string().max(16).optional().nullable(),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
  accessibility_notes: z.string().max(500).optional().nullable(),
  emergency_phone: z.string().regex(/^\+?[0-9 \-()]{6,20}$/).optional().nullable()
})

export const volunteerProfileSchema = profileSchema.extend({
  skills: z.array(z.string()).max(20).default([]),
  languages: z.array(localeSchema).min(1),
  service_radius_km: z.number().min(1).max(50).default(5),
  availability: z
    .object({
      weekdays: z.array(z.string()).default([]),
      weekends: z.boolean().default(true),
      time_windows: z.array(z.string()).default([])
    })
    .partial()
    .default({}),
  verification_status: z.enum(['unverified', 'pending', 'verified', 'rejected']).default('unverified')
})

export const familyLinkSchema = z.object({
  senior_id: z.string().uuid(),
  relationship: z.string().min(1).max(40),
  can_create_requests: z.boolean().default(false),
  can_message: z.boolean().default(true),
  can_view_activity: z.boolean().default(true)
})

export const emergencyContactSchema = z.object({
  name: z.string().min(2).max(80),
  relationship: z.string().min(1).max(40),
  phone: z.string().regex(/^\+?[0-9 \-()]{6,20}$/),
  email: emailSchema.optional().nullable(),
  notify_on_urgent: z.boolean().default(true)
})

export const requestSchema = z.object({
  title: z.string().min(4).max(120),
  description: z.string().min(8).max(2000),
  category: z.enum(CATEGORIES.map((c) => c.value) as [string, ...string[]]),
  urgency: z.enum(URGENCY_LEVELS).default('normal'),
  address: z.string().min(2).max(200),
  city: z.string().min(1).max(80),
  postal_code: z.string().min(1).max(16),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  preferred_time: z.string().datetime().optional().nullable(),
  language: localeSchema,
  accessibility_notes: z.string().max(500).optional().nullable(),
  attachments: z.array(z.string().url()).max(5).optional().default([])
})

export const messageSchema = z.object({
  request_id: z.string().uuid(),
  body: z.string().min(1).max(2000),
  client_id: z.string().uuid().optional()
})

export const ratingSchema = z.object({
  request_id: z.string().uuid(),
  score: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional().nullable()
})

export const reportSchema = z.object({
  target_type: z.enum(['user', 'request', 'message']),
  target_id: z.string().uuid(),
  reason: z.string().min(4).max(80),
  details: z.string().max(1000).optional().nullable()
})

export const parseRequestInputSchema = z.object({
  text: z.string().min(3).max(2000),
  locale: localeSchema.default('en')
})

export const translateInputSchema = z.object({
  text: z.string().min(1).max(4000),
  from: localeSchema.optional(),
  to: localeSchema
})

export const urgencyInputSchema = z.object({
  text: z.string().min(1).max(2000),
  locale: localeSchema.default('en')
})

export type RequestInput = z.infer<typeof requestSchema>
export type MessageInput = z.infer<typeof messageSchema>
export type VolunteerProfileInput = z.infer<typeof volunteerProfileSchema>
export type FamilyLinkInput = z.infer<typeof familyLinkSchema>
export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>
export type ReportInput = z.infer<typeof reportSchema>
export type RatingInput = z.infer<typeof ratingSchema>
