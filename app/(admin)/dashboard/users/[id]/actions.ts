'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function suspendUser(profiloId: string) {
    const supabase = await createClient()

    // Verify caller is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const { data: adminProfile } = await supabase
        .from('profili')
        .select('ruolo')
        .eq('utente_id', user.id)
        .single()

    if (adminProfile?.ruolo !== 'admin') throw new Error('Non autorizzato')

    // Set tipo_profilo to 'sospeso' as a suspension flag
    const { error } = await supabase
        .from('profili')
        .update({ tipo_profilo: 'sospeso' })
        .eq('id', profiloId)

    if (error) throw new Error(`Errore sospensione: ${error.message}`)

    revalidatePath('/dashboard/users')
    revalidatePath(`/dashboard/users/${profiloId}`)
}

export async function unsuspendUser(profiloId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const { data: adminProfile } = await supabase
        .from('profili')
        .select('ruolo')
        .eq('utente_id', user.id)
        .single()

    if (adminProfile?.ruolo !== 'admin') throw new Error('Non autorizzato')

    // Remove suspension
    const { error } = await supabase
        .from('profili')
        .update({ tipo_profilo: null })
        .eq('id', profiloId)

    if (error) throw new Error(`Errore riattivazione: ${error.message}`)

    revalidatePath('/dashboard/users')
    revalidatePath(`/dashboard/users/${profiloId}`)
}

export async function deleteUser(profiloId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const { data: adminProfile } = await supabase
        .from('profili')
        .select('ruolo')
        .eq('utente_id', user.id)
        .single()

    if (adminProfile?.ruolo !== 'admin') throw new Error('Non autorizzato')

    // Delete related rows first (cascade might handle this but be explicit)
    await supabase.from('dettagli_badante').delete().eq('profilo_id', profiloId)
    await supabase.from('dettagli_famiglia').delete().eq('profilo_id', profiloId)
    await supabase.from('documents').delete().eq('profile_id', profiloId)

    const { error } = await supabase
        .from('profili')
        .delete()
        .eq('id', profiloId)

    if (error) throw new Error(`Errore eliminazione: ${error.message}`)

    revalidatePath('/dashboard/users')
}
