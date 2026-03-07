import { createClient } from '@/lib/supabase/server'
import { ShieldCheck, FileSearch } from 'lucide-react'
import Link from 'next/link'
import { DocumentReviewCard } from './document-review-card'

type StatusTab = 'pending' | 'approved' | 'rejected' | 'all'

interface Props {
    searchParams: Promise<{ status?: string }>
}

export default async function VerificationPage({ searchParams }: Props) {
    const params = await searchParams
    const statusTab = (params.status ?? 'pending') as StatusTab

    const supabase = await createClient()

    // Fetch documents with profile info
    let dbQuery = supabase
        .from('documents')
        .select('*, profili!documents_profile_id_fkey(id, nome, ruolo, avatar_url, provincia)')
        .order('created_at', { ascending: statusTab === 'pending' })

    if (statusTab !== 'all') {
        dbQuery = dbQuery.eq('status', statusTab)
    }

    const { data: documents } = await dbQuery.limit(50)

    // Counts per status
    const [
        { count: pendingCount },
        { count: approvedCount },
        { count: rejectedCount },
    ] = await Promise.all([
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    ])

    const tabs: { label: string; value: StatusTab; count: number | null; color: string }[] = [
        { label: 'In Attesa', value: 'pending', count: pendingCount, color: 'amber' },
        { label: 'Approvati', value: 'approved', count: approvedCount, color: 'emerald' },
        { label: 'Rifiutati', value: 'rejected', count: rejectedCount, color: 'red' },
        { label: 'Tutti', value: 'all', count: (pendingCount ?? 0) + (approvedCount ?? 0) + (rejectedCount ?? 0), color: 'slate' },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                    Verifica Documenti KYC
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Revisiona i documenti caricati dagli utenti
                </p>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-1 bg-slate-800/80 border border-white/10 rounded-lg p-1 w-fit">
                {tabs.map((tab) => (
                    <Link
                        key={tab.value}
                        href={`/dashboard/verification${tab.value === 'pending' ? '' : `?status=${tab.value}`}`}
                        className={`px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                            statusTab === tab.value
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {tab.label}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            statusTab === tab.value
                                ? 'bg-white/20 text-white'
                                : `bg-${tab.color}-500/10 text-${tab.color}-400`
                        }`}>
                            {tab.count ?? 0}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Documents List */}
            {documents && documents.length > 0 ? (
                <div className="space-y-4">
                    {documents.map((doc) => {
                        const profile = doc.profili as unknown as {
                            id: string
                            nome: string | null
                            ruolo: string
                            avatar_url: string | null
                            provincia: string | null
                        } | null

                        return (
                            <DocumentReviewCard
                                key={doc.id}
                                document={{
                                    id: doc.id,
                                    file_name: doc.file_name,
                                    file_url: doc.file_url,
                                    file_type: doc.file_type,
                                    document_type: doc.document_type,
                                    status: doc.status,
                                    review_notes: doc.review_notes,
                                    created_at: doc.created_at,
                                }}
                                profile={profile}
                            />
                        )
                    })}
                </div>
            ) : (
                <div className="bg-slate-900/80 border border-white/5 rounded-xl p-12 text-center backdrop-blur-sm">
                    <FileSearch className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">
                        {statusTab === 'pending'
                            ? 'Nessun documento in attesa di revisione'
                            : 'Nessun documento trovato'}
                    </p>
                </div>
            )}
        </div>
    )
}
