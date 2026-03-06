export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background flex">
            {/* TODO: Sidebar component */}
            <main className="flex-1">{children}</main>
        </div>
    )
}
