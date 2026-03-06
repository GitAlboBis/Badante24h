import { create } from 'zustand'
import type { FiltersState, RuoloFilter } from '@/types'

export const useFiltersStore = create<FiltersState>((set) => ({
    ruolo: 'Tutti',
    radius_km: 25,
    solo_verificati: false,
    lat: null,
    lng: null,

    setRuolo: (ruolo: RuoloFilter) => set({ ruolo }),
    setRadius: (radius_km: number) => set({ radius_km }),
    toggleVerificati: () =>
        set((s) => ({ solo_verificati: !s.solo_verificati })),
    setCoordinates: (lat: number, lng: number) => set({ lat, lng }),
    resetFilters: () =>
        set({
            ruolo: 'Tutti',
            radius_km: 25,
            solo_verificati: false,
        }),
}))
