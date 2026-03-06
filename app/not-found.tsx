import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold text-slate-900">
                    Pagina non trovata
                </h2>
                <p className="text-slate-500">
                    La pagina che stai cercando non esiste.
                </p>
                <Link
                    href="/"
                    className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors"
                >
                    Torna alla Home
                </Link>
            </div>
        </main>
    )
}
