'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { Logo } from '@/components/brand/Logo';
import { CommandPalette } from '@/components/CommandPalette';

const NAV_ITEMS = [
    {
        label: 'Home', href: '/dashboard', icon: '🏠',
        items: [
            { href: '/dashboard', icon: '📊', label: 'Dashboard' },
            { href: '/community', icon: '📰', label: 'Feed & Posts', badge: 'NEW' },
            { href: '/network', icon: '🤝', label: 'My Network' },
            { href: '/messages', icon: '💬', label: 'Messages' },
            { href: '/notifications', icon: '🔔', label: 'Notifications' },
        ]
    },
    {
        label: 'Practice', href: '/practice', icon: '💻',
        items: [
            { href: '/daily', icon: '⚡', label: 'Daily Challenge', badge: 'NEW' },
            { href: '/practice', icon: '💻', label: 'Coding Problems' },
            { href: '/problems', icon: '📚', label: 'Problem Bank' },
            { href: '/concepts', icon: '📖', label: 'Knowledge Hub', badge: 'NEW' },
            { href: '/study-plans', icon: '📋', label: 'Study Plans' },
            { href: '/aptitude', icon: '🧠', label: 'Aptitude Practice' },
            { href: '/study-groups', icon: '👥', label: 'Study Groups', badge: 'NEW' },
            { href: '/challenges', icon: '🏆', label: 'Company Challenges' },
        ]
    },
    {
        label: 'Career', href: '/assessment', icon: '🧬',
        items: [
            { href: '/honest-mirror', icon: '🪞', label: 'Honest Mirror' },
            { href: '/placement-probability', icon: '🎯', label: 'Placement Probability', badge: 'NEW' },
            { href: '/assessment', icon: '🧬', label: 'My Assessment' },
            { href: '/careers', icon: '🗺️', label: 'Career Match' },
            { href: '/roadmap', icon: '📍', label: 'My Roadmap' },
            { href: '/salary-truth', icon: '💰', label: 'Salary Truth' },
            { href: '/people-like-you', icon: '👥', label: 'People Like You' },
            { href: '/skills', icon: '✅', label: 'Skill Verification' },
            { href: '/chat', icon: '💬', label: 'AI Career Counselor' },
        ]
    },
    {
        label: 'Compete', href: '/leaderboard', icon: '⚔️',
        items: [
            { href: '/leaderboard', icon: '⚔️', label: 'Campus Wars' },
            { href: '/contests', icon: '🏆', label: 'Contests & Rating', badge: 'NEW' },
            { href: '/battle', icon: '🎮', label: '1v1 Battle' },
            { href: '/campus', icon: '🏅', label: 'College Rankings' },
            { href: '/tracker', icon: '🔥', label: 'Streak Tracker' },
            { href: '/achievements', icon: '🎖️', label: 'Achievements' },
        ]
    },
    {
        label: 'Opportunities', href: '/jobs', icon: '💼',
        items: [
            { href: '/jobs', icon: '💼', label: 'Jobs & Apply' },
            { href: '/internships', icon: '🎯', label: 'Internships' },
            { href: '/resume', icon: '📄', label: 'Resume Builder' },
            { href: '/company-prep', icon: '🎯', label: 'Company Prep Kits', badge: 'NEW' },
            { href: '/company-intel', icon: '🏢', label: 'Company Intel' },
            { href: '/certifications', icon: '🏅', label: 'Certifications' },
            { href: '/simulator', icon: '🎭', label: 'Mock Interview' },
            { href: '/campus-calendar', icon: '📅', label: 'Campus Drives' },
            { href: '/interview-experiences', icon: '📝', label: 'Interview Exp.' },
            { href: '/creator', icon: '✨', label: 'Creator Studio', badge: 'NEW' },
            { href: '/pricing', icon: '💎', label: 'Pro Plans', badge: 'PRO' },
            { href: '/tpo-dashboard', icon: '🏫', label: 'T&P Dashboard' },
        ]
    },
];

const PROFILE_MENU = [
    { href: '/profile', icon: '👤', label: 'My Profile' },
    { href: '/score', icon: '📊', label: 'My Mentixy Score™' },
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMounted(true); }, []);

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

    // Dark mode init
    useEffect(() => {
        const saved = localStorage.getItem('st-dark-mode');
        if (saved === 'true') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const isNavActive = (nav: typeof NAV_ITEMS[0]) =>
        nav.items.some(i => pathname === i.href || pathname?.startsWith(i.href + '/'));

    return (
        <header className="sticky top-0 z-50 bg-[#0a1628]/90 backdrop-blur-xl border-b border-[#1f2a3d]/60 shadow-[0_4px_20px_rgba(3,14,32,0.4)]">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 lg:px-6 h-14" ref={dropdownRef}>

                {/* Left: Logo + Dashboard shortcut */}
                <div className="flex items-center gap-3">
                    <Logo size="sm" href={mounted && user ? '/dashboard' : '/'} />
                    {/* Quick Home/Dashboard link (always visible when logged in) */}
                    {mounted && user && (
                        <Link
                            href="/dashboard"
                            className={`hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${pathname === '/dashboard'
                                    ? 'text-[#ffb955] bg-[#ffb955]/10'
                                    : 'text-[#8e909d] hover:text-[#ffb955] hover:bg-[#ffb955]/5'
                                }`}
                        >
                            <svg className="w-4 h-4" fill={pathname === '/dashboard' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/dashboard' ? 0 : 1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </Link>
                    )}
                </div>

                {/* Center: Nav items (desktop only) */}
                <nav className="hidden lg:flex items-center gap-0.5 mx-4">
                    {NAV_ITEMS.map((nav) => (
                        <div key={nav.label} className="relative">
                            <button
                                onClick={() => setOpenDropdown(openDropdown === nav.label ? null : nav.label)}
                                onMouseEnter={() => setOpenDropdown(nav.label)}
                                className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isNavActive(nav)
                                    ? 'text-[#ffb955] bg-[#ffb955]/10'
                                    : 'text-[#b4c5e0] hover:text-[#d7e3fc] hover:bg-[#1f2a3d]/50'
                                    }`}
                            >
                                {nav.label}
                                <svg className={`w-3 h-3 transition-transform ${openDropdown === nav.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown */}
                            {openDropdown === nav.label && (
                                <div
                                    className="absolute top-full left-0 mt-1 w-60 bg-[#101c2e] rounded-xl shadow-xl border border-[#1f2a3d] py-2 z-50 animate-fadeInUp"
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    {nav.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setOpenDropdown(null)}
                                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${pathname === item.href
                                                ? 'bg-[#ffb955]/10 text-[#ffb955]'
                                                : 'text-[#b4c5e0] hover:bg-[#1f2a3d] hover:text-[#d7e3fc]'
                                                }`}
                                        >
                                            <span className="text-base">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                            {'badge' in item && item.badge && (
                                                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badge === 'PRO' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                                                    }`}>{item.badge}</span>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right: Search + Quick Actions + Profile */}
                <div className="flex items-center gap-1.5">
                    {/* Command Palette Search (Ctrl+K) */}
                    <CommandPalette />

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => {
                            const next = !darkMode;
                            setDarkMode(next);
                            localStorage.setItem('st-dark-mode', String(next));
                            document.documentElement.classList.toggle('dark', next);
                        }}
                        className="p-2 text-[#8e909d] hover:text-[#ffb955] hover:bg-[#1f2a3d] rounded-lg transition-colors"
                        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        <span className="text-base">{darkMode ? '☀️' : '🌙'}</span>
                    </button>

                    {/* Quick action icons (when logged in) — shown after mount to avoid hydration */}
                    {mounted && user && (
                        <>
                            {/* Community/Feed quick link */}
                            <Link
                                href="/community"
                                className={`p-2 rounded-lg transition-colors ${pathname === '/community' ? 'text-[#ffb955] bg-[#ffb955]/10' : 'text-[#8e909d] hover:text-[#d7e3fc] hover:bg-[#1f2a3d]'
                                    }`}
                                title="Feed & Posts"
                            >
                                <svg className="w-5 h-5" fill={pathname === '/community' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/community' ? 0 : 1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </Link>

                            {/* Network quick link */}
                            <Link
                                href="/network"
                                className={`p-2 rounded-lg transition-colors ${pathname === '/network' ? 'text-[#ffb955] bg-[#ffb955]/10' : 'text-[#8e909d] hover:text-[#d7e3fc] hover:bg-[#1f2a3d]'
                                    }`}
                                title="My Network"
                            >
                                <svg className="w-5 h-5" fill={pathname === '/network' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname === '/network' ? 0 : 1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </Link>

                            {/* Notifications */}
                            <Link
                                href="/notifications"
                                className={`relative p-2 rounded-lg transition-colors ${pathname?.startsWith('/notifications') ? 'text-[#ffb955] bg-[#ffb955]/10' : 'text-[#8e909d] hover:text-[#d7e3fc] hover:bg-[#1f2a3d]'
                                    }`}
                                title="Notifications"
                            >
                                <svg className="w-5 h-5" fill={pathname?.startsWith('/notifications') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname?.startsWith('/notifications') ? 0 : 1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                            </Link>

                            {/* Mentixy Score Badge */}
                            <Link href="/score" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#ffb955]/10 border border-[#ffb955]/20 rounded-lg hover:border-[#ffb955]/40 transition-colors">
                                <span className="text-xs font-bold text-[#ffb955]">{user.profile?.mentixy_score || 0}</span>
                                <span className="text-[10px] text-[#ffb955]/70 font-medium">Score</span>
                            </Link>
                        </>
                    )}

                    {/* Profile / Auth section — only render after mount */}
                    {mounted ? (
                        user ? (
                            <div className="relative">
                                <button
                                    onClick={() => { setProfileOpen(!profileOpen); setOpenDropdown(null); }}
                                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#1f2a3d] transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#ffb955] to-[#e09a30] rounded-full flex items-center justify-center text-[#071325] text-xs font-bold ring-2 ring-[#1f2a3d] shadow-sm">
                                        {user.profile?.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                    </div>
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-60 bg-[#101c2e] rounded-xl shadow-xl border border-[#1f2a3d] py-2 z-50 animate-fadeInUp">
                                        {/* User info */}
                                        <div className="px-4 py-3 border-b border-[#1f2a3d]">
                                            <p className="text-sm font-semibold text-[#d7e3fc] truncate">{user.profile?.display_name || user.email.split('@')[0]}</p>
                                            <p className="text-xs text-[#8e909d] truncate">{user.email}</p>
                                        </div>
                                        {PROFILE_MENU.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#b4c5e0] hover:bg-[#1f2a3d] hover:text-[#d7e3fc] transition-colors"
                                            >
                                                <span>{item.icon}</span>
                                                <span className="font-medium">{item.label}</span>
                                            </Link>
                                        ))}
                                        <div className="border-t border-[#1f2a3d] mt-1 pt-1">
                                            <button
                                                onClick={() => { logout(); setProfileOpen(false); }}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-colors w-full text-left"
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
                                <Link href="/login" className="text-sm font-medium text-[#b4c5e0] hover:text-[#ffb955] transition-colors hidden sm:block">Sign In</Link>
                                <Link href="/signup" className="st-btn-primary text-sm py-2 px-4">GET STARTED</Link>
                            </div>
                        )
                    ) : (
                        /* Skeleton placeholder during SSR to prevent hydration mismatch */
                        <div className="w-8 h-8 bg-[#1f2a3d] rounded-full animate-pulse" />
                    )}
                </div>
            </div>

            {/* Mobile menu toggle (lg:hidden) */}
            {mounted && user && (
                <div className="lg:hidden border-t border-[#1f2a3d]">
                    <div className="flex items-center justify-around px-2 py-1.5">
                        <Link
                            href="/community"
                            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs ${pathname === '/community' ? 'text-[#ffb955]' : 'text-[#8e909d]'
                                }`}
                        >
                            <svg className="w-4 h-4" fill={pathname === '/community' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            Feed
                        </Link>
                        <Link
                            href="/network"
                            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs ${pathname === '/network' ? 'text-[#ffb955]' : 'text-[#8e909d]'
                                }`}
                        >
                            <svg className="w-4 h-4" fill={pathname === '/network' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Network
                        </Link>
                        <Link
                            href="/messages"
                            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs ${pathname === '/messages' ? 'text-[#ffb955]' : 'text-[#8e909d]'
                                }`}
                        >
                            <svg className="w-4 h-4" fill={pathname === '/messages' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chat
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
