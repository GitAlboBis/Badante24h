'use client'

import { useEffect, useState } from 'react'
import { useFiltersStore } from '@/stores/filters-store'

interface GeolocationState {
    lat: number | null
    lng: number | null
    error: string | null
    loading: boolean
}

/**
 * Browser Geolocation API hook.
 * Requests position once on mount and automatically pushes
 * the coordinates into the Zustand filters store.
 */
export function useGeolocation(): GeolocationState {
    const [state, setState] = useState<GeolocationState>({
        lat: null,
        lng: null,
        error: null,
        loading: true,
    })

    const setFiltri = useFiltersStore((s) => s.setFiltri)

    useEffect(() => {
        if (!navigator.geolocation) {
            setState((s) => ({
                ...s,
                error: 'Geolocalizzazione non supportata dal browser.',
                loading: false,
            }))
            return
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude
                const lng = pos.coords.longitude
                setState({ lat, lng, error: null, loading: false })
                // ← automatically sync into the store
                setFiltri({ lat, lng })
            },
            (err) => {
                let message = 'Impossibile ottenere la posizione.'
                if (err.code === err.PERMISSION_DENIED) {
                    message = 'Permesso di geolocalizzazione negato.'
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    message = 'Posizione non disponibile.'
                } else if (err.code === err.TIMEOUT) {
                    message = 'Richiesta di posizione scaduta.'
                }
                setState({ lat: null, lng: null, error: message, loading: false })
            },
            { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 }
        )
    }, [setFiltri])

    return state
}
