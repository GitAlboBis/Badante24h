import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-950 flex">
            <AdminSidebar />
            <main className="flex-1 min-w-0 lg:pl-0 pl-0">
                <div className="p-6 lg:p-8 pt-16 lg:pt-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
