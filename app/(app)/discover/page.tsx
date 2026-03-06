'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, MapPinOff } from 'lucide-react'
import { CaregiverCard } from '@/components/profile/caregiver-card'
import { useFiltersStore } from '@/stores/filters-store'
import { useGeolocation } from '@/hooks/use-geolocation'
import { createClient } from '@/lib/supabase/client'
import type { CercaBadantiResult, RuoloFilter } from '@/types'

const RUOLI: RuoloFilter[] = ['Tutti', 'Badante', 'Badante 24h', 'Babysitter']

/* ── Skeleton Card ── */
function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse">
            <div className="h-52 bg-slate-200 dark:bg-slate-800" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-px bg-slate-100 dark:bg-slate-800 mt-3" />
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            </div>
        </div>
    )
}

/* ── Discovery Page ── */
export default function DiscoverPage() {
    const supabase = useMemo(() => createClient(), [])
    const geo = useGeolocation()
    const { ruolo, setRuolo, radius_km, lat, lng, setCoordinates } = useFiltersStore()

    const [results, setResults] = useState<CercaBadantiResult[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    /* Sync geolocation into Zustand store */
    useEffect(() => {
        if (geo.lat != null && geo.lng != null) {
            setCoordinates(geo.lat, geo.lng)
        }
    }, [geo.lat, geo.lng, setCoordinates])

    /* Fetch caregivers when coordinates or filters change */
    useEffect(() => {
        if (lat == null || lng == null) return

        const latVal = lat
        const lngVal = lng
        let cancelled = false

        async function fetchCaregivers() {
            setLoading(true)
            setError(null)

            const { data, error: rpcError } = await supabase.rpc('cerca_badanti_vicine', {
                lat_target: latVal,
                lon_target: lngVal,
                raggio_km: radius_km,
            })

            if (cancelled) return
            if (rpcError) {
                setError(rpcError.message)
                setResults([])
            } else {
                setResults(data ?? [])
            }
            setLoading(false)
        }

        fetchCaregivers()

        return () => {
            cancelled = true
        }
    }, [lat, lng, radius_km, supabase])

    /* ── Derived: filter by ruolo on client ── */
    const filteredResults = useMemo(() => {
        if (ruolo === 'Tutti') return results
        // Simple client-side filter placeholder
        // (the RPC doesn't filter by ruolo yet — all returned are "badante")
        return results
    }, [results, ruolo])

    /* ── Geolocation still loading ── */
    if (geo.loading) {
        return (
            <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
                <PageHeader />
                <FilterChips activeRuolo={ruolo} onSelect={setRuolo} />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </div>
        )
    }

    /* ── Geolocation denied ── */
    if (geo.error) {
        return (
            <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
                <PageHeader />
                <FilterChips activeRuolo={ruolo} onSelect={setRuolo} />
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="size-16 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-4">
                        <MapPinOff className="size-8 text-amber-500" />
                    </div>
                    <h2 className="text-lg font-bold mb-1">Posizione non disponibile</h2>
                    <p className="text-sm text-slate-500 max-w-sm mb-6">
                        {geo.error} Abilita la geolocalizzazione nelle impostazioni del browser per trovare le badanti vicino a te.
                    </p>
                    {/* Future: manual address input */}
                </div>
            </div>
        )
    }

    /* ── Main view ── */
    return (
        <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full pb-28">
            <PageHeader />
            <FilterChips activeRuolo={ruolo} onSelect={setRuolo} />

            {/* Loading RPC */}
            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="text-center py-16">
                    <p className="text-sm text-error font-medium">{error}</p>
                </div>
            )}

            {/* Results */}
            {!loading && !error && filteredResults.length > 0 && (
                <>
                    <p className="text-xs text-slate-400 mt-4 mb-4">
                        {filteredResults.length} risultat{filteredResults.length === 1 ? 'o' : 'i'} entro {radius_km} km
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredResults.map((profile) => (
                            <CaregiverCard key={profile.id} profile={profile} />
                        ))}
                    </div>
                </>
            )}

            {/* Empty state */}
            {!loading && !error && filteredResults.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <Search className="size-8 text-slate-400" />
                    </div>
                    <h2 className="text-lg font-bold mb-1">Nessun risultato</h2>
                    <p className="text-sm text-slate-500 max-w-sm">
                        Non abbiamo trovato badanti entro {radius_km} km dalla tua posizione. Prova ad ampliare il raggio di ricerca.
                    </p>
                </div>
            )}
        </div>
    )
}

/* ── Sub-components ── */

function PageHeader() {
    return (
        <div className="mb-5">
            <h1 className="text-2xl font-black tracking-tight">Cerca Badanti</h1>
            <p className="text-sm text-slate-500 mt-0.5">
                Trova assistenza qualificata vicino a te
            </p>
        </div>
    )
}

function FilterChips({
    activeRuolo,
    onSelect,
}: {
    activeRuolo: RuoloFilter
    onSelect: (r: RuoloFilter) => void
}) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {RUOLI.map((r) => {
                const active = r === activeRuolo
                return (
                    <button
                        key={r}
                        onClick={() => onSelect(r)}
                        className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                            active
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        {r}
                    </button>
                )
            })}
        </div>
    )
}
