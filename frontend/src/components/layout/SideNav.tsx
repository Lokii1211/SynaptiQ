'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/api';

const SIDE_NAV = [
    {
        section: 'Main', items: [
            { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
            { href: '/assessment', icon: '🧬', label: 'Assessment' },
            { href: '/score', icon: '📈', label: 'Score' },
            { href: '/careers', icon: '🗺️', label: 'Careers' },
        ]
    },
    {
        section: 'Learn & Practice', items: [
            { href: '/practice', icon: '💻', label: 'Coding Arena' },
            { href: '/aptitude', icon: '🧠', label: 'Aptitude Engine' },
            { href: '/learn', icon: '📚', label: 'Learning Hub' },
            { href: '/roadmap', icon: '🗺️', label: 'My Roadmap' },
            { href: '/skills', icon: '🎯', label: 'Skill Analyzer' },
            { href: '/courses', icon: '📖', label: 'Free Courses' },
            { href: '/daily', icon: '📅', label: 'Daily Quests' },
            { href: '/challenges', icon: '🏆', label: 'Challenges' },
            { href: '/achievements', icon: '🎖️', label: 'Achievements' },
        ]
    },
    {
        section: 'Opportunities', items: [
            { href: '/jobs', icon: '💼', label: 'Jobs' },
            { href: '/internships', icon: '🎯', label: 'Internships' },
            { href: '/resume', icon: '📄', label: 'Resume Builder' },
            { href: '/company-intel', icon: '🏢', label: 'Companies' },
            { href: '/negotiate', icon: '💰', label: 'Negotiate' },
            { href: '/simulator', icon: '🎭', label: 'Mock Interview' },
            { href: '/mock-drive', icon: '🏢', label: 'Mock Drive' },
            { href: '/side-income', icon: '💸', label: 'Side Income' },
        ]
    },
    {
        section: 'Community', items: [
            { href: '/chat', icon: '💬', label: 'AI Chat' },
            { href: '/network', icon: '🤝', label: 'Network' },
            { href: '/community', icon: '🗣️', label: 'Community' },
            { href: '/leaderboard', icon: '🏅', label: 'Leaderboard' },
            { href: '/people-like-you', icon: '👥', label: 'Similar Peers' },
        ]
    },
    {
        section: 'Insights', items: [
            { href: '/analytics', icon: '📊', label: 'Analytics' },
            { href: '/skill-market', icon: '📈', label: 'Skill Market' },
            { href: '/campus', icon: '⚔️', label: 'Campus Wars' },
            { href: '/college-roi', icon: '🧮', label: 'College ROI' },
            { href: '/tracker', icon: '🔥', label: 'Streak Tracker' },
            { href: '/first-90-days', icon: '🚀', label: 'First 90 Days' },
            { href: '/parent', icon: '👨‍👩‍👧', label: 'For Parents' },
        ]
    },
];

export function SideNav() {
    const pathname = usePathname();
    const user = auth.getUser();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 overflow-y-auto">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-slate-100">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        ST
                    </div>
                    <span className="text-lg font-bold text-slate-900">Skill<span className="text-indigo-600">Ten</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
                {SIDE_NAV.map(({ section, items }) => (
                    <div key={section}>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5">{section}</p>
                        <div className="space-y-0.5">
                            {items.map(({ href, icon, label }) => {
                                const isActive = pathname === href || pathname?.startsWith(href + '/');
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <span className="text-base">{icon}</span>
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* User profile */}
            <div className="border-t border-slate-100 p-4">
                <Link href="/notifications" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors mb-1">
                    <span>🔔</span><span>Notifications</span>
                </Link>
                <Link href="/refer" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors mb-1">
                    <span>🎁</span><span>Refer & Earn</span>
                </Link>
                <Link href="/help" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors mb-1">
                    <span>❓</span><span>Help Center</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors mb-1">
                    <span>⚙️</span><span>Settings</span>
                </Link>
                {user && (
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {(user.profile?.display_name || user.display_name || 'U')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user.profile?.display_name || user.display_name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
