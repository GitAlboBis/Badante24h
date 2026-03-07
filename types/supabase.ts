export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            profili: {
                Row: {
                    id: string
                    utente_id: string | null
                    ruolo: Database['public']['Enums']['ruolo_utente']
                    tipo_profilo: string | null
                    nome: string | null
                    provincia: string | null
                    data_iscrizione: string | null
                    ultimo_accesso: string | null
                    numero_visite: number | null
                    avatar_url: string | null
                    location: unknown | null
                    verificato: boolean | null
                }
                Insert: {
                    id?: string
                    utente_id?: string | null
                    ruolo: Database['public']['Enums']['ruolo_utente']
                    tipo_profilo?: string | null
                    nome?: string | null
                    provincia?: string | null
                    data_iscrizione?: string | null
                    ultimo_accesso?: string | null
                    numero_visite?: number | null
                    avatar_url?: string | null
                    location?: unknown | null
                    verificato?: boolean | null
                }
                Update: {
                    id?: string
                    utente_id?: string | null
                    ruolo?: Database['public']['Enums']['ruolo_utente']
                    tipo_profilo?: string | null
                    nome?: string | null
                    provincia?: string | null
                    data_iscrizione?: string | null
                    ultimo_accesso?: string | null
                    numero_visite?: number | null
                    avatar_url?: string | null
                    location?: unknown | null
                    verificato?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'profili_utente_id_fkey'
                        columns: ['utente_id']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
                    },
                ]
            }
            dettagli_badante: {
                Row: {
                    profilo_id: string
                    sesso: string | null
                    data_di_nascita: string | null
                    paese_residenza: string | null
                    citta: string | null
                    nazionalita: string | null
                    lingue_parlate: string[] | null
                    lingue_base: string[] | null
                    disponibilita_ore: string | null
                    esperienze_precedenti: boolean | null
                    fuma: boolean | null
                    patente_guida: boolean | null
                    automunita: boolean | null
                    aiuto_persone_disabili: boolean | null
                    aiuto_lavori_domestici: boolean | null
                    lettera_presentazione_famiglie: string | null
                    esperienze_lavorative: string | null
                    compenso_orientativo: string | null
                }
                Insert: {
                    profilo_id: string
                    sesso?: string | null
                    data_di_nascita?: string | null
                    paese_residenza?: string | null
                    citta?: string | null
                    nazionalita?: string | null
                    lingue_parlate?: string[] | null
                    lingue_base?: string[] | null
                    disponibilita_ore?: string | null
                    esperienze_precedenti?: boolean | null
                    fuma?: boolean | null
                    patente_guida?: boolean | null
                    automunita?: boolean | null
                    aiuto_persone_disabili?: boolean | null
                    aiuto_lavori_domestici?: boolean | null
                    lettera_presentazione_famiglie?: string | null
                    esperienze_lavorative?: string | null
                    compenso_orientativo?: string | null
                }
                Update: {
                    profilo_id?: string
                    sesso?: string | null
                    data_di_nascita?: string | null
                    paese_residenza?: string | null
                    citta?: string | null
                    nazionalita?: string | null
                    lingue_parlate?: string[] | null
                    lingue_base?: string[] | null
                    disponibilita_ore?: string | null
                    esperienze_precedenti?: boolean | null
                    fuma?: boolean | null
                    patente_guida?: boolean | null
                    automunita?: boolean | null
                    aiuto_persone_disabili?: boolean | null
                    aiuto_lavori_domestici?: boolean | null
                    lettera_presentazione_famiglie?: string | null
                    esperienze_lavorative?: string | null
                    compenso_orientativo?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'dettagli_badante_profilo_id_fkey'
                        columns: ['profilo_id']
                        isOneToOne: true
                        referencedRelation: 'profili'
                        referencedColumns: ['id']
                    },
                ]
            }
            dettagli_famiglia: {
                Row: {
                    profilo_id: string
                    numero_persone_casa: number | null
                    disponibilita_stanza_privata: boolean | null
                    persone_da_accudire: number | null
                    richiede_esperienze_precedenti: boolean | null
                    fumatori_in_casa: boolean | null
                    persone_disabili_in_casa: boolean | null
                    richiede_aiuto_lavori_domestici: boolean | null
                    lettera_presentazione_badanti: string | null
                    richieste_presentate: string | null
                    condizioni_economiche_proposte: string | null
                }
                Insert: {
                    profilo_id: string
                    numero_persone_casa?: number | null
                    disponibilita_stanza_privata?: boolean | null
                    persone_da_accudire?: number | null
                    richiede_esperienze_precedenti?: boolean | null
                    fumatori_in_casa?: boolean | null
                    persone_disabili_in_casa?: boolean | null
                    richiede_aiuto_lavori_domestici?: boolean | null
                    lettera_presentazione_badanti?: string | null
                    richieste_presentate?: string | null
                    condizioni_economiche_proposte?: string | null
                }
                Update: {
                    profilo_id?: string
                    numero_persone_casa?: number | null
                    disponibilita_stanza_privata?: boolean | null
                    persone_da_accudire?: number | null
                    richiede_esperienze_precedenti?: boolean | null
                    fumatori_in_casa?: boolean | null
                    persone_disabili_in_casa?: boolean | null
                    richiede_aiuto_lavori_domestici?: boolean | null
                    lettera_presentazione_badanti?: string | null
                    richieste_presentate?: string | null
                    condizioni_economiche_proposte?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'dettagli_famiglia_profilo_id_fkey'
                        columns: ['profilo_id']
                        isOneToOne: true
                        referencedRelation: 'profili'
                        referencedColumns: ['id']
                    },
                ]
            }
            conversations: {
                Row: {
                    id: string
                    last_message_at: string | null
                    last_message_text: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    last_message_at?: string | null
                    last_message_text?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    last_message_at?: string | null
                    last_message_text?: string | null
                    created_at?: string | null
                }
                Relationships: []
            }
            conversation_participants: {
                Row: {
                    id: string
                    conversation_id: string
                    profile_id: string
                    unread_count: number | null
                    joined_at: string | null
                }
                Insert: {
                    id?: string
                    conversation_id: string
                    profile_id: string
                    unread_count?: number | null
                    joined_at?: string | null
                }
                Update: {
                    id?: string
                    conversation_id?: string
                    profile_id?: string
                    unread_count?: number | null
                    joined_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'conversation_participants_conversation_id_fkey'
                        columns: ['conversation_id']
                        isOneToOne: false
                        referencedRelation: 'conversations'
                        referencedColumns: ['id']
                    },
                ]
            }
            messages: {
                Row: {
                    id: string
                    conversation_id: string
                    sender_id: string
                    content: string
                    is_read: boolean | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    conversation_id: string
                    sender_id: string
                    content: string
                    is_read?: boolean | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    conversation_id?: string
                    sender_id?: string
                    content?: string
                    is_read?: boolean | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'messages_conversation_id_fkey'
                        columns: ['conversation_id']
                        isOneToOne: false
                        referencedRelation: 'conversations'
                        referencedColumns: ['id']
                    },
                ]
            }
            documents: {
                Row: {
                    id: string
                    profile_id: string
                    file_url: string
                    file_name: string
                    file_type: string | null
                    document_type: string
                    status: Database['public']['Enums']['verification_status'] | null
                    reviewed_by: string | null
                    reviewed_at: string | null
                    review_notes: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    profile_id: string
                    file_url: string
                    file_name: string
                    file_type?: string | null
                    document_type?: string
                    status?: Database['public']['Enums']['verification_status'] | null
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    review_notes?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    profile_id?: string
                    file_url?: string
                    file_name?: string
                    file_type?: string | null
                    document_type?: string
                    status?: Database['public']['Enums']['verification_status'] | null
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    review_notes?: string | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: 'documents_profile_id_fkey'
                        columns: ['profile_id']
                        isOneToOne: false
                        referencedRelation: 'profili'
                        referencedColumns: ['id']
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            cerca_badanti_vicine: {
                Args: {
                    lat_target: number
                    lon_target: number
                    raggio_km?: number
                }
                Returns: {
                    id: string
                    nome: string | null
                    provincia: string | null
                    avatar_url: string | null
                    distanza_km: number
                    sesso: string | null
                    eta: number | null
                    citta: string | null
                    nazionalita: string | null
                    compenso_orientativo: string | null
                }[]
            }
        }
        Enums: {
            ruolo_utente: 'famiglia' | 'badante' | 'admin'
            verification_status: 'pending' | 'approved' | 'rejected'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
