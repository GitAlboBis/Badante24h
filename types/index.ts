import type { Database } from './supabase'

/* ── Coordinates ── */
export interface Coordinates {
    lat: number
    lng: number
}

/* ── Derived table row types ── */
export type Profilo = Database['public']['Tables']['profili']['Row']
export type DettagliBadante = Database['public']['Tables']['dettagli_badante']['Row']
export type DettagliFamiglia = Database['public']['Tables']['dettagli_famiglia']['Row']

/** Enum: ruolo utente */
export type RuoloUtente = Database['public']['Enums']['ruolo_utente']

/** Result row returned by the `cerca_badanti_vicine` RPC */
export type CercaBadantiResult =
    Database['public']['Functions']['cerca_badanti_vicine']['Returns'][number]

/** Filter categories shown in the Discovery chip bar */
export type RuoloFilter = 'Tutti' | 'Badante' | 'Badante 24h' | 'Babysitter'

/** Zustand store shape for Discovery filters */
export interface FiltersState {
    ruolo: RuoloFilter
    radius_km: number
    solo_verificati: boolean
    lat: number | null
    lng: number | null
    setRuolo: (r: RuoloFilter) => void
    setRadius: (km: number) => void
    toggleVerificati: () => void
    setCoordinates: (lat: number, lng: number) => void
    resetFilters: () => void
}
