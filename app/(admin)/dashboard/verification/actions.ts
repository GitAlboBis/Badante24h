'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function reviewDocument(
    documentId: string,
    decision: 'approved' | 'rejected',
    notes?: string
) {
    const supabase = await createClient()

    // Verify caller is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non autenticato')

    const { data: adminProfile } = await supabase
        .from('profili')
        .select('id, ruolo')
        .eq('utente_id', user.id)
        .single()

    if (adminProfile?.ruolo !== 'admin') throw new Error('Non autorizzato')

    // Update document status
    const { error: docError } = await supabase
        .from('documents')
        .update({
            status: decision,
            reviewed_by: adminProfile.id,
            reviewed_at: new Date().toISOString(),
            review_notes: notes ?? null,
        })
        .eq('id', documentId)

    if (docError) throw new Error(`Errore aggiornamento documento: ${docError.message}`)

    // If approved, check if ALL documents for this profile are now approved
    // If so, mark the profile as verificato
    const { data: doc } = await supabase
        .from('documents')
        .select('profile_id')
        .eq('id', documentId)
        .single()

    if (doc && decision === 'approved') {
        const { data: allDocs } = await supabase
            .from('documents')
            .select('status')
            .eq('profile_id', doc.profile_id)

        const allApproved = allDocs?.every((d) => d.status === 'approved')

        if (allApproved) {
            await supabase
                .from('profili')
                .update({ verificato: true })
                .eq('id', doc.profile_id)
        }
    }

    // If rejected, ensure profile is NOT verificato
    if (doc && decision === 'rejected') {
        await supabase
            .from('profili')
            .update({ verificato: false })
            .eq('id', doc.profile_id)
    }

    revalidatePath('/dashboard/verification')
    revalidatePath(`/dashboard/users/${doc?.profile_id}`)
}
