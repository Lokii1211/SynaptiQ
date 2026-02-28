'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { Logo } from '@/components/brand/Logo';
import { CommandPalette } from '@/components/CommandPalette';

const NAV_ITEMS = [
    {
        label: 'Practice', href: '/practice',
        items: [
            { href: '/daily', icon: '⚡', label: 'Daily Challenge', badge: 'NEW' },
            { href: '/practice', icon: '💻', label: 'Coding Problems' },
            { href: '/problems', icon: '📚', label: 'Problem Bank' },
            { href: '/study-plans', icon: '📋', label: 'Study Plans', badge: 'NEW' },
            { href: '/aptitude', icon: '🧠', label: 'Aptitude Practice' },
            { href: '/interview-experiences', icon: '📝', label: 'Interview Experiences', badge: 'NEW' },
            { href: '/challenges', icon: '🏆', label: 'Company Challenges' },
        ]
    },
    {
        label: 'Career', href: '/assessment',
        items: [
            { href: '/honest-mirror', icon: '🪞', label: 'Honest Mirror', badge: 'NEW' },
            { href: '/assessment', icon: '🧬', label: 'My Assessment' },
            { href: '/careers', icon: '🗺️', label: 'Career Match' },
            { href: '/roadmap', icon: '📍', label: 'My Roadmap' },
            { href: '/salary-truth', icon: '💰', label: 'Salary Truth', badge: 'NEW' },
            { href: '/skills', icon: '✅', label: 'Skill Verification' },
            { href: '/chat', icon: '💬', label: 'AI Career Counselor' },
        ]
    },
    {
        label: 'Compete', href: '/leaderboard',
        items: [
            { href: '/leaderboard', icon: '⚔️', label: 'Campus Wars' },
            { href: '/battle', icon: '🎮', label: '1v1 Battle', badge: 'NEW' },
            { href: '/campus', icon: '🏅', label: 'College Rankings' },
            { href: '/tracker', icon: '🔥', label: 'Streak Tracker' },
            { href: '/achievements', icon: '🎖️', label: 'Achievements' },
            { href: '/messages', icon: '💬', label: 'Messages', badge: 'NEW' },
        ]
    },
    {
        label: 'Opportunities', href: '/jobs',
        items: [
            { href: '/jobs', icon: '💼', label: 'Jobs & Apply' },
            { href: '/internships', icon: '🎯', label: 'Internships' },
            { href: '/resume', icon: '📄', label: 'Resume Builder' },
            { href: '/company-intel', icon: '🏢', label: 'Company Intel' },
            { href: '/certifications', icon: '🏅', label: 'Certifications', badge: 'NEW' },
            { href: '/simulator', icon: '🎭', label: 'Mock Interview' },
            { href: '/campus-calendar', icon: '📅', label: 'Campus Drives', badge: 'NEW' },
            { href: '/interview-experiences', icon: '📝', label: 'Interview Exp.' },
            { href: '/pricing', icon: '💎', label: 'Pro Plans', badge: 'PRO' },
            { href: '/tpo-dashboard', icon: '🏫', label: 'T&P Dashboard' },
        ]
    },
];

const PROFILE_MENU = [
    { href: '/profile', icon: '👤', label: 'My Profile' },
    { href: '/score', icon: '📊', label: 'My Viya Score™' },
    { href: '/analytics', icon: '📈', label: 'Analytics' },
    { href: '/learn', icon: '📚', label: 'Learning Hub' },
    { href: '/refer', icon: '🎁', label: 'Refer & Earn' },
    { href: '/settings', icon: '⚙️', label: 'Settings' },
    { href: '/help', icon: '❓', label: 'Help Center' },
];

export function TopBar() {
    const { user, logout } = useAuthStore();
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenDropdown(null);
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isNavActive = (nav: typeof NAV_ITEMS[0]) =>
        nav.items.some(i => pathname === i.href || pathname?.startsWith(i.href + '/'));

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 lg:px-6 h-14" ref={dropdownRef}>

                {/* Left: Logo */}
                <Logo size="sm" href={user ? '/dashboard' : '/'} />

                {/* Center: Nav items (desktop only) */}
                <nav className="hidden lg:flex items-center gap-1 mx-6">
                    {NAV_ITEMS.map((nav) => (
                        <div key={nav.label} className="relative">
                            <button
                                onClick={() => setOpenDropdown(openDropdown === nav.label ? null : nav.label)}
                                onMouseEnter={() => setOpenDropdown(nav.label)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isNavActive(nav)
                                    ? 'text-indigo-700 bg-indigo-50'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {nav.label}
                                <svg className={`w-3.5 h-3.5 transition-transform ${openDropdown === nav.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown */}
                            {openDropdown === nav.label && (
                                <div
                                    className="absolute top-full left-0 mt-1 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeInUp"
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    {nav.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setOpenDropdown(null)}
                                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${pathname === item.href
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <span className="text-base">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                            {'badge' in item && item.badge && (
                                                <span className="ml-auto text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-full">{item.badge}</span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right: Search + Notifications + Score + Profile */}
                <div className="flex items-center gap-2">
                    {/* Command Palette Search (PRO Bible 5.1 — Ctrl+K) */}
                    <CommandPalette />

                    {/* Notifications */}
                    <Link href="/notifications" className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                    </Link>

                    {/* Viya Score Badge */}
                    {user && (
                        <Link href="/score" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-lg hover:border-indigo-200 transition-colors">
                            <span className="text-xs font-bold text-indigo-700">742</span>
                            <span className="text-[10px] text-indigo-500 font-medium">Score</span>
                        </Link>
                    )}

                    {/* Profile */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => { setProfileOpen(!profileOpen); setOpenDropdown(null); }}
                                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
                                    {user.profile?.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                </div>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeInUp">
                                    {/* User info */}
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{user.profile?.display_name || user.email.split('@')[0]}</p>
                                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    {PROFILE_MENU.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                        >
                                            <span>{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    ))}
                                    <div className="border-t border-slate-100 mt-1 pt-1">
                                        <button
                                            onClick={() => { logout(); setProfileOpen(false); }}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors w-full text-left"
                                        >
                                            <span>🚪</span>
                                            <span className="font-medium">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">Sign In</Link>
                            <Link href="/signup" className="st-btn-primary text-sm py-2 px-4">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
