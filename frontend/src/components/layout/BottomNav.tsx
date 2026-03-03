'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    {
        href: '/dashboard', label: 'Home',
        icon: (active: boolean) => (
            <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
        match: ['/dashboard'],
    },
    {
        href: '/community', label: 'Feed',
        icon: (active: boolean) => (
            <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
        ),
        match: ['/community'],
    },
    {
        href: '/network', label: 'Network',
        icon: (active: boolean) => (
            <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        match: ['/network', '/messages'],
    },
    {
        href: '/practice', label: 'Practice',
        icon: (active: boolean) => (
            <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        match: ['/practice', '/daily', '/aptitude', '/mock-drive', '/challenges', '/problems'],
        badge: '⚡',
    },
    {
        href: '/profile', label: 'Profile',
        icon: (active: boolean) => (
            <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        match: ['/profile', '/settings', '/analytics', '/score', '/refer', '/help', '/u/'],
    },
];

export function BottomNav() {
    const pathname = usePathname();

    const isActive = (item: typeof NAV_ITEMS[0]) =>
        item.match.some(m => pathname === m || pathname?.startsWith(m + '/'));

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            {/* Glassmorphism background */}
            <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom,0px)]">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[56px] transition-all duration-200 ${active
                                    ? 'text-indigo-600'
                                    : 'text-slate-400'
                                    }`}
                            >
                                {/* Active indicator bar */}
                                {active && (
                                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-[3px] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-b-full" />
                                )}

                                {/* Icon with badge */}
                                <div className="relative">
                                    {item.icon(active)}
                                    {item.badge && !active && (
                                        <span className="absolute -top-1 -right-1.5 text-[8px]">{item.badge}</span>
                                    )}
                                </div>

                                {/* Label */}
                                <span className={`text-[10px] font-medium leading-tight ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
