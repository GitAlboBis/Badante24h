'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Ban, Trash2, RotateCcw, Loader2 } from 'lucide-react'
import { suspendUser, unsuspendUser, deleteUser } from './actions'

interface Props {
    profiloId: string
    isSuspended: boolean
}

export function UserActions({ profiloId, isSuspended }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [confirmDelete, setConfirmDelete] = useState(false)

    const handleSuspend = () => {
        startTransition(async () => {
            if (isSuspended) {
                await unsuspendUser(profiloId)
            } else {
                await suspendUser(profiloId)
            }
        })
    }

    const handleDelete = () => {
        if (!confirmDelete) {
            setConfirmDelete(true)
            return
        }
        startTransition(async () => {
            await deleteUser(profiloId)
            router.push('/dashboard/users')
        })
    }

    return (
        <div className="bg-slate-900/80 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-sm font-semibold text-white mb-4">Azioni Admin</h2>
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={handleSuspend}
                    disabled={isPending}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                        isSuspended
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'
                    }`}
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isSuspended ? (
                        <RotateCcw className="w-4 h-4" />
                    ) : (
                        <Ban className="w-4 h-4" />
                    )}
                    {isSuspended ? 'Riattiva Utente' : 'Sospendi Utente'}
                </button>

                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    {confirmDelete ? 'Conferma Eliminazione' : 'Elimina Utente'}
                </button>

                {confirmDelete && (
                    <button
                        onClick={() => setConfirmDelete(false)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
                    >
                        Annulla
                    </button>
                )}
            </div>
        </div>
    )
}
