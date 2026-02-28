'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type SearchResult = {
    title: string;
    subtitle?: string;
    icon: string;
    href: string;
    category: string;
};

const ALL_PAGES: SearchResult[] = [
    // Core
    { title: 'Dashboard', subtitle: 'Your home base', icon: '🏠', href: '/dashboard', category: 'Navigation' },
    { title: 'Analytics', subtitle: 'Growth insights', icon: '📊', href: '/analytics', category: 'Navigation' },
    { title: 'Score Breakdown', subtitle: 'Your Viya Score™', icon: '⭐', href: '/score', category: 'Navigation' },
    { title: 'Settings', subtitle: 'Profile & privacy', icon: '⚙️', href: '/settings', category: 'Navigation' },

    // Practice
    { title: 'Coding Arena', subtitle: 'Solve problems', icon: '💻', href: '/practice', category: 'Practice' },
    { title: 'Aptitude Engine', subtitle: 'Quant, Logical, Verbal', icon: '🧠', href: '/aptitude', category: 'Practice' },
    { title: 'Daily Challenge', subtitle: "Today's problem", icon: '📅', href: '/daily', category: 'Practice' },
    { title: 'Challenges', subtitle: 'Weekly missions', icon: '🏆', href: '/challenges', category: 'Practice' },

    // Career
    { title: 'Career Explorer', subtitle: '300+ career paths', icon: '🧭', href: '/careers', category: 'Career' },
    { title: 'Assessment', subtitle: 'Career personality test', icon: '🧬', href: '/assessment', category: 'Career' },
    { title: 'Results', subtitle: 'Assessment results', icon: '📋', href: '/results', category: 'Career' },
    { title: 'Career Simulator', subtitle: 'AI day-in-the-life', icon: '🎮', href: '/simulator', category: 'Career' },
    { title: 'First 90 Days', subtitle: 'Job readiness plan', icon: '🗓️', href: '/first-90-days', category: 'Career' },

    // Jobs
    { title: 'Jobs', subtitle: 'Find opportunities', icon: '💼', href: '/jobs', category: 'Opportunities' },
    { title: 'Internships', subtitle: 'Student internships', icon: '🎓', href: '/internships', category: 'Opportunities' },
    { title: 'Companies', subtitle: 'Company profiles', icon: '🏢', href: '/companies', category: 'Opportunities' },
    { title: 'Resume Builder', subtitle: 'AI-powered resume', icon: '📄', href: '/resume', category: 'Opportunities' },

    // Learning
    { title: 'Skills Market', subtitle: 'Verify your skills', icon: '✅', href: '/skill-market', category: 'Learning' },
    { title: 'Learning Roadmaps', subtitle: 'AI planning', icon: '🛣️', href: '/roadmap', category: 'Learning' },
    { title: 'Side Income Guide', subtitle: 'Earn while learning', icon: '💰', href: '/side-income', category: 'Learning' },

    // Community
    { title: 'Community', subtitle: 'Posts & discussions', icon: '🗣️', href: '/community', category: 'Social' },
    { title: 'Messages', subtitle: 'Direct messages', icon: '💬', href: '/messages', category: 'Social' },
    { title: 'Leaderboard', subtitle: 'Global rankings', icon: '🏅', href: '/leaderboard', category: 'Social' },
    { title: 'Campus Wars', subtitle: 'College competition', icon: '⚔️', href: '/campus', category: 'Social' },
    { title: 'Network', subtitle: 'Find peers', icon: '🤝', href: '/network', category: 'Social' },

    // Problem Bank
    { title: 'Problem Bank', subtitle: '40+ DSA problems', icon: '📚', href: '/problems', category: 'Practice' },
    { title: 'Study Plans', subtitle: 'Structured prep paths', icon: '📋', href: '/study-plans', category: 'Practice' },
    { title: 'Company Intel', subtitle: 'Interview prep', icon: '🏢', href: '/company-intel', category: 'Opportunities' },
    { title: 'Interview Experiences', subtitle: 'Real student accounts', icon: '📝', href: '/interview-experiences', category: 'Practice' },

    // Certifications
    { title: 'Certifications', subtitle: 'Earn verified credentials', icon: '🏅', href: '/certifications', category: 'Learning' },

    // Career Intelligence
    { title: 'Honest Mirror', subtitle: 'Career reality check', icon: '🪞', href: '/honest-mirror', category: 'Career' },
    { title: 'Salary Truth', subtitle: 'CTC → in-hand calculator', icon: '💰', href: '/salary-truth', category: 'Career' },

    // Tools
    { title: 'Streak Tracker', subtitle: 'Maintain your streak', icon: '🔥', href: '/tracker', category: 'Tools' },
    { title: 'AI Chat', subtitle: 'Career assistant', icon: '🤖', href: '/chat', category: 'Tools' },
    { title: 'Notifications', subtitle: 'Updates & alerts', icon: '🔔', href: '/notifications', category: 'Tools' },
    { title: 'Notification Settings', subtitle: 'Smart alert rules', icon: '⚙️', href: '/notifications/settings', category: 'Tools' },
    { title: 'Referrals', subtitle: 'Invite friends', icon: '🎁', href: '/referrals', category: 'Tools' },
];

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Ctrl+K to open
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
                setQuery('');
                setSelectedIndex(0);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const filtered = query.trim()
        ? ALL_PAGES.filter(p =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        )
        : ALL_PAGES.slice(0, 8); // Show top 8 when empty

    // Group by category
    const grouped: Record<string, SearchResult[]> = {};
    filtered.forEach(r => {
        if (!grouped[r.category]) grouped[r.category] = [];
        grouped[r.category].push(r);
    });

    const flatResults = filtered;

    const handleSelect = useCallback((result: SearchResult) => {
        setIsOpen(false);
        router.push(result.href);
    }, [router]);

    // Keyboard nav
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, flatResults.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
            handleSelect(flatResults[selectedIndex]);
        }
    };

    return (
        <>
            {/* Trigger button (in TopBar) */}
            <button
                onClick={() => { setIsOpen(true); setQuery(''); setSelectedIndex(0); }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-500 transition-colors border border-slate-200"
            >
                <span>🔍</span>
                <span className="text-xs">Search...</span>
                <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">⌘K</kbd>
            </button>

            {/* Mobile trigger */}
            <button
                onClick={() => { setIsOpen(true); setQuery(''); setSelectedIndex(0); }}
                className="sm:hidden text-slate-500 hover:text-slate-700 p-1"
            >
                🔍
            </button>

            {/* Command Palette Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dialog */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden border border-slate-200"
                        >
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                                <span className="text-slate-400">🔍</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search pages, features, tools..."
                                    className="flex-1 text-sm text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
                                />
                                <kbd className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded font-mono">ESC</kbd>
                            </div>

                            {/* Results */}
                            <div className="max-h-[50vh] overflow-y-auto py-2">
                                {Object.entries(grouped).map(([category, results]) => (
                                    <div key={category}>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider px-4 py-1.5">{category}</p>
                                        {results.map((result, i) => {
                                            const globalIndex = flatResults.indexOf(result);
                                            return (
                                                <button
                                                    key={result.href}
                                                    onClick={() => handleSelect(result)}
                                                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${globalIndex === selectedIndex ? 'bg-indigo-50 text-indigo-900' : 'text-slate-700 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <span className="text-lg w-7 text-center">{result.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{result.title}</p>
                                                        {result.subtitle && (
                                                            <p className="text-[11px] text-slate-400 truncate">{result.subtitle}</p>
                                                        )}
                                                    </div>
                                                    {globalIndex === selectedIndex && (
                                                        <span className="text-[10px] text-indigo-400 font-medium">↵ Enter</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                                {filtered.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-slate-400 text-sm">No results for &quot;{query}&quot;</p>
                                        <p className="text-slate-300 text-xs mt-1">Try a different search term</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-slate-100 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400">
                                <div className="flex items-center gap-3">
                                    <span>↑↓ Navigate</span>
                                    <span>↵ Select</span>
                                    <span>Esc Close</span>
                                </div>
                                <span className="text-indigo-400 font-medium">SkillTen Search</span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
