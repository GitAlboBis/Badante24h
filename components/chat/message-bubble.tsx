'use client'

import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
    content: string
    createdAt: string | null
    isMine: boolean
}

export function MessageBubble({ content, createdAt, isMine }: MessageBubbleProps) {
    const time = createdAt
        ? format(new Date(createdAt), 'HH:mm', { locale: it })
        : ''

    return (
        <div
            className={cn(
                'flex w-full mb-1.5',
                isMine ? 'justify-end' : 'justify-start'
            )}
        >
            <div
                className={cn(
                    'relative max-w-[75%] px-4 py-2.5 shadow-sm',
                    'transition-all duration-200',
                    isMine
                        ? 'bg-primary text-white rounded-2xl rounded-br-md'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl rounded-bl-md border border-slate-200 dark:border-slate-700'
                )}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {content}
                </p>
                <p
                    className={cn(
                        'text-[10px] mt-1 text-right',
                        isMine
                            ? 'text-white/60'
                            : 'text-slate-400 dark:text-slate-500'
                    )}
                >
                    {time}
                </p>
            </div>
        </div>
    )
}
