import { create } from 'zustand'
import type { FiltriRicerca } from '@/types'

const DEFAULTS: Pick<FiltriRicerca, 'lat' | 'lng' | 'radius_km' | 'ruolo' | 'solo_verificati'> = {
    lat: null,
    lng: null,
    radius_km: 25,
    ruolo: 'Tutti',
    solo_verificati: false,
}

export const useFiltersStore = create<FiltriRicerca>((set) => ({
    ...DEFAULTS,

    setFiltri: (partial) => set((s) => ({ ...s, ...partial })),

    resetFiltri: () => set(DEFAULTS),
}))
