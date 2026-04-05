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
        <aside className="hidden md:flex flex-col w-64 bg-[#0a1628] border-r border-[#1f2a3d] h-screen sticky top-0 overflow-y-auto">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-[#1f2a3d]">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#ffb955] to-[#e09a30] rounded-lg flex items-center justify-center text-[#071325] font-bold text-sm">
                        M
                    </div>
                    <span className="text-lg font-bold text-[#d7e3fc]">Ment<span className="text-[#ffb955]">ixy</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
                {SIDE_NAV.map(({ section, items }) => (
                    <div key={section}>
                        <p className="text-[10px] font-semibold text-[#8e909d] uppercase tracking-wider px-3 mb-1.5">{section}</p>
                        <div className="space-y-0.5">
                            {items.map(({ href, icon, label }) => {
                                const isActive = pathname === href || pathname?.startsWith(href + '/');
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-[#ffb955]/10 text-[#ffb955] shadow-sm'
                                            : 'text-[#b4c5e0] hover:bg-[#1f2a3d] hover:text-[#d7e3fc]'
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
            <div className="border-t border-[#1f2a3d] p-4">
                <Link href="/notifications" className="flex items-center gap-3 px-3 py-2 text-sm text-[#b4c5e0] hover:bg-[#1f2a3d] rounded-lg transition-colors mb-1">
                    <span>🔔</span><span>Notifications</span>
                </Link>
                <Link href="/refer" className="flex items-center gap-3 px-3 py-2 text-sm text-[#b4c5e0] hover:bg-[#1f2a3d] rounded-lg transition-colors mb-1">
                    <span>🎁</span><span>Refer & Earn</span>
                </Link>
                <Link href="/help" className="flex items-center gap-3 px-3 py-2 text-sm text-[#b4c5e0] hover:bg-[#1f2a3d] rounded-lg transition-colors mb-1">
                    <span>❓</span><span>Help Center</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-[#b4c5e0] hover:bg-[#1f2a3d] rounded-lg transition-colors mb-1">
                    <span>⚙️</span><span>Settings</span>
                </Link>
                {user && (
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#ffb955] to-[#e09a30] rounded-full flex items-center justify-center text-[#071325] text-xs font-bold">
                            {(user.profile?.display_name || user.display_name || 'U')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#d7e3fc] truncate">{user.profile?.display_name || user.display_name}</p>
                            <p className="text-[10px] text-[#8e909d] truncate">{user.email}</p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
