export type Json = string | number | boolean | null | { [k: string]: Json | undefined } | Json[]

export type UserRole = 'senior' | 'volunteer' | 'family' | 'admin'
export type RequestStatus =
  | 'draft' | 'pending' | 'matched' | 'accepted' | 'in_progress'
  | 'completed' | 'cancelled' | 'reported' | 'escalated'
export type Urgency = 'low' | 'normal' | 'high' | 'critical'
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'
export type LocaleCode = 'en' | 'fr' | 'de' | 'lbs'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: UserRole
          locale: LocaleCode
          avatar_url: string | null
          bio: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          lat: number | null
          lng: number | null
          accessibility_notes: string | null
          emergency_phone: string | null
          suspended: boolean
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string; email: string; full_name: string; role: UserRole
        }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      volunteer_profiles: {
        Row: {
          user_id: string
          skills: string[]
          languages: LocaleCode[]
          service_radius_km: number
          availability: Json
          verification_status: VerificationStatus
          verification_notes: string | null
          rating_avg: number
          rating_count: number
          completed_count: number
          response_rate: number
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['volunteer_profiles']['Row']> & { user_id: string }
        Update: Partial<Database['public']['Tables']['volunteer_profiles']['Row']>
      }
      family_links: {
        Row: {
          id: string
          senior_id: string
          family_id: string
          relationship: string
          can_create_requests: boolean
          can_message: boolean
          can_view_activity: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['family_links']['Row'], 'id' | 'created_at'> & {
          id?: string; created_at?: string
        }
        Update: Partial<Database['public']['Tables']['family_links']['Row']>
      }
      emergency_contacts: {
        Row: {
          id: string
          senior_id: string
          name: string
          relationship: string
          phone: string
          email: string | null
          notify_on_urgent: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['emergency_contacts']['Row'], 'id' | 'created_at'> & {
          id?: string; created_at?: string
        }
        Update: Partial<Database['public']['Tables']['emergency_contacts']['Row']>
      }
      requests: {
        Row: {
          id: string
          senior_id: string
          title: string
          description: string
          category: string
          urgency: Urgency
          status: RequestStatus
          address: string
          city: string
          postal_code: string
          lat: number
          lng: number
          preferred_time: string | null
          language: LocaleCode
          accessibility_notes: string | null
          attachments: string[]
          assigned_volunteer_id: string | null
          ai_summary: string | null
          ai_urgency: Urgency | null
          ai_flags: string[]
          created_at: string
          updated_at: string
          matched_at: string | null
          accepted_at: string | null
          completed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['requests']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string; created_at?: string; updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['requests']['Row']>
      }
      request_status_history: {
        Row: {
          id: string
          request_id: string
          from_status: RequestStatus | null
          to_status: RequestStatus
          changed_by: string | null
          note: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['request_status_history']['Row'], 'id' | 'created_at'> & {
          id?: string; created_at?: string
        }
        Update: Partial<Database['public']['Tables']['request_status_history']['Row']>
      }
      messages: {
        Row: {
          id: string
          request_id: string
          sender_id: string
          body: string
          original_locale: LocaleCode | null
          translated: Json
          read_by: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at' | 'translated' | 'read_by'> & {
          id?: string; created_at?: string; translated?: Json; read_by?: string[]
        }
        Update: Partial<Database['public']['Tables']['messages']['Row']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          kind: string
          title: string
          body: string
          link: string | null
          data: Json
          read_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'read_at'> & {
          id?: string; created_at?: string; read_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
      }
      ratings: {
        Row: {
          id: string
          request_id: string
          rater_id: string
          ratee_id: string
          score: number
          comment: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ratings']['Row'], 'id' | 'created_at'> & {
          id?: string; created_at?: string
        }
        Update: Partial<Database['public']['Tables']['ratings']['Row']>
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          target_type: 'user' | 'request' | 'message'
          target_id: string
          reason: string
          details: string | null
          status: 'open' | 'reviewing' | 'resolved' | 'dismissed'
          resolved_by: string | null
          resolved_at: string | null
          resolution: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'status'> & {
          id?: string; created_at?: string; status?: 'open' | 'reviewing' | 'resolved' | 'dismissed'
        }
        Update: Partial<Database['public']['Tables']['reports']['Row']>
      }
      audit_logs: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          target_type: string | null
          target_id: string | null
          meta: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'> & {
          id?: string; created_at?: string
        }
        Update: Partial<Database['public']['Tables']['audit_logs']['Row']>
      }
      verification_records: {
        Row: {
          id: string
          volunteer_id: string
          kind: 'id' | 'background' | 'reference' | 'training'
          status: 'pending' | 'approved' | 'rejected'
          document_url: string | null
          notes: string | null
          reviewer_id: string | null
          created_at: string
          reviewed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['verification_records']['Row'], 'id' | 'created_at'> & {
          id?: string; created_at?: string
        }
        Update: Partial<Database['public']['Tables']['verification_records']['Row']>
      }
      system_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: { key: string; value: Json; updated_at?: string }
        Update: Partial<Database['public']['Tables']['system_settings']['Row']>
      }
    }
    Views: Record<string, never>
    Functions: {
      haversine_km: { Args: { lat1: number; lng1: number; lat2: number; lng2: number }; Returns: number }
      nearby_volunteers: {
        Args: { lat: number; lng: number; radius_km: number; languages: string[] }
        Returns: { user_id: string; distance_km: number }[]
      }
      nearby_requests: {
        Args: { lat: number; lng: number; radius_km: number }
        Returns: { id: string; distance_km: number }[]
      }
    }
    Enums: Record<string, never>
  }
}
