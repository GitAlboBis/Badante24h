import React from 'react'
import Link from 'next/link'
import { Heart, MapPin, BadgeCheck } from 'lucide-react'
import type { CercaBadantiResult } from '@/types'

interface CaregiverCardProps {
    profile: CercaBadantiResult
}

export function CaregiverCard({ profile }: CaregiverCardProps) {
    const initials = profile.nome
        ? profile.nome
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : '??'

    return (
        <Link
            href={`/profile/${profile.id}`}
            className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm card-hover transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col focus-visible:ring-2 focus-visible:ring-primary outline-none"
        >
            {/* ── Image / Avatar ── */}
            <div className="relative h-52 shrink-0 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                {profile.avatar_url ? (
                    <img
                        alt={profile.nome ?? 'Badante'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={profile.avatar_url}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <span className="text-3xl font-black text-primary/40 select-none">
                            {initials}
                        </span>
                    </div>
                )}

                {/* Favourite button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-rose-400 hover:text-rose-500 shadow-sm hover:scale-110 transition-transform"
                    aria-label="Aggiungi ai preferiti"
                >
                    <Heart className="size-5" />
                </button>

                {/* Distance pill */}
                {profile.distanza_km != null && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        <MapPin className="size-3.5" />
                        {profile.distanza_km < 1
                            ? `${Math.round(profile.distanza_km * 1000)} m`
                            : `${profile.distanza_km.toFixed(1)} km`}
                    </div>
                )}
            </div>

            {/* ── Content ── */}
            <div className="p-4 flex flex-col flex-1">
                {/* Name + badge */}
                <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-[15px] truncate">
                        {profile.nome ?? 'Senza nome'}
                        {profile.eta ? `, ${profile.eta}` : ''}
                    </h3>
                    {profile.verificato && (
                        <BadgeCheck className="size-4 text-emerald-500 shrink-0" />
                    )}
                </div>

                {/* City + nationality */}
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-3">
                    {[profile.citta, profile.nazionalita].filter(Boolean).join(' · ') || profile.provincia || '—'}
                </p>

                {/* Compensation */}
                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Compenso
                        </span>
                        <span className="text-base font-extrabold text-primary leading-tight">
                            {profile.compenso_orientativo || '—'}
                        </span>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                        Contatta
                    </span>
                </div>
            </div>
        </Link>
    )
}
