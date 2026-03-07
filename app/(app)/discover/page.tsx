'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, MapPinOff, ShieldCheck } from 'lucide-react'
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

/* ── Loading Grid ── */
function SkeletonGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}

/* ── Page ── */
export default function DiscoverPage() {
    const supabase = useMemo(() => createClient(), [])
    const geo = useGeolocation()

    const { ruolo, radius_km, solo_verificati, lat, lng, setFiltri } =
        useFiltersStore()

    const [profili, setProfili] = useState<CercaBadantiResult[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [error, setError] = useState<string | null>(null)

    /* ── Fetch caregivers when any filter changes ── */
    useEffect(() => {
        if (lat == null || lng == null) return

        const latVal = lat
        const lngVal = lng
        let cancelled = false

        async function fetchData() {
            setLoadingData(true)
            setError(null)

            const { data, error: rpcError } = await supabase.rpc(
                'cerca_badanti_vicine',
                {
                    lat_target: latVal,
                    lon_target: lngVal,
                    raggio_km: radius_km,
                }
            )

            if (cancelled) return
            if (rpcError) {
                setError(rpcError.message)
                setProfili([])
            } else {
                setProfili(data ?? [])
            }
            setLoadingData(false)
        }

        fetchData()

        return () => {
            cancelled = true
        }
    }, [lat, lng, radius_km, ruolo, solo_verificati, supabase])

    /* ── Derived: client-side filter by ruolo ── */
    const filtered = useMemo(() => {
        if (ruolo === 'Tutti') return profili
        // The RPC already returns only "badante" role — future:
        // map chip labels to sub-types once schema supports them
        return profili
    }, [profili, ruolo])

    /* ── Geo loading ── */
    if (geo.loading) {
        return (
            <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full pb-24">
                <PageHeader />
                <FilterBar ruolo={ruolo} soloVerificati={solo_verificati} onSetFiltri={setFiltri} />
                <SkeletonGrid />
            </div>
        )
    }

    /* ── Geo denied ── */
    if (geo.error) {
        return (
            <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full pb-24">
                <PageHeader />
                <FilterBar ruolo={ruolo} soloVerificati={solo_verificati} onSetFiltri={setFiltri} />
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="size-16 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-4">
                        <MapPinOff className="size-8 text-amber-500" />
                    </div>
                    <h2 className="text-lg font-bold mb-1">Posizione non disponibile</h2>
                    <p className="text-sm text-slate-500 max-w-sm mb-6">
                        {geo.error} Abilita la geolocalizzazione nelle impostazioni del browser per trovare le badanti vicino a te.
                    </p>
                    {/* Future: manual address / city search */}
                </div>
            </div>
        )
    }

    /* ── Main view ── */
    return (
        <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full pb-24">
            <PageHeader />
            <FilterBar ruolo={ruolo} soloVerificati={solo_verificati} onSetFiltri={setFiltri} />

            {/* Loading RPC */}
            {loadingData && <SkeletonGrid />}

            {/* Error */}
            {!loadingData && error && (
                <div className="text-center py-16">
                    <p className="text-sm text-red-500 font-medium">{error}</p>
                </div>
            )}

            {/* Results */}
            {!loadingData && !error && filtered.length > 0 && (
                <>
                    <p className="text-xs text-slate-400 mt-4 mb-4">
                        {filtered.length} risultat{filtered.length === 1 ? 'o' : 'i'} entro {radius_km} km
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map((profile) => (
                            <CaregiverCard key={profile.id} profile={profile} />
                        ))}
                    </div>
                </>
            )}

            {/* Empty state */}
            {!loadingData && !error && filtered.length === 0 && (
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

/* ──────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────── */

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

function FilterBar({
    ruolo,
    soloVerificati,
    onSetFiltri,
}: {
    ruolo: RuoloFilter
    soloVerificati: boolean
    onSetFiltri: (p: Partial<{ ruolo: RuoloFilter; solo_verificati: boolean }>) => void
}) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {/* Role chips */}
            {RUOLI.map((r) => {
                const active = r === ruolo
                return (
                    <button
                        key={r}
                        onClick={() => onSetFiltri({ ruolo: r })}
                        className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${active
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                    >
                        {r}
                    </button>
                )
            })}

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 shrink-0 mx-1" />

            {/* Verified toggle */}
            <button
                onClick={() => onSetFiltri({ solo_verificati: !soloVerificati })}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${soloVerificati
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
            >
                <ShieldCheck className="size-4" />
                Verificati
            </button>
        </div>
    )
}
