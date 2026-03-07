'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/* ── Step 2: Create base profilo ── */

export async function createProfilo(formData: {
    ruolo: 'badante' | 'famiglia'
    nome: string
    provincia: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Non autenticato')

    // Check if profilo already exists
    const { data: existing } = await supabase
        .from('profili')
        .select('id')
        .eq('utente_id', user.id)
        .single()

    if (existing) {
        return { profiloId: existing.id }
    }

    const { data, error } = await supabase
        .from('profili')
        .insert({
            utente_id: user.id,
            ruolo: formData.ruolo,
            nome: formData.nome,
            provincia: formData.provincia,
        })
        .select('id')
        .single()

    if (error) throw new Error(error.message)

    return { profiloId: data.id }
}

/* ── Step 3a: Create dettagli_badante ── */

export async function createDettagliBadante(
    profiloId: string,
    formData: {
        sesso: string
        data_di_nascita: string
        nazionalita: string
        citta: string
        lingue_parlate: string[]
        disponibilita_ore: string
        esperienze_precedenti: boolean
        fuma: boolean
        patente_guida: boolean
        automunita: boolean
        aiuto_persone_disabili: boolean
        aiuto_lavori_domestici: boolean
        lettera_presentazione_famiglie: string
        compenso_orientativo: string
    }
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    // Verify ownership
    const { data: profilo } = await supabase
        .from('profili')
        .select('id, utente_id')
        .eq('id', profiloId)
        .eq('utente_id', user.id)
        .single()

    if (!profilo) throw new Error('Profilo non trovato')

    // Upsert dettagli
    const { error } = await supabase
        .from('dettagli_badante')
        .upsert({
            profilo_id: profiloId,
            ...formData,
        })

    if (error) throw new Error(error.message)

    redirect('/discover')
}

/* ── Step 3b: Create dettagli_famiglia ── */

export async function createDettagliFamiglia(
    profiloId: string,
    formData: {
        numero_persone_casa: number
        disponibilita_stanza_privata: boolean
        persone_da_accudire: number
        richiede_esperienze_precedenti: boolean
        fumatori_in_casa: boolean
        persone_disabili_in_casa: boolean
        richiede_aiuto_lavori_domestici: boolean
        lettera_presentazione_badanti: string
        condizioni_economiche_proposte: string
    }
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    // Verify ownership
    const { data: profilo } = await supabase
        .from('profili')
        .select('id, utente_id')
        .eq('id', profiloId)
        .eq('utente_id', user.id)
        .single()

    if (!profilo) throw new Error('Profilo non trovato')

    // Upsert dettagli
    const { error } = await supabase
        .from('dettagli_famiglia')
        .upsert({
            profilo_id: profiloId,
            ...formData,
        })

    if (error) throw new Error(error.message)

    redirect('/discover')
}
