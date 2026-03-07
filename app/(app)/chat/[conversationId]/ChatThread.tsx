'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useRealtimeMessages } from '@/hooks/use-realtime-messages'
import { MessageBubble } from '@/components/chat/message-bubble'
import { MessageInput } from '@/components/chat/message-input'
import type { Message } from '@/types'

interface ChatThreadProps {
    conversationId: string
    currentProfiloId: string
    otherUserName: string
    otherUserAvatar: string | null
    initialMessages: Message[]
}

export function ChatThread({
    conversationId,
    currentProfiloId,
    otherUserName,
    otherUserAvatar,
    initialMessages,
}: ChatThreadProps) {
    const messages = useRealtimeMessages(conversationId, initialMessages)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom on new message
    useEffect(() => {
        const el = scrollRef.current
        if (el) {
            el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
        }
    }, [messages.length])

    /** Build initials from a name */
    function initials(name: string): string {
        return name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <div className="flex flex-col h-[calc(100dvh-4rem)] md:h-[calc(100dvh-4.5rem)]">
            {/* ── Chat Header ── */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shrink-0">
                <Link
                    href="/chat"
                    className="flex items-center justify-center size-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft className="size-5 text-slate-500" />
                </Link>

                {otherUserAvatar ? (
                    <img
                        src={otherUserAvatar}
                        alt={otherUserName}
                        className="size-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                    />
                ) : (
                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-slate-100 dark:ring-slate-700">
                        <span className="text-xs font-bold text-primary">
                            {initials(otherUserName)}
                        </span>
                    </div>
                )}

                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {otherUserName}
                    </p>
                </div>
            </div>

            {/* ── Messages Area ── */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5 custom-scrollbar bg-slate-50 dark:bg-slate-950"
            >
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-2">
                            <p className="text-4xl">💬</p>
                            <p className="text-sm text-slate-400 font-medium">
                                Inizia la conversazione con {otherUserName.split(' ')[0]}!
                            </p>
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        content={msg.content}
                        createdAt={msg.created_at}
                        isMine={msg.sender_id === currentProfiloId}
                    />
                ))}
            </div>

            {/* ── Message Input ── */}
            <MessageInput
                conversationId={conversationId}
                senderId={currentProfiloId}
            />
        </div>
    )
}
