'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { auth } from '@/lib/api';
import Link from 'next/link';

/* ═══ Contest Types ═══ */
interface Contest {
    id: string; name: string; type: 'weekly' | 'biweekly' | 'company' | 'rapid' | 'marathon' | 'college-cup';
    status: 'upcoming' | 'live' | 'ended'; startTime: string; duration: string;
    problems: number; difficulty: string; registeredCount: number; company?: string;
    prizes?: string[]; description: string; ratingChange?: string;
}

interface PastResult {
    contestName: string; rank: number; totalParticipants: number; solved: number;
    totalProblems: number; ratingChange: number; date: string; percentile: number;
}

const CONTESTS: Contest[] = [
    {
        id: 'w48', name: 'Mentixy Weekly Sprint #48', type: 'weekly', status: 'upcoming',
        startTime: 'Sunday 9:00 AM IST', duration: '90 min', problems: 4,
        difficulty: 'Easy + Med + Med + Hard', registeredCount: 1247,
        description: '4 problems in 90 minutes. Rating change: ±20 to ±80. Solve fast, climb ranks!',
        ratingChange: '±20 to ±80',
    },
    {
        id: 'rf12', name: 'Rapid Fire #12', type: 'rapid', status: 'live',
        startTime: 'NOW — ends in 18 min', duration: '30 min', problems: 3,
        difficulty: '3 Easy — Speed Matters', registeredCount: 892,
        description: '30 minutes, 3 Easy problems. Fastest wins. Pure speed contest.',
    },
    {
        id: 'tcs-05', name: 'TCS CodeVita Qualifier', type: 'company', status: 'upcoming',
        startTime: 'Mar 5, 2026 · 2:00 PM', duration: '120 min', problems: 5,
        difficulty: 'Medium + Hard', registeredCount: 4523, company: 'TCS',
        description: 'Official TCS CodeVita qualifier round. Top performers get fast-tracked for interviews.',
        prizes: ['Direct interview at TCS', 'Certificate of Excellence', 'Goodies'],
    },
    {
        id: 'cc-mar', name: 'Mentixy College Cup — March', type: 'college-cup', status: 'upcoming',
        startTime: 'Mar 15, 2026 · 10:00 AM', duration: '3 hours', problems: 6,
        difficulty: 'Easy to Hard', registeredCount: 3891,
        description: 'Monthly inter-college competition. Your score contributes to Campus Wars!',
        prizes: ['🏆 Trophy for winning college', '📜 Certificates for top 5%', '🏅 Campus Wars bonus points'],
    },
    {
        id: 'bw24', name: 'Biweekly Challenge #24', type: 'biweekly', status: 'upcoming',
        startTime: 'Mar 8, 2026 · 8:00 PM', duration: '2 hours', problems: 4,
        difficulty: 'Med + Med + Hard + Hard', registeredCount: 689,
        description: 'Harder distribution than Weekly Sprint. For serious competitive programmers.',
        ratingChange: '±30 to ±100',
    },
    {
        id: 'mar-01', name: 'Mentixy Marathon — System Design', type: 'marathon', status: 'upcoming',
        startTime: 'Mar 1-7, 2026', duration: '7 days', problems: 1,
        difficulty: '1 Complex Real-World Problem', registeredCount: 234,
        description: 'Design and implement a complete system. LLD + HLD. 7 days to build.',
    },
];

const PAST_RESULTS: PastResult[] = [
    { contestName: 'Weekly Sprint #47', rank: 234, totalParticipants: 1102, solved: 3, totalProblems: 4, ratingChange: 42, date: 'Feb 25', percentile: 78.8 },
    { contestName: 'Rapid Fire #11', rank: 67, totalParticipants: 756, solved: 3, totalProblems: 3, ratingChange: 28, date: 'Feb 22', percentile: 91.1 },
    { contestName: 'Weekly Sprint #46', rank: 412, totalParticipants: 1089, solved: 2, totalProblems: 4, ratingChange: -15, date: 'Feb 18', percentile: 62.2 },
    { contestName: 'College Cup — Feb', rank: 89, totalParticipants: 3421, solved: 4, totalProblems: 6, ratingChange: 65, date: 'Feb 15', percentile: 97.4 },
    { contestName: 'Biweekly #23', rank: 189, totalParticipants: 634, solved: 2, totalProblems: 4, ratingChange: 12, date: 'Feb 8', percentile: 70.2 },
];

const RATING_TIERS = [
    { name: 'Beginner', color: 'text-amber-800 bg-amber-100', range: '< 1200', icon: '🟤' },
    { name: 'Learner', color: 'text-slate-600 bg-slate-100', range: '1200-1500', icon: '⚪' },
    { name: 'Competitor', color: 'text-emerald-700 bg-emerald-100', range: '1500-1800', icon: '🟢' },
    { name: 'Expert', color: 'text-blue-700 bg-blue-100', range: '1800-2100', icon: '🔵' },
    { name: 'Master', color: 'text-purple-700 bg-purple-100', range: '2100-2400', icon: '🟣' },
    { name: 'Grandmaster', color: 'text-red-700 bg-red-100', range: '2400+', icon: '🔴' },
];

export default function ContestsPage() {
    const [tab, setTab] = useState<'upcoming' | 'past' | 'rating' | 'virtual'>('upcoming');
    const [filterType, setFilterType] = useState<string>('all');
    const myRating = 1623;
    const myTier = RATING_TIERS.find(t => {
        const [min] = t.range.replace('+', '-9999').split('-').map(Number);
        return myRating >= min;
    }) || RATING_TIERS[2];

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const filteredContests = filterType === 'all' ? CONTESTS : CONTESTS.filter(c => c.type === filterType);

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
                {/* Header + Rating Badge */}
                <div className="flex items-start justify-between mb-6">
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-2xl font-bold text-slate-900 st-font-heading">🏆 Contests & Compete</h1>
                        <p className="text-sm text-slate-500 mt-1">Weekly sprints, company contests, and college cups</p>
                    </motion.div>
                    {/* My Rating Card */}
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="st-card p-3 text-center min-w-[120px]">
                        <p className="text-2xl font-bold text-slate-900">{myRating}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${myTier.color}`}>
                            {myTier.icon} {myTier.name}
                        </span>
                        <p className="text-[9px] text-slate-400 mt-1">Contest Rating</p>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 border border-slate-200 overflow-x-auto">
                    {([
                        { id: 'upcoming', label: '📅 Upcoming', count: CONTESTS.filter(c => c.status !== 'ended').length },
                        { id: 'past', label: '📊 My Results', count: PAST_RESULTS.length },
                        { id: 'rating', label: '📈 Rating History' },
                        { id: 'virtual', label: '🔄 Virtual Contest' },
                    ] as const).map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.id
                                ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                            {t.label} {'count' in t ? <span className="ml-1 opacity-70">({t.count})</span> : null}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* ═══ Upcoming Contests ═══ */}
                    {tab === 'upcoming' && (
                        <motion.div key="upcoming" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {/* Type Filter */}
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                                {[
                                    { id: 'all', label: 'All' }, { id: 'weekly', label: 'Weekly Sprint' },
                                    { id: 'rapid', label: 'Rapid Fire' }, { id: 'company', label: 'Company' },
                                    { id: 'college-cup', label: 'College Cup' }, { id: 'biweekly', label: 'Biweekly' },
                                    { id: 'marathon', label: 'Marathon' },
                                ].map(f => (
                                    <button key={f.id} onClick={() => setFilterType(f.id)}
                                        className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${filterType === f.id
                                            ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            {/* LIVE Contest Banner */}
                            {CONTESTS.filter(c => c.status === 'live').map(contest => (
                                <motion.div key={contest.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 rounded-2xl p-5 mb-5 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full">
                                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            LIVE NOW
                                        </span>
                                        <span className="text-xs opacity-80">{contest.startTime}</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-1">{contest.name}</h3>
                                    <p className="text-sm opacity-80 mb-3">{contest.description}</p>
                                    <div className="flex items-center gap-4">
                                        <Link href="/problems" className="px-5 py-2.5 bg-white text-rose-600 text-sm font-bold rounded-xl hover:bg-rose-50 transition-colors">
                                            ⚡ Enter Contest
                                        </Link>
                                        <span className="text-xs opacity-70">👥 {contest.registeredCount} competing</span>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Contest Cards */}
                            <div className="space-y-3">
                                {filteredContests.filter(c => c.status !== 'live').map((contest, i) => (
                                    <motion.div key={contest.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="st-card p-5 hover:shadow-lg transition-all">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${contest.type === 'weekly' ? 'bg-indigo-100 text-indigo-700' :
                                                            contest.type === 'company' ? 'bg-emerald-100 text-emerald-700' :
                                                                contest.type === 'college-cup' ? 'bg-amber-100 text-amber-700' :
                                                                    contest.type === 'rapid' ? 'bg-rose-100 text-rose-700' :
                                                                        contest.type === 'marathon' ? 'bg-purple-100 text-purple-700' :
                                                                            'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {contest.type.replace('-', ' ').toUpperCase()}
                                                    </span>
                                                    {contest.company && (
                                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold">
                                                            🏢 {contest.company}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-900 mb-1">{contest.name}</h3>
                                                <p className="text-xs text-slate-500 mb-2">{contest.description}</p>
                                                <div className="flex flex-wrap gap-3 text-[10px] text-slate-400">
                                                    <span>📅 {contest.startTime}</span>
                                                    <span>⏱️ {contest.duration}</span>
                                                    <span>📝 {contest.problems} problems</span>
                                                    <span>📊 {contest.difficulty}</span>
                                                    <span>👥 {contest.registeredCount} registered</span>
                                                    {contest.ratingChange && <span>📈 Rating: {contest.ratingChange}</span>}
                                                </div>
                                                {contest.prizes && (
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {contest.prizes.map((p, pi) => (
                                                            <span key={pi} className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{p}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 ml-4 flex-shrink-0">
                                                Register
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ═══ Past Results ═══ */}
                    {tab === 'past' && (
                        <motion.div key="past" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="space-y-3">
                                {PAST_RESULTS.map((r, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="st-card p-4 flex items-center gap-4">
                                        {/* Rank */}
                                        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${r.percentile >= 90 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                                                r.percentile >= 70 ? 'bg-gradient-to-br from-indigo-400 to-violet-500 text-white' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            <span className="text-xs font-bold">#{r.rank}</span>
                                            <span className="text-[7px]">of {r.totalParticipants}</span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900">{r.contestName}</p>
                                            <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                                                <span>📅 {r.date}</span>
                                                <span>✅ {r.solved}/{r.totalProblems} solved</span>
                                                <span>📊 Top {(100 - r.percentile).toFixed(1)}%</span>
                                            </div>
                                        </div>

                                        {/* Rating Change */}
                                        <div className="text-right flex-shrink-0">
                                            <span className={`text-sm font-bold ${r.ratingChange > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {r.ratingChange > 0 ? '+' : ''}{r.ratingChange}
                                            </span>
                                            <p className="text-[9px] text-slate-400">rating</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ═══ Rating History ═══ */}
                    {tab === 'rating' && (
                        <motion.div key="rating" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                            {/* Rating Summary Card */}
                            <div className="st-card p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-3xl font-bold text-slate-900">{myRating}</p>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${myTier.color}`}>
                                            {myTier.icon} {myTier.name}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500">Contests: <span className="font-bold text-slate-900">23</span></p>
                                        <p className="text-sm text-slate-500">Best rank: <span className="font-bold text-slate-900">#34</span></p>
                                        <p className="text-sm text-slate-500">Win rate: <span className="font-bold text-emerald-600">67%</span></p>
                                    </div>
                                </div>

                                {/* Rating Chart (simplified bar representation) */}
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-500 font-semibold mb-2">Rating Trend (Last 10 Contests)</p>
                                    <div className="flex items-end gap-1 h-24">
                                        {[1450, 1480, 1520, 1490, 1555, 1530, 1580, 1565, 1600, 1623].map((val, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                <span className="text-[7px] text-slate-400">{val}</span>
                                                <div className={`w-full rounded-t transition-all ${val >= 1600 ? 'bg-emerald-400' : val >= 1500 ? 'bg-indigo-400' : 'bg-slate-300'}`}
                                                    style={{ height: `${((val - 1400) / 250) * 100}%` }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Rating Tier Ladder */}
                            <div className="st-card p-5">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">🏅 Rating Tiers</h3>
                                <div className="space-y-2">
                                    {RATING_TIERS.map((tier, i) => {
                                        const isCurrentTier = tier.name === myTier.name;
                                        return (
                                            <div key={i} className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${isCurrentTier ? 'bg-indigo-50 border border-indigo-200' : ''}`}>
                                                <span className="text-lg">{tier.icon}</span>
                                                <span className={`text-xs font-bold flex-1 ${isCurrentTier ? 'text-indigo-700' : 'text-slate-600'}`}>{tier.name}</span>
                                                <span className="text-[10px] text-slate-400 font-mono">{tier.range}</span>
                                                {isCurrentTier && <span className="text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">YOU</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══ Virtual Contest ═══ */}
                    {tab === 'virtual' && (
                        <motion.div key="virtual" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-4 border border-violet-100 mb-5">
                                <p className="text-xs font-bold text-violet-800">🔄 Virtual Contest Mode</p>
                                <p className="text-[11px] text-violet-600 mt-1">Practice past contests in simulated conditions. Timer runs, rank simulated, but no rating change. Perfect for preparation!</p>
                            </div>
                            <div className="space-y-3">
                                {['Weekly Sprint #47', 'Weekly Sprint #46', 'College Cup — Feb', 'Biweekly #23', 'Weekly Sprint #45', 'Rapid Fire #10'].map((name, i) => (
                                    <div key={i} className="st-card p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{name}</p>
                                            <p className="text-[10px] text-slate-400">4 problems · 90 min · {1050 + i * 30} participants</p>
                                        </div>
                                        <Link href="/problems" className="px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700">
                                            Start Virtual →
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <BottomNav />
        </div>
    );
}
