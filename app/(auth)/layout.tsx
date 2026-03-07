export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 p-8">
                    {children}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    © {new Date().getFullYear()} Badante24h — Tutti i diritti
                    riservati
                </p>
            </div>
        </div>
    )
}
