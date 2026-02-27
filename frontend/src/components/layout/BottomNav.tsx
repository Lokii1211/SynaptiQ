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
        href: '/practice', label: 'Practice',
        icon: (active: boolean) => (
            <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        match: ['/practice', '/daily', '/aptitude', '/mock-drive', '/challenges'],
        badge: '⚡',
    },
    {
        href: '/leaderboard', label: 'Compete',
        icon: (active: boolean) => (
            <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
        ),
        match: ['/leaderboard', '/campus', '/tracker', '/achievements'],
    },
    {
        href: '/assessment', label: 'Career',
        icon: (active: boolean) => (
            <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
        ),
        match: ['/assessment', '/careers', '/career', '/roadmap', '/skills', '/chat', '/results', '/score'],
    },
    {
        href: '/settings', label: 'Profile',
        icon: (active: boolean) => (
            <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        match: ['/settings', '/analytics', '/parent', '/refer', '/help', '/u/'],
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
                <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0px)]">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex flex-col items-center justify-center gap-0.5 py-2 px-3.5 min-w-[60px] transition-all duration-200 ${active
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
