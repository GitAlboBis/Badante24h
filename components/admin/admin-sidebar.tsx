'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Utenti', href: '/dashboard/users', icon: Users },
    { label: 'Verifica KYC', href: '/dashboard/verification', icon: ShieldCheck },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        await supabase.auth.signOut()
        router.push('/login')
    }

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard'
        return pathname.startsWith(href)
    }

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-white/10">
                <Link href="/dashboard" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                        B
                    </div>
                    <div>
                        <span className="font-semibold text-white text-sm tracking-tight">
                            Badante24h
                        </span>
                        <span className="block text-[10px] uppercase tracking-widest text-blue-300/70 -mt-0.5">
                            Admin Panel
                        </span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                                active
                                    ? 'bg-blue-600/20 text-blue-300 shadow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    'w-[18px] h-[18px] shrink-0 transition-colors',
                                    active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                                )}
                            />
                            {item.label}
                            {active && (
                                <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-400/60" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full group"
                >
                    <LogOut className="w-[18px] h-[18px] shrink-0 text-slate-500 group-hover:text-red-400 transition-colors" />
                    Esci
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white shadow-lg"
                aria-label="Apri menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={cn(
                    'lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 transition-transform duration-300',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Chiudi menu"
                >
                    <X className="w-5 h-5" />
                </button>
                {sidebarContent}
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-64 shrink-0 bg-slate-900 border-r border-white/5 h-screen sticky top-0">
                {sidebarContent}
            </aside>
        </>
    )
}
