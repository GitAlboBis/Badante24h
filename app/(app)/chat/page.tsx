import { redirect } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ConversationItem } from '@/components/chat/conversation-item'
import type { ConversationWithOtherUser } from '@/types'

export default async function InboxPage() {
  const supabase = await createClient()

  // 1. Get the current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/chat')
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

  // 3. Fetch all conversations the user participates in
  const { data: myParticipations } = await supabase
    .from('conversation_participants')
    .select('conversation_id, unread_count')
    .eq('profile_id', profilo.id)

  if (!myParticipations || myParticipations.length === 0) {
    return <EmptyInbox />
  }

  // 4. Build the conversation list with other user info
  const conversationIds = myParticipations.map((p) => p.conversation_id)

  // Fetch conversations
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, last_message_text, last_message_at')
    .in('id', conversationIds)
    .order('last_message_at', { ascending: false })

  if (!conversations || conversations.length === 0) {
    return <EmptyInbox />
  }

  // Fetch other participants for all conversations
  const { data: otherParticipants } = await supabase
    .from('conversation_participants')
    .select('conversation_id, profile_id')
    .in('conversation_id', conversationIds)
    .neq('profile_id', profilo.id)

  // Fetch profiles for other participants
  const otherProfileIds = [
    ...new Set(otherParticipants?.map((p) => p.profile_id) ?? []),
  ]

  const { data: otherProfiles } = await supabase
    .from('profili')
    .select('id, nome, avatar_url')
    .in('id', otherProfileIds)

  // Build a lookup map
  const profileMap = new Map(
    (otherProfiles ?? []).map((p) => [p.id, p])
  )
  const participantMap = new Map(
    (otherParticipants ?? []).map((p) => [p.conversation_id, p.profile_id])
  )
  const unreadMap = new Map(
    myParticipations.map((p) => [p.conversation_id, p.unread_count])
  )

  // 5. Assemble the final list
  const items: ConversationWithOtherUser[] = conversations.map((conv) => {
    const otherProfileId = participantMap.get(conv.id)
    const otherProfile = otherProfileId
      ? profileMap.get(otherProfileId)
      : null

    return {
      conversation_id: conv.id,
      last_message_text: conv.last_message_text,
      last_message_at: conv.last_message_at,
      unread_count: unreadMap.get(conv.id) ?? 0,
      other_user: {
        profilo_id: otherProfileId ?? '',
        nome: otherProfile?.nome ?? null,
        avatar_url: otherProfile?.avatar_url ?? null,
      },
    }
  })

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 md:pt-8">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Messaggi
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {items.length} conversazion{items.length === 1 ? 'e' : 'i'}
        </p>
      </div>

      {/* Conversation List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {items.map((item) => (
          <ConversationItem
            key={item.conversation_id}
            conversationId={item.conversation_id}
            name={item.other_user.nome}
            avatarUrl={item.other_user.avatar_url}
            lastMessage={item.last_message_text}
            lastMessageAt={item.last_message_at}
            unreadCount={item.unread_count}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Empty State ── */
function EmptyInbox() {
  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="px-4 pt-6 pb-3 md:pt-8">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Messaggi
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <MessageSquare className="size-10 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">
          Nessuna conversazione
        </h2>
        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
          Quando contatterai una badante dal suo profilo, le tue conversazioni
          appariranno qui.
        </p>
      </div>
    </div>
  )
}
