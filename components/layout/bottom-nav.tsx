'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, MessageSquare, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
    const pathname = usePathname()

    const tabs = [
        { name: 'Discovery', icon: Compass, href: '/discover' },
        { name: 'Messaggi', icon: MessageSquare, href: '/chat' },
        { name: 'Preferiti', icon: Heart, href: '/favorites' },
        { name: 'Profilo', icon: User, href: '/profile/edit' },
    ]

    return (
        <nav className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
            {tabs.map((tab) => {
                const Icon = tab.icon
                // Base logic for active tab coloring
                const isActive = pathname.startsWith(tab.href)

                return (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-colors",
                            isActive ? "text-primary" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <Icon className={cn("size-6", isActive && "fill-current")} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.name}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
