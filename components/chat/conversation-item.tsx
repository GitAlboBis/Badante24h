import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

interface ConversationItemProps {
    conversationId: string
    name: string | null
    avatarUrl: string | null
    lastMessage: string | null
    lastMessageAt: string | null
    unreadCount: number | null
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

export function ConversationItem({
    conversationId,
    name,
    avatarUrl,
    lastMessage,
    lastMessageAt,
    unreadCount,
}: ConversationItemProps) {
    const displayName = name ?? 'Utente'
    const hasUnread = (unreadCount ?? 0) > 0

    const timeAgo = lastMessageAt
        ? formatDistanceToNow(new Date(lastMessageAt), {
            addSuffix: true,
            locale: it,
        })
        : ''

    return (
        <Link
            href={`/chat/${conversationId}`}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors rounded-xl group"
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className="size-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                    />
                ) : (
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-slate-100 dark:ring-slate-700">
                        <span className="text-sm font-bold text-primary">
                            {initials(displayName)}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p
                        className={`text-sm truncate ${hasUnread
                                ? 'font-extrabold text-slate-900 dark:text-white'
                                : 'font-semibold text-slate-700 dark:text-slate-200'
                            }`}
                    >
                        {displayName}
                    </p>
                    <span className="text-[11px] text-slate-400 shrink-0">{timeAgo}</span>
                </div>
                <p
                    className={`text-xs truncate mt-0.5 ${hasUnread
                            ? 'font-semibold text-slate-600 dark:text-slate-300'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                >
                    {lastMessage || 'Nessun messaggio'}
                </p>
            </div>

            {/* Unread badge */}
            {hasUnread && (
                <div className="shrink-0 size-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                        {unreadCount! > 9 ? '9+' : unreadCount}
                    </span>
                </div>
            )}
        </Link>
    )
}
