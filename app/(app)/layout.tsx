import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { createClient } from '@/lib/supabase/server'

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userName: string | null = null
    let avatarUrl: string | null = null
    let unreadCount = 0

    if (user) {
        const { data: profile } = await supabase
            .from('profili')
            .select('id, nome, avatar_url')
            .eq('utente_id', user.id)
            .single()

        if (profile) {
            userName = profile.nome
            avatarUrl = profile.avatar_url

            // Sum all unread_count across conversations for this profile
            const { data: participants } = await supabase
                .from('conversation_participants')
                .select('unread_count')
                .eq('profile_id', profile.id)

            if (participants) {
                unreadCount = participants.reduce((sum, p) => sum + (p.unread_count ?? 0), 0)
            }
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0 relative">
            <Header userName={userName} avatarUrl={avatarUrl} unreadCount={unreadCount} />
            <main className="flex-1 flex flex-col">{children}</main>
            <BottomNav />
        </div>
    )
}
