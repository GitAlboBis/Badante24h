'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
    CheckCircle2,
    XCircle,
    ExternalLink,
    Loader2,
    User,
    MapPin,
    FileText,
} from 'lucide-react'
import { reviewDocument } from './actions'

interface DocumentInfo {
    id: string
    file_name: string
    file_url: string
    file_type: string | null
    document_type: string
    status: string | null
    review_notes: string | null
    created_at: string | null
}

interface ProfileInfo {
    id: string
    nome: string | null
    ruolo: string
    avatar_url: string | null
    provincia: string | null
}

interface Props {
    document: DocumentInfo
    profile: ProfileInfo | null
}

export function DocumentReviewCard({ document: doc, profile }: Props) {
    const [isPending, startTransition] = useTransition()
    const [notes, setNotes] = useState(doc.review_notes ?? '')
    const [showNotes, setShowNotes] = useState(false)
    const [decided, setDecided] = useState<'approved' | 'rejected' | null>(null)

    const handleReview = (decision: 'approved' | 'rejected') => {
        startTransition(async () => {
            await reviewDocument(doc.id, decision, notes || undefined)
            setDecided(decision)
        })
    }

    const isImage = doc.file_type?.startsWith('image/')
    const isPdf = doc.file_type === 'application/pdf'

    return (
        <div className="bg-slate-900/80 border border-white/5 rounded-xl backdrop-blur-sm overflow-hidden hover:border-white/10 transition-colors">
            <div className="p-5">
                <div className="flex flex-col sm:flex-row gap-5">
                    {/* Preview */}
                    <div className="w-full sm:w-44 h-32 rounded-lg bg-slate-800 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                        {isImage ? (
                            <img
                                src={doc.file_url}
                                alt={doc.file_name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-center">
                                <FileText className="w-8 h-8 text-slate-500 mx-auto mb-1" />
                                <span className="text-[10px] text-slate-500 uppercase">
                                    {isPdf ? 'PDF' : doc.file_type?.split('/').pop() ?? 'File'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="min-w-0">
                                <h3 className="text-sm font-semibold text-white truncate">{doc.file_name}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Tipo: <span className="text-slate-400">{doc.document_type}</span>
                                    {' · '}
                                    {doc.created_at
                                        ? new Date(doc.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
                                        : '—'}
                                </p>
                            </div>
                            <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
                                title="Apri file"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>

                        {/* Profile info */}
                        {profile && (
                            <Link
                                href={`/dashboard/users/${profile.id}`}
                                className="inline-flex items-center gap-2 mt-1 mb-3 p-2 rounded-lg bg-slate-800/60 border border-white/5 hover:border-white/10 transition-colors group"
                            >
                                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-medium shrink-0 overflow-hidden">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        (profile.nome ?? '?').charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="text-xs">
                                    <span className="text-white group-hover:text-blue-300 font-medium transition-colors">
                                        {profile.nome ?? 'Senza nome'}
                                    </span>
                                    <span className="flex items-center gap-1 text-slate-500">
                                        <User className="w-3 h-3" /> {profile.ruolo}
                                        {profile.provincia && (
                                            <>
                                                <span className="mx-0.5">·</span>
                                                <MapPin className="w-3 h-3" /> {profile.provincia}
                                            </>
                                        )}
                                    </span>
                                </div>
                            </Link>
                        )}

                        {/* Status badge or actions */}
                        {decided || doc.status !== 'pending' ? (
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    (decided ?? doc.status) === 'approved'
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-red-500/10 text-red-400'
                                }`}>
                                    {(decided ?? doc.status) === 'approved' ? (
                                        <><CheckCircle2 className="w-3.5 h-3.5" /> Approvato</>
                                    ) : (
                                        <><XCircle className="w-3.5 h-3.5" /> Rifiutato</>
                                    )}
                                </span>
                                {doc.review_notes && (
                                    <span className="text-xs text-slate-500 italic truncate">
                                        — {doc.review_notes}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => handleReview('approved')}
                                    disabled={isPending}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                    Approva
                                </button>
                                <button
                                    onClick={() => {
                                        if (!showNotes) return setShowNotes(true)
                                        handleReview('rejected')
                                    }}
                                    disabled={isPending}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                                    Rifiuta
                                </button>
                                {!showNotes && (
                                    <button
                                        onClick={() => setShowNotes(true)}
                                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        + Aggiungi note
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Notes textarea */}
                        {showNotes && doc.status === 'pending' && !decided && (
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Note di revisione (opzionale)..."
                                rows={2}
                                className="w-full mt-3 px-3 py-2 bg-slate-800/80 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
