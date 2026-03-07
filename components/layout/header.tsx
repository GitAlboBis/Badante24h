'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, MessageCircle, Search, Users, LogOut, Settings, UserCircle, ChevronDown } from 'lucide-react'
import { signOut } from '@/app/(app)/auth-actions'

interface HeaderProps {
    userName: string | null
    avatarUrl: string | null
    unreadCount: number
}

export function Header({ userName, avatarUrl, unreadCount }: HeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const initials = userName
        ? userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : '?'

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

                <Link href="/chat" className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors hidden md:block">
                    <MessageCircle className="size-5 md:size-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 size-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Link>

                <div className="hidden md:block h-8 w-px bg-slate-200"></div>

                {/* User dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <span className="text-sm font-semibold hidden lg:block">{userName ?? 'Utente'}</span>
                        <div className="size-10 rounded-full overflow-hidden border-2 border-primary/10 p-0.5 flex items-center justify-center bg-primary/5">
                            {avatarUrl ? (
                                <img
                                    alt="Profile avatar"
                                    className="w-full h-full rounded-full object-cover"
                                    src={avatarUrl}
                                />
                            ) : (
                                <span className="text-sm font-bold text-primary">{initials}</span>
                            )}
                        </div>
                        <ChevronDown className="size-4 text-slate-400 hidden lg:block" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-14 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            <Link
                                href="/profile/edit"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <UserCircle className="size-4" />
                                Il mio profilo
                            </Link>
                            <Link
                                href="/settings"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <Settings className="size-4" />
                                Impostazioni
                            </Link>
                            <div className="border-t border-slate-100 my-1" />
                            <form action={signOut}>
                                <button
                                    type="submit"
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="size-4" />
                                    Esci
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
