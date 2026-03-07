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

/** Full caregiver profile: profili row with nested dettagli_badante */
export type ProfiloBadanteCompleto = Profilo & {
    dettagli_badante: DettagliBadante | null
}

/** Zustand store: discovery search filters (Italian schema) */
export interface FiltriRicerca {
    lat: number | null
    lng: number | null
    radius_km: number
    ruolo: RuoloFilter
    solo_verificati: boolean
    setFiltri: (partial: Partial<Omit<FiltriRicerca, 'setFiltri' | 'resetFiltri'>>) => void
    resetFiltri: () => void
}

/* ── Chat types ── */
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type ConversationParticipant = Database['public']['Tables']['conversation_participants']['Row']
export type Message = Database['public']['Tables']['messages']['Row']

/* ── Document / KYC types ── */
export type Document = Database['public']['Tables']['documents']['Row']
export type VerificationStatus = Database['public']['Enums']['verification_status']

/** Inbox item: conversation + the other participant's profile info */
export interface ConversationWithOtherUser {
    conversation_id: string
    last_message_text: string | null
    last_message_at: string | null
    unread_count: number | null
    other_user: {
        profilo_id: string
        nome: string | null
        avatar_url: string | null
    }
}

