import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatThread } from './ChatThread'
import type { Message } from '@/types'

interface PageProps {
    params: Promise<{ conversationId: string }>
}

export default async function ChatPage({ params }: PageProps) {
    const { conversationId } = await params
    const supabase = await createClient()

    // 1. Get the current authenticated user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?redirect=/chat/' + conversationId)
    }

    // 2. Get the current user's profilo_id
    const { data: profilo } = await supabase
        .from('profili')
        .select('id')
        .eq('utente_id', user.id)
        .single()

    if (!profilo) {
        redirect('/onboarding')
    }

    // 3. Verify the user is a participant in this conversation
    const { data: participation } = await supabase
        .from('conversation_participants')
        .select('id')
        .eq('conversation_id', conversationId)
        .eq('profile_id', profilo.id)
        .single()

    if (!participation) {
        notFound()
    }

    // 4. Fetch the other participant's profile
    const { data: otherParticipant } = await supabase
        .from('conversation_participants')
        .select('profile_id')
        .eq('conversation_id', conversationId)
        .neq('profile_id', profilo.id)
        .single()

    let otherUserName = 'Utente'
    let otherUserAvatar: string | null = null

    if (otherParticipant) {
        const { data: otherProfile } = await supabase
            .from('profili')
            .select('nome, avatar_url')
            .eq('id', otherParticipant.profile_id)
            .single()

        if (otherProfile) {
            otherUserName = otherProfile.nome ?? 'Utente'
            otherUserAvatar = otherProfile.avatar_url
        }
    }

    // 5. Fetch initial messages, ordered by created_at ASC
    const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

    const messages: Message[] = messagesData ?? []

    // 6. Reset unread count for the current user
    await supabase
        .from('conversation_participants')
        .update({ unread_count: 0 })
        .eq('conversation_id', conversationId)
        .eq('profile_id', profilo.id)

    return (
        <ChatThread
            conversationId={conversationId}
            currentProfiloId={profilo.id}
            otherUserName={otherUserName}
            otherUserAvatar={otherUserAvatar}
            initialMessages={messages}
        />
    )
}
