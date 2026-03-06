export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: Database['public']['Enums']['user_role']
          first_name: string
          last_name: string
          avatar_url: string | null
          phone: string | null
          city: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: Database['public']['Enums']['user_role']
          first_name: string
          last_name: string
          avatar_url?: string | null
          phone?: string | null
          city?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: Database['public']['Enums']['user_role']
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          phone?: string | null
          city?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      caregiver_profiles: {
        Row: {
          id: string
          bio: string | null
          hourly_rate: number | null
          years_experience: number | null
          languages: string[] | null
          available_now: boolean | null
          rating: number | null
          reviews_count: number | null
          lat: number | null
          lng: number | null
          city: string | null
          address: string | null
          is_online: boolean | null
          driving_license: boolean | null
          car_owner: boolean | null
          pets_allowed: boolean | null
          smoker: boolean | null
          care_types: Database['public']['Enums']['care_type'][] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          bio?: string | null
          hourly_rate?: number | null
          years_experience?: number | null
          languages?: string[] | null
          available_now?: boolean | null
          rating?: number | null
          reviews_count?: number | null
          lat?: number | null
          lng?: number | null
          city?: string | null
          address?: string | null
          is_online?: boolean | null
          driving_license?: boolean | null
          car_owner?: boolean | null
          pets_allowed?: boolean | null
          smoker?: boolean | null
          care_types?: Database['public']['Enums']['care_type'][] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bio?: string | null
          hourly_rate?: number | null
          years_experience?: number | null
          languages?: string[] | null
          available_now?: boolean | null
          rating?: number | null
          reviews_count?: number | null
          lat?: number | null
          lng?: number | null
          city?: string | null
          address?: string | null
          is_online?: boolean | null
          driving_license?: boolean | null
          car_owner?: boolean | null
          pets_allowed?: boolean | null
          smoker?: boolean | null
          care_types?: Database['public']['Enums']['care_type'][] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_caregivers_nearby: {
        Args: {
          search_lat?: number
          search_lng?: number
          max_distance?: number
          p_care_type?: Database['public']['Enums']['care_type']
          min_rate?: number
          max_rate?: number
          min_experience?: number
          req_languages?: string[]
        }
        Returns: {
          id: string
          first_name: string
          last_name: string
          avatar_url: string | null
          bio: string | null
          hourly_rate: number | null
          years_experience: number | null
          languages: string[] | null
          available_now: boolean | null
          rating: number | null
          reviews_count: number | null
          care_types: Database['public']['Enums']['care_type'][] | null
          lat: number | null
          lng: number | null
          distance: number
        }[]
      }
    }
    Enums: {
      care_type: "badante" | "colf" | "babysitter" | "oss"
      user_role: "caregiver" | "family"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
