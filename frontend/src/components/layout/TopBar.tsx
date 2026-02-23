'use client';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth.store';

export function TopBar() {
    const { user, logout } = useAuthStore();

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-200">
            <div className="flex items-center justify-between px-4 md:px-6 py-3">
                {/* Mobile logo */}
                <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                        ST
                    </div>
                    <span className="text-base font-bold text-slate-900">Skill<span className="text-indigo-600">Ten</span></span>
                </Link>

                {/* Search (desktop) */}
                <div className="hidden md:flex flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search careers, skills, companies..."
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-3">
                    <Link href="/notifications" className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors">
                        <span className="text-lg">🔔</span>
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {user.profile?.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                            </div>
                            <span className="hidden md:block text-sm font-medium text-slate-700">
                                {user.profile?.display_name || user.email.split('@')[0]}
                            </span>
                        </div>
                    ) : (
                        <Link href="/login" className="st-btn-primary text-sm py-2 px-4">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
