'use client'

import { useTransition } from 'react'
import { MessageCircle, Loader2 } from 'lucide-react'
import { contattaBadante } from './actions'

interface ContactBarProps {
    profiloId: string
    nome: string
    compenso?: string | null
}

/**
 * Sticky bottom bar (mobile) / side card (desktop)
 * with the "Contatta [Nome]" CTA.
 */
export function ContactBar({ profiloId, nome, compenso }: ContactBarProps) {
    const [isPending, startTransition] = useTransition()

    function handleContact() {
        startTransition(() => {
            contattaBadante(profiloId)
        })
    }

    return (
        <>
            {/* ── Mobile: Sticky bottom bar ── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                            Compenso
                        </p>
                        <p className="text-lg font-black text-primary truncate">
                            {compenso || '—'}
                        </p>
                    </div>
                    <button
                        onClick={handleContact}
                        disabled={isPending}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                    >
                        {isPending ? (
                            <Loader2 className="size-5 animate-spin" />
                        ) : (
                            <MessageCircle className="size-5" />
                        )}
                        Contatta {nome.split(' ')[0]}
                    </button>
                </div>
            </div>

            {/* ── Desktop: Side card ── */}
            <div className="hidden md:block sticky top-24">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    {/* Rate */}
                    <div className="text-center mb-5">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                            Compenso Orientativo
                        </p>
                        <p className="text-3xl font-black text-primary">
                            {compenso || '—'}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={handleContact}
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <Loader2 className="size-5 animate-spin" />
                        ) : (
                            <MessageCircle className="size-5" />
                        )}
                        Contatta {nome}
                    </button>

                    {/* Info note */}
                    <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">
                        Invierai un messaggio diretto a {nome.split(' ')[0]}.
                        <br />
                        La risposta arriverà nella tua chat.
                    </p>
                </div>
            </div>
        </>
    )
}
