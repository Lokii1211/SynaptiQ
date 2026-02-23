'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { href: '/dashboard', icon: '🏠', label: 'Home' },
    { href: '/practice', icon: '💻', label: 'Code' },
    { href: '/chat', icon: '💬', label: 'AI Chat' },
    { href: '/jobs', icon: '💼', label: 'Jobs' },
    { href: '/score', icon: '📊', label: 'Score' },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 z-50 md:hidden safe-area-pb">
            <div className="flex items-center justify-around py-2 px-1">
                {NAV_ITEMS.map(({ href, icon, label }) => {
                    const isActive = pathname === href || pathname?.startsWith(href + '/');
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${isActive
                                    ? 'text-indigo-600'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <span className="text-xl leading-none">{icon}</span>
                            <span className={`text-[10px] font-medium ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
                                {label}
                            </span>
                            {isActive && (
                                <div className="absolute top-0 w-8 h-0.5 bg-indigo-600 rounded-b-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
