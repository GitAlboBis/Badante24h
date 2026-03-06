import React from 'react'
import { Heart, MapPin, Star, BadgeCheck } from 'lucide-react'
import { CaregiverResult } from '@/types'
import { formatDistance } from '@/lib/utils'

interface CaregiverCardProps {
    profile: CaregiverResult
}

export function CaregiverCard({ profile }: CaregiverCardProps) {
    // Format care_type enum for display
    const primaryCareType = profile.care_types?.[0]
    const displayCareType = primaryCareType === 'oss'
        ? 'OSS'
        : primaryCareType === 'babysitter'
            ? 'Babysitter'
            : primaryCareType === 'colf'
                ? 'Colf'
                : 'Badante'

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm card-hover transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col">
            <div className="relative h-56 shrink-0 bg-slate-100 dark:bg-slate-800">
                {profile.avatar_url ? (
                    <img
                        alt={`${profile.first_name} ${profile.last_name}`}
                        className="w-full h-full object-cover"
                        src={profile.avatar_url}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        Nessuna foto
                    </div>
                )}

                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button className="p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-rose-500 shadow-sm hover:scale-110 transition-transform">
                        <Heart className="size-5 fill-current" />
                    </button>
                </div>

                {profile.is_online && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <div className="size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 ring-2 ring-emerald-500/20"></div>
                        <span className="text-white text-[10px] font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Online
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-lg truncate">
                            {profile.first_name} {profile.last_name[0]}.{profile.age ? `, ${profile.age}` : ''}
                        </h3>
                        {profile.is_verified && (
                            <div title="Profilo Verificato">
                                <BadgeCheck className="text-emerald-500 size-5" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 px-2 py-1 rounded-lg">
                        <Star className="size-3.5 fill-current" />
                        <span className="text-xs font-bold">{profile.rating ? profile.rating.toFixed(1) : 'Nuovo'}</span>
                    </div>
                </div>

                <p className="text-sm text-slate-500 flex items-center gap-1 mb-4">
                    <MapPin className="size-4" /> {formatDistance(profile.distance || 0)} • {profile.city || 'Milano'}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-full uppercase tracking-wide">
                        {displayCareType}
                    </span>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tariffa</span>
                        <span className="text-xl font-black text-primary">
                            €{profile.hourly_rate}
                            <span className="text-sm font-normal text-slate-400">/ora</span>
                        </span>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                        Contatta
                    </button>
                </div>
            </div>
        </div>
    )
}
