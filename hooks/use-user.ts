'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profilo, DettagliBadante, DettagliFamiglia } from '@/types'

export interface UseUserReturn {
    /** Supabase auth user (null while loading or if unauthenticated) */
    user: User | null
    /** The user's `profili` row (null if not yet onboarded) */
    profilo: Profilo | null
    /** Caregiver details (only if ruolo === 'badante') */
    dettagliBadante: DettagliBadante | null
    /** Family details (only if ruolo === 'famiglia') */
    dettagliFamiglia: DettagliFamiglia | null
    /** True while the initial fetch is in progress */
    isLoading: boolean
    /** True if the user has completed onboarding (profilo exists with nome) */
    isOnboarded: boolean
    /** Re-fetch user data */
    refresh: () => Promise<void>
}

export function useUser(): UseUserReturn {
    const supabase = useMemo(() => createClient(), [])

    const [user, setUser] = useState<User | null>(null)
    const [profilo, setProfilo] = useState<Profilo | null>(null)
    const [dettagliBadante, setDettagliBadante] = useState<DettagliBadante | null>(null)
    const [dettagliFamiglia, setDettagliFamiglia] = useState<DettagliFamiglia | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchUserData = useCallback(async () => {
        setIsLoading(true)

        const { data: { user: authUser } } = await supabase.auth.getUser()
        setUser(authUser)

        if (!authUser) {
            setProfilo(null)
            setDettagliBadante(null)
            setDettagliFamiglia(null)
            setIsLoading(false)
            return
        }

        // Fetch profilo
        const { data: profiloData } = await supabase
            .from('profili')
            .select('*')
            .eq('utente_id', authUser.id)
            .single()

        setProfilo(profiloData ?? null)

        if (!profiloData) {
            setDettagliBadante(null)
            setDettagliFamiglia(null)
            setIsLoading(false)
            return
        }

        // Fetch role-specific details
        if (profiloData.ruolo === 'badante') {
            const { data: badanteData } = await supabase
                .from('dettagli_badante')
                .select('*')
                .eq('profilo_id', profiloData.id)
                .single()
            setDettagliBadante(badanteData ?? null)
            setDettagliFamiglia(null)
        } else if (profiloData.ruolo === 'famiglia') {
            const { data: famigliaData } = await supabase
                .from('dettagli_famiglia')
                .select('*')
                .eq('profilo_id', profiloData.id)
                .single()
            setDettagliFamiglia(famigliaData ?? null)
            setDettagliBadante(null)
        }

        setIsLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchUserData()

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user) {
                    fetchUserData()
                } else {
                    setUser(null)
                    setProfilo(null)
                    setDettagliBadante(null)
                    setDettagliFamiglia(null)
                    setIsLoading(false)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase, fetchUserData])

    const isOnboarded = Boolean(profilo && profilo.nome)

    return {
        user,
        profilo,
        dettagliBadante,
        dettagliFamiglia,
        isLoading,
        isOnboarded,
        refresh: fetchUserData,
    }
}
