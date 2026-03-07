import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, User, Calendar, MapPin, Shield, FileCheck } from 'lucide-react'
import { UserActions } from './user-actions'

interface Props {
    params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch profile
    const { data: profile } = await supabase
        .from('profili')
        .select('*')
        .eq('id', id)
        .single()

    if (!profile) notFound()

    // Fetch role-specific details
    const { data: dettagliBadante } = profile.ruolo === 'badante'
        ? await supabase.from('dettagli_badante').select('*').eq('profilo_id', id).single()
        : { data: null }

    const { data: dettagliFamiglia } = profile.ruolo === 'famiglia'
        ? await supabase.from('dettagli_famiglia').select('*').eq('profilo_id', id).single()
        : { data: null }

    // Fetch documents
    const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('profile_id', id)
        .order('created_at', { ascending: false })

    const isSuspended = profile.tipo_profilo === 'sospeso'

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Back */}
            <Link
                href="/dashboard/users"
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Torna alla lista
            </Link>

            {/* Profile Header */}
            <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center text-slate-300 text-xl font-semibold shrink-0 overflow-hidden">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            (profile.nome ?? '?').charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl font-bold text-white">
                                {profile.nome ?? 'Senza nome'}
                            </h1>
                            {profile.verificato && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                                    <Shield className="w-3 h-3" /> Verificato
                                </span>
                            )}
                            {isSuspended && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                                    Sospeso
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                            <span className={`inline-flex items-center gap-1.5 ${
                                profile.ruolo === 'badante' ? 'text-emerald-400' : profile.ruolo === 'famiglia' ? 'text-purple-400' : 'text-blue-400'
                            }`}>
                                <User className="w-3.5 h-3.5" />
                                {profile.ruolo}
                            </span>
                            {profile.provincia && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {profile.provincia}
                                </span>
                            )}
                            {profile.data_iscrizione && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(profile.data_iscrizione).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Badante Details */}
            {dettagliBadante && (
                <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                    <h2 className="text-sm font-semibold text-white mb-4">Dettagli Badante</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <InfoRow label="Sesso" value={dettagliBadante.sesso === 'F' ? 'Femmina' : dettagliBadante.sesso === 'M' ? 'Maschio' : null} />
                        <InfoRow label="Data di Nascita" value={dettagliBadante.data_di_nascita} />
                        <InfoRow label="Nazionalità" value={dettagliBadante.nazionalita} />
                        <InfoRow label="Città" value={dettagliBadante.citta} />
                        <InfoRow label="Disponibilità" value={dettagliBadante.disponibilita_ore} />
                        <InfoRow label="Compenso" value={dettagliBadante.compenso_orientativo} />
                        <InfoRow label="Patente" value={dettagliBadante.patente_guida ? 'Sì' : 'No'} />
                        <InfoRow label="Automunita" value={dettagliBadante.automunita ? 'Sì' : 'No'} />
                        <InfoRow label="Esperienza" value={dettagliBadante.esperienze_precedenti ? 'Sì' : 'No'} />
                        <InfoRow label="Fuma" value={dettagliBadante.fuma ? 'Sì' : 'No'} />
                    </div>
                    {dettagliBadante.lingue_parlate && dettagliBadante.lingue_parlate.length > 0 && (
                        <div className="mt-4">
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Lingue</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {dettagliBadante.lingue_parlate.map((l) => (
                                    <span key={l} className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs border border-white/5">
                                        {l}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Famiglia Details */}
            {dettagliFamiglia && (
                <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                    <h2 className="text-sm font-semibold text-white mb-4">Dettagli Famiglia</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <InfoRow label="Persone in casa" value={dettagliFamiglia.numero_persone_casa?.toString()} />
                        <InfoRow label="Persone da accudire" value={dettagliFamiglia.persone_da_accudire?.toString()} />
                        <InfoRow label="Stanza privata" value={dettagliFamiglia.disponibilita_stanza_privata ? 'Sì' : 'No'} />
                        <InfoRow label="Richiede esperienza" value={dettagliFamiglia.richiede_esperienze_precedenti ? 'Sì' : 'No'} />
                        <InfoRow label="Fumatori in casa" value={dettagliFamiglia.fumatori_in_casa ? 'Sì' : 'No'} />
                        <InfoRow label="Disabili in casa" value={dettagliFamiglia.persone_disabili_in_casa ? 'Sì' : 'No'} />
                    </div>
                </div>
            )}

            {/* Documents */}
            <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-400" />
                    Documenti ({documents?.length ?? 0})
                </h2>
                {documents && documents.length > 0 ? (
                    <div className="space-y-3">
                        {documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/5">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-xs text-slate-400 font-mono uppercase shrink-0">
                                        {(doc.file_type ?? 'file').split('/').pop()?.substring(0, 3) ?? 'doc'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-white truncate">{doc.file_name}</p>
                                        <p className="text-xs text-slate-500">{doc.document_type} · {doc.created_at ? new Date(doc.created_at).toLocaleDateString('it-IT') : '—'}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                                    doc.status === 'approved'
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : doc.status === 'rejected'
                                            ? 'bg-red-500/10 text-red-400'
                                            : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                    {doc.status === 'approved' ? 'Approvato' : doc.status === 'rejected' ? 'Rifiutato' : 'In attesa'}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">Nessun documento caricato</p>
                )}
            </div>

            {/* Admin Actions */}
            <UserActions profiloId={id} isSuspended={isSuspended} />
        </div>
    )
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
            <p className="text-slate-300 mt-0.5">{value ?? '—'}</p>
        </div>
    )
}
