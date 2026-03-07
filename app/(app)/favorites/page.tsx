import { Heart } from 'lucide-react'

export default function FavoritesPage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="size-20 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                <Heart className="size-10 text-pink-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Preferiti</h1>
            <p className="text-slate-500 max-w-sm">
                Presto potrai salvare i profili che ti interessano di più e ritrovarli qui.
                Questa funzionalità è in arrivo!
            </p>
        </div>
    )
}
