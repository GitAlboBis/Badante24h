'use client'

import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface MessageInputProps {
    conversationId: string
    senderId: string
}

export function MessageInput({ conversationId, senderId }: MessageInputProps) {
    const [content, setContent] = useState('')
    const [isSending, setIsSending] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    async function handleSubmit(e?: FormEvent) {
        e?.preventDefault()
        const trimmed = content.trim()
        if (!trimmed || isSending) return

        setIsSending(true)

        try {
            const supabase = createClient()

            // 1. Insert the message
            const { error: msgError } = await supabase
                .from('messages')
                .insert({
                    conversation_id: conversationId,
                    sender_id: senderId,
                    content: trimmed,
                })

            if (msgError) throw msgError

            // 2. Update conversation metadata
            await supabase
                .from('conversations')
                .update({
                    last_message_text: trimmed,
                    last_message_at: new Date().toISOString(),
                })
                .eq('id', conversationId)

            setContent('')

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
            }
        } catch (err) {
            console.error('Errore invio messaggio:', err)
        } finally {
            setIsSending(false)
        }
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        // Send on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    function handleInput() {
        // Auto-grow textarea
        const el = textareaRef.current
        if (el) {
            el.style.height = 'auto'
            el.style.height = `${Math.min(el.scrollHeight, 120)}px`
        }
    }

    return (
        <div className="sticky bottom-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800">
            <form
                onSubmit={handleSubmit}
                className="flex items-end gap-2 px-4 py-3 max-w-3xl mx-auto"
            >
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    placeholder="Scrivi un messaggio..."
                    rows={1}
                    className="flex-1 resize-none rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                />
                <button
                    type="submit"
                    disabled={!content.trim() || isSending}
                    className="flex items-center justify-center size-10 rounded-full bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                    {isSending ? (
                        <Loader2 className="size-5 animate-spin" />
                    ) : (
                        <Send className="size-5" />
                    )}
                </button>
            </form>
        </div>
    )
}
