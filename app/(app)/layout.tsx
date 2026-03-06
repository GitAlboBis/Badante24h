import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0 relative">
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <BottomNav />
        </div>
    )
}
