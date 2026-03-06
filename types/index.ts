import type { Database } from './supabase'

export interface Coordinates {
    lat: number
    lng: number
}

export interface SearchFilters {
    category?: Database['public']['Enums']['care_type']
    maxDistance: number
    minRate?: number
    maxRate?: number
    experienceYears?: number
    languages?: string[]
    verifiedOnly: boolean
}

export type DbCaregiverResult = Database['public']['Functions']['search_caregivers_nearby']['Returns'][number]

export interface CaregiverResult extends DbCaregiverResult {
    // Add UI specific properties that may not be available from DB yet
    city?: string
    is_online?: boolean
    age?: number
    is_verified?: boolean
}
