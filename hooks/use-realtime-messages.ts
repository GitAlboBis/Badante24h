'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types'

/**
 * Subscribe to real-time INSERT events on the `messages` table
 * for a specific conversation. Returns a live-updating array.
 */
export function useRealtimeMessages(
    conversationId: string,
    initialMessages: Message[]
) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)

    useEffect(() => {
        // Reset when initial data changes (e.g. navigation)
        setMessages(initialMessages)
    }, [initialMessages])

    useEffect(() => {
        const supabase = createClient()

        const channel = supabase
            .channel(`conversation:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message
                    setMessages((prev) => {
                        // Avoid duplicates (if the sender already inserted optimistically)
                        if (prev.some((m) => m.id === newMessage.id)) return prev
                        return [...prev, newMessage]
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversationId])

    return messages
}
