import { create } from 'zustand'
import type { SearchFilters } from '@/types'

interface FiltersState {
    filters: SearchFilters
    setFilters: (filters: Partial<SearchFilters>) => void
    resetFilters: () => void
}

const defaultFilters: SearchFilters = {
    category: undefined,
    maxDistance: 25_000, // 25km in meters
    minRate: undefined,
    maxRate: undefined,
    experienceYears: undefined,
    languages: [],
    verifiedOnly: false,
}

export const useFiltersStore = create<FiltersState>((set) => ({
    filters: defaultFilters,
    setFilters: (updates) =>
        set((state) => ({
            filters: { ...state.filters, ...updates },
        })),
    resetFilters: () => set({ filters: defaultFilters }),
}))
