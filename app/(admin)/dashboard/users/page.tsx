import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Users as UsersIcon, Search, ChevronLeft, ChevronRight } from 'lucide-react'

const ITEMS_PER_PAGE = 10

type RuoloTab = 'tutti' | 'badante' | 'famiglia'

interface Props {
    searchParams: Promise<{
        q?: string
        ruolo?: string
        page?: string
    }>
}

export default async function UsersPage({ searchParams }: Props) {
    const params = await searchParams
    const query = params.q ?? ''
    const ruoloTab = (params.ruolo ?? 'tutti') as RuoloTab
    const page = Math.max(1, parseInt(params.page ?? '1', 10))
    const offset = (page - 1) * ITEMS_PER_PAGE

    const supabase = await createClient()

    // Build query
    let dbQuery = supabase
        .from('profili')
        .select('id, nome, ruolo, provincia, data_iscrizione, avatar_url, verificato', { count: 'exact' })

    if (ruoloTab !== 'tutti') {
        dbQuery = dbQuery.eq('ruolo', ruoloTab)
    }

    if (query.trim()) {
        dbQuery = dbQuery.ilike('nome', `%${query.trim()}%`)
    }

    const { data: users, count } = await dbQuery
        .order('data_iscrizione', { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1)

    const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE)

    // Fetch document counts per user for the current page users
    const userIds = users?.map((u) => u.id) ?? []
    const { data: docCounts } = userIds.length > 0
        ? await supabase
            .from('documents')
            .select('profile_id, status')
            .in('profile_id', userIds)
        : { data: [] }

    const docStatusMap = new Map<string, { pending: number; approved: number; rejected: number }>()
    docCounts?.forEach((d) => {
        const existing = docStatusMap.get(d.profile_id) ?? { pending: 0, approved: 0, rejected: 0 }
        if (d.status === 'pending') existing.pending++
        else if (d.status === 'approved') existing.approved++
        else if (d.status === 'rejected') existing.rejected++
        docStatusMap.set(d.profile_id, existing)
    })

    const tabs: { label: string; value: RuoloTab }[] = [
        { label: 'Tutti', value: 'tutti' },
        { label: 'Badanti', value: 'badante' },
        { label: 'Famiglie', value: 'famiglia' },
    ]

    function buildUrl(overrides: Record<string, string>) {
        const p = new URLSearchParams()
        if (query) p.set('q', query)
        if (ruoloTab !== 'tutti') p.set('ruolo', ruoloTab)
        Object.entries(overrides).forEach(([k, v]) => {
            if (v) p.set(k, v)
            else p.delete(k)
        })
        const qs = p.toString()
        return `/dashboard/users${qs ? `?${qs}` : ''}`
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <UsersIcon className="w-6 h-6 text-blue-400" />
                    Gestione Utenti
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    {count?.toLocaleString('it-IT') ?? 0} utenti registrati
                </p>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <form className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        name="q"
                        defaultValue={query}
                        placeholder="Cerca per nome..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                    />
                    {/* Preserve ruolo filter */}
                    {ruoloTab !== 'tutti' && <input type="hidden" name="ruolo" value={ruoloTab} />}
                </form>

                {/* Role Tabs */}
                <div className="flex gap-1 bg-slate-800/80 border border-white/10 rounded-lg p-1">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.value}
                            href={buildUrl({ ruolo: tab.value === 'tutti' ? '' : tab.value, page: '' })}
                            className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${
                                ruoloTab === tab.value
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900/80 border border-white/5 rounded-xl backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['Utente', 'Ruolo', 'Provincia', 'Data Iscrizione', 'Documenti', ''].map((h) => (
                                    <th key={h} className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user) => {
                                const docs = docStatusMap.get(user.id)
                                return (
                                    <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-medium shrink-0 overflow-hidden">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        (user.nome ?? '?').charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm text-white font-medium truncate">
                                                        {user.nome ?? 'Senza nome'}
                                                    </span>
                                                    {user.verificato && (
                                                        <span title="Verificato" className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px]">✓</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                user.ruolo === 'badante'
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : user.ruolo === 'famiglia'
                                                        ? 'bg-purple-500/10 text-purple-400'
                                                        : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                                {user.ruolo}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-slate-400">
                                            {user.provincia ?? '—'}
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-slate-400">
                                            {user.data_iscrizione
                                                ? new Date(user.data_iscrizione).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
                                                : '—'}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {docs ? (
                                                <div className="flex gap-2 text-xs">
                                                    {docs.approved > 0 && (
                                                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                                                            {docs.approved} ✓
                                                        </span>
                                                    )}
                                                    {docs.pending > 0 && (
                                                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                                                            {docs.pending} ⏳
                                                        </span>
                                                    )}
                                                    {docs.rejected > 0 && (
                                                        <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">
                                                            {docs.rejected} ✗
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-600">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Link
                                                href={`/dashboard/users/${user.id}`}
                                                className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                            >
                                                Dettagli →
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                            {(!users || users.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                                        Nessun utente trovato
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                        <span className="text-xs text-slate-500">
                            Pagina {page} di {totalPages}
                        </span>
                        <div className="flex gap-1.5">
                            {page > 1 && (
                                <Link
                                    href={buildUrl({ page: String(page - 1) })}
                                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Link>
                            )}
                            {page < totalPages && (
                                <Link
                                    href={buildUrl({ page: String(page + 1) })}
                                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
