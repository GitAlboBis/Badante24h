'use client'

import { useEffect, useState } from 'react'

interface GeolocationState {
    lat: number | null
    lng: number | null
    error: string | null
    loading: boolean
}

/**
 * Browser Geolocation API hook.
 * Requests position once on mount; exposes lat/lng, error, and loading state.
 */
export function useGeolocation(): GeolocationState {
    const [state, setState] = useState<GeolocationState>({
        lat: null,
        lng: null,
        error: null,
        loading: true,
    })

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
                setState({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    error: null,
                    loading: false,
                })
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
    }, [])

    return state
}
