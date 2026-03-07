'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Server Action: Contatta Badante
 * Gets or creates a conversation between the current user and the target caregiver,
 * then redirects to the chat thread.
 */
export async function contattaBadante(profiloId: string) {
    const supabase = await createClient()

    // 1. Get the current authenticated user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?redirect=/profile/' + profiloId)
    }

    // 2. Find the current user's profilo_id
    const { data: profilo } = await supabase
        .from('profili')
        .select('id')
        .eq('utente_id', user.id)
        .single()

    if (!profilo) {
        throw new Error('Profilo non trovato. Completa la registrazione.')
    }

    // 3. Don't allow contacting yourself
    if (profilo.id === profiloId) {
        throw new Error('Non puoi contattare te stesso.')
    }

    // 4. Call the RPC to get or create the conversation
    // Note: get_or_create_conversation is not yet in auto-generated types (supabase.ts).
    // We use a typed workaround until types are regenerated.
    const rpcResult: { data: string | null; error: { message: string } | null } =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as unknown as { rpc: (fn: string, args: Record<string, string>) => Promise<{ data: string | null; error: { message: string } | null }> })
            .rpc('get_or_create_conversation', {
                user_a: profilo.id,
                user_b: profiloId,
            })
    const { data: conversazioneId, error } = rpcResult

    if (error || !conversazioneId) {
        throw new Error('Errore nella creazione della conversazione.')
    }

    // 5. Redirect to the chat
    redirect(`/chat/${conversazioneId}`)
}
