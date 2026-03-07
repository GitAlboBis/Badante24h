import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    MapPin,
    Clock,
    Star,
    BadgeCheck,
    Cigarette,
    Car,
    CircleParking,
    Accessibility,
    Sparkles,
    Briefcase,
    Languages,
    Heart,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { ProfiloBadanteCompleto } from '@/types'
import { ContactBar } from './ContactBar'

/* ── Helpers ── */

/** Calculate age from a date string */
function calcAge(dateStr: string | null): number | null {
    if (!dateStr) return null
    const birth = new Date(dateStr)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
}

/** Build initials from a name */
function initials(name: string | null): string {
    if (!name) return '??'
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

/* ── Types ── */

interface PageProps {
    params: Promise<{ id: string }>
}

/* ── Page ── */

export default async function ProfilePage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch profile + caregiver details
    const { data, error } = await supabase
        .from('profili')
        .select('*, dettagli_badante(*)')
        .eq('id', id)
        .eq('ruolo', 'badante')
        .single()

    if (error || !data) {
        notFound()
    }

    const profile = data as ProfiloBadanteCompleto
    const details = profile.dettagli_badante
    const age = calcAge(details?.data_di_nascita ?? null)
    const nome = profile.nome ?? 'Senza nome'

    const isVerificato = profile.verificato === true

    /* ── Skills / boolean traits ── */
    const traits = [
        {
            key: 'fuma',
            value: details?.fuma,
            label: 'Non fumatore/fumatrice',
            labelTrue: 'Fumatore/fumatrice',
            icon: Cigarette,
        },
        {
            key: 'patente_guida',
            value: details?.patente_guida,
            label: 'Patente di guida',
            icon: Car,
        },
        {
            key: 'automunita',
            value: details?.automunita,
            label: 'Automunita',
            icon: CircleParking,
        },
        {
            key: 'aiuto_persone_disabili',
            value: details?.aiuto_persone_disabili,
            label: 'Aiuto persone disabili',
            icon: Accessibility,
        },
        {
            key: 'aiuto_lavori_domestici',
            value: details?.aiuto_lavori_domestici,
            label: 'Aiuto lavori domestici',
            icon: Sparkles,
        },
        {
            key: 'esperienze_precedenti',
            value: details?.esperienze_precedenti,
            label: 'Esperienze precedenti',
            icon: Briefcase,
        },
    ]

    return (
        <div className="min-h-screen pb-28 md:pb-8">
            {/* ── Back navigation ── */}
            <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
                    <Link
                        href="/discover"
                        className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Torna alla ricerca
                    </Link>
                </div>
            </div>

            {/* ── Main layout ── */}
            <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
                <div className="md:grid md:grid-cols-[1fr_320px] md:gap-8">
                    {/* ── LEFT COLUMN: Content ── */}
                    <div className="space-y-6">
                        {/* ── Hero Section ── */}
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            {/* Avatar area */}
                            <div className="relative h-48 md:h-56 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                                {profile.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={nome}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl font-black text-primary/20 select-none">
                                            {initials(nome)}
                                        </span>
                                    </div>
                                )}

                                {/* Favourite */}
                                <button className="absolute top-4 right-4 p-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-rose-400 hover:text-rose-500 shadow-sm hover:scale-110 transition-transform">
                                    <Heart className="size-5" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="p-5 md:p-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                                        {nome}
                                        {age ? `, ${age}` : ''}
                                    </h1>
                                    {isVerificato && (
                                        <BadgeCheck className="size-6 text-emerald-500 shrink-0" />
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <MapPin className="size-4" />
                                    <span>
                                        {[details?.citta, details?.nazionalita, profile.provincia]
                                            .filter(Boolean)
                                            .join(' · ') || '—'}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* ── Quick Info Bar ── */}
                        <section className="grid grid-cols-3 gap-3">
                            <InfoCard
                                label="Compenso"
                                value={details?.compenso_orientativo || '—'}
                                icon={<span className="text-lg">💰</span>}
                            />
                            <InfoCard
                                label="Disponibilità"
                                value={details?.disponibilita_ore || '—'}
                                icon={<Clock className="size-5 text-primary" />}
                            />
                            <InfoCard
                                label="Valutazione"
                                value="5.0"
                                icon={<Star className="size-5 text-amber-400 fill-amber-400" />}
                                muted
                            />
                        </section>

                        {/* ── About ── */}
                        {details?.lettera_presentazione_famiglie && (
                            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 shadow-sm">
                                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                                    <span className="text-xl">📝</span>
                                    Chi sono
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                    {details.lettera_presentazione_famiglie}
                                </p>
                            </section>
                        )}

                        {/* ── Experience ── */}
                        {details?.esperienze_lavorative && (
                            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 shadow-sm">
                                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                                    <Briefcase className="size-5 text-primary" />
                                    Esperienze Lavorative
                                </h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                    {details.esperienze_lavorative}
                                </p>
                            </section>
                        )}

                        {/* ── Competenze e Caratteristiche ── */}
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="text-xl">✅</span>
                                Competenze e Caratteristiche
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {traits.map((trait) => {
                                    const Icon = trait.icon
                                    // For 'fuma' specifically, we invert the display logic
                                    const isSmoke = trait.key === 'fuma'
                                    const isActive = isSmoke ? trait.value === false : trait.value === true
                                    const label = isSmoke
                                        ? trait.value
                                            ? trait.labelTrue!
                                            : trait.label
                                        : trait.label

                                    // Only show if we have data (not null)
                                    if (trait.value == null) return null

                                    return (
                                        <div
                                            key={trait.key}
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive
                                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                                                }`}
                                        >
                                            <Icon className="size-5 shrink-0" />
                                            <span className="text-sm font-medium">{label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        {/* ── Languages ── */}
                        {((details?.lingue_parlate && details.lingue_parlate.length > 0) ||
                            (details?.lingue_base && details.lingue_base.length > 0)) && (
                                <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 shadow-sm">
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Languages className="size-5 text-primary" />
                                        Lingue
                                    </h2>

                                    {details?.lingue_parlate && details.lingue_parlate.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                                Lingue parlate
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {details.lingue_parlate.map((lang) => (
                                                    <span
                                                        key={lang}
                                                        className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full"
                                                    >
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {details?.lingue_base && details.lingue_base.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                                Conoscenza base
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {details.lingue_base.map((lang) => (
                                                    <span
                                                        key={lang}
                                                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full"
                                                    >
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </section>
                            )}
                    </div>

                    {/* ── RIGHT COLUMN: Desktop Contact Card ── */}
                    <div className="hidden md:block">
                        <ContactBar
                            profiloId={profile.id}
                            nome={nome}
                            compenso={details?.compenso_orientativo}
                        />
                    </div>
                </div>
            </div>

            {/* ── Mobile Bottom Contact Bar ── */}
            <div className="md:hidden">
                <ContactBar
                    profiloId={profile.id}
                    nome={nome}
                    compenso={details?.compenso_orientativo}
                />
            </div>
        </div>
    )
}

/* ── Sub-components ── */

function InfoCard({
    label,
    value,
    icon,
    muted,
}: {
    label: string
    value: string
    icon: React.ReactNode
    muted?: boolean
}) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
            <div className="flex justify-center mb-2">{icon}</div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                {label}
            </p>
            <p
                className={`text-base font-extrabold truncate ${muted ? 'text-slate-400' : 'text-slate-900 dark:text-white'
                    }`}
            >
                {value}
                {muted && (
                    <span className="block text-[10px] font-medium text-slate-300 mt-0.5">
                        (placeholder)
                    </span>
                )}
            </p>
        </div>
    )
}
