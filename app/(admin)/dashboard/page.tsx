import { createClient } from '@/lib/supabase/server'
import {
    Users,
    UserCheck,
    Home,
    MessageSquare,
    ShieldAlert,
    TrendingUp,
} from 'lucide-react'

function StatCard({
    label,
    value,
    icon: Icon,
    color,
}: {
    label: string
    value: number
    icon: React.ElementType
    color: string
}) {
    const colorMap: Record<string, string> = {
        blue: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/20',
        emerald: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20',
        purple: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/20',
        amber: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20',
        rose: 'from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/20',
    }

    return (
        <div className="bg-slate-900/80 border border-white/5 rounded-xl p-5 backdrop-blur-sm hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {label}
                    </p>
                    <p className="text-2xl font-bold text-white mt-1.5">{value.toLocaleString('it-IT')}</p>
                </div>
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${colorMap[color] ?? colorMap.blue}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    )
}

export default async function DashboardPage() {
    const supabase = await createClient()

    // Parallel stat queries
    const [
        { count: totalUsers },
        { count: totalBadanti },
        { count: totalFamiglie },
        { count: totalConversations },
        { count: pendingDocs },
    ] = await Promise.all([
        supabase.from('profili').select('*', { count: 'exact', head: true }),
        supabase.from('profili').select('*', { count: 'exact', head: true }).eq('ruolo', 'badante'),
        supabase.from('profili').select('*', { count: 'exact', head: true }).eq('ruolo', 'famiglia'),
        supabase.from('conversations').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ])

    // Recent users
    const { data: recentUsers } = await supabase
        .from('profili')
        .select('id, nome, ruolo, provincia, data_iscrizione, avatar_url')
        .order('data_iscrizione', { ascending: false })
        .limit(5)

    const stats = [
        { label: 'Utenti Totali', value: totalUsers ?? 0, icon: Users, color: 'blue' },
        { label: 'Badanti', value: totalBadanti ?? 0, icon: UserCheck, color: 'emerald' },
        { label: 'Famiglie', value: totalFamiglie ?? 0, icon: Home, color: 'purple' },
        { label: 'Conversazioni', value: totalConversations ?? 0, icon: MessageSquare, color: 'amber' },
        { label: 'Verifiche Pendenti', value: pendingDocs ?? 0, icon: ShieldAlert, color: 'rose' },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    Dashboard
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Panoramica della piattaforma Badante24h
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            {/* Recent Users */}
            <div className="bg-slate-900/80 border border-white/5 rounded-xl backdrop-blur-sm">
                <div className="px-5 py-4 border-b border-white/5">
                    <h2 className="text-sm font-semibold text-white">Utenti Recenti</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">
                                    Utente
                                </th>
                                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">
                                    Ruolo
                                </th>
                                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">
                                    Provincia
                                </th>
                                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">
                                    Data Iscrizione
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers?.map((user) => (
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
                                            <span className="text-sm text-white font-medium truncate">
                                                {user.nome ?? 'Senza nome'}
                                            </span>
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
                                            ? new Date(user.data_iscrizione).toLocaleDateString('it-IT', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })
                                            : '—'}
                                    </td>
                                </tr>
                            ))}
                            {(!recentUsers || recentUsers.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500">
                                        Ancora nessun utente registrato
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
