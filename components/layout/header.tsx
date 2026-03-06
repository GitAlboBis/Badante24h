import React from 'react'
import Link from 'next/link'
import { Bell, MessageCircle, Search, Users } from 'lucide-react'

export function Header() {
    return (
        <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-8 py-3 flex items-center justify-between border-b border-slate-200 transition-colors">
            <div className="flex items-center gap-2 shrink-0">
                <Link href="/discover" className="flex items-center gap-2">
                    <div className="size-8 md:size-9 bg-primary rounded-lg flex items-center justify-center">
                        <Users className="text-white size-5" />
                    </div>
                    <span className="text-xl md:text-2xl font-bold tracking-tight text-primary">Badante24h</span>
                </Link>
            </div>

            <div className="hidden md:block flex-1 max-w-[500px] mx-8">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors size-5" />
                    <input
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                        placeholder="Cerca nella tua zona..."
                        type="text"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6 shrink-0">
                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                    <Bell className="size-5 md:size-6" />
                </button>

                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors hidden md:block">
                    <MessageCircle className="size-5 md:size-6" />
                    <span className="absolute top-1 right-1 size-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">3</span>
                </button>

                <div className="hidden md:block h-8 w-px bg-slate-200"></div>

                <div className="flex items-center gap-3 cursor-pointer">
                    <span className="text-sm font-semibold hidden lg:block">Marco Rossi</span>
                    <div className="size-10 rounded-full overflow-hidden border-2 border-primary/10 p-0.5">
                        <img
                            alt="Profile avatar"
                            className="w-full h-full rounded-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4FyIHEXobpI2B0ln1kaRe37GOWd94gu7aEbvqqW3iTT7JIlplrVedbJ4Fuqi_0N7BNJ5pI3IFtH6rhzjomi65e06H54kyEii82oDVx1pVQw52R1e1XnOokiiVycRU_kPgTLbSyiT37KdxmfvB7YnqlTNpnvir15DAXlrbp21NqorVrVO_sTJdvVZMHpi0rTGirNWNx0drhTBJDVxqmNmwxUd7Y-iMwlhccZ30RJJ_6g6Lm7hXR_ZO3ltAkVv-8SrQhRocknHc"
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}
