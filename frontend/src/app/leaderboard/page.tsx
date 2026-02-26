'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';
import Link from 'next/link';

interface LeaderboardEntry {
    rank: number;
    display_name: string;
    username: string;
    score: number;
    college: string;
    problems_solved: number;
    streak: number;
    badges: number;
    isYou?: boolean;
    change?: number; // rank change from last week
}

const MOCK_DATA: LeaderboardEntry[] = [
    { rank: 1, display_name: 'Priya Sharma', username: 'priya_dev', score: 920, college: 'IIT Bombay', problems_solved: 180, streak: 45, badges: 12, change: 0 },
    { rank: 2, display_name: 'Arjun Patel', username: 'arjun_p', score: 885, college: 'NIT Trichy', problems_solved: 165, streak: 32, badges: 9, change: 2 },
    { rank: 3, display_name: 'Sneha Roy', username: 'sneha_codes', score: 860, college: 'BITS Pilani', problems_solved: 155, streak: 28, badges: 11, change: -1 },
    { rank: 4, display_name: 'Vikram Desai', username: 'vikram_d', score: 830, college: 'NIT Warangal', problems_solved: 142, streak: 21, badges: 7, change: 1 },
    { rank: 5, display_name: 'Anjali Gupta', username: 'anjali_g', score: 810, college: 'VIT Vellore', problems_solved: 138, streak: 19, badges: 8, change: -2 },
    { rank: 6, display_name: 'Rahul Kumar', username: 'rahul_k', score: 790, college: 'SRM Chennai', problems_solved: 125, streak: 15, badges: 6, change: 0 },
    { rank: 7, display_name: 'Deepika Nair', username: 'deepika_n', score: 775, college: 'IIIT Hyderabad', problems_solved: 120, streak: 25, badges: 8, change: 3 },
    { rank: 8, display_name: 'Karthik Iyer', username: 'karthik_i', score: 760, college: 'NIT Karnataka', problems_solved: 118, streak: 14, badges: 5, change: -1 },
    { rank: 9, display_name: 'Meera Reddy', username: 'meera_r', score: 740, college: 'DSCE Bangalore', problems_solved: 110, streak: 12, badges: 4, change: 1 },
    { rank: 10, display_name: 'Aditya Joshi', username: 'aditya_j', score: 720, college: 'BMS Bangalore', problems_solved: 105, streak: 10, badges: 3, change: 0 },
];

const COLLEGE_DATA = [
    { rank: 1, name: 'IIT Bombay', score: 45200, students: 85, topStudent: 'Priya Sharma', change: 0 },
    { rank: 2, name: 'NIT Trichy', score: 38900, students: 120, topStudent: 'Arjun Patel', change: 1 },
    { rank: 3, name: 'BITS Pilani', score: 36500, students: 95, topStudent: 'Sneha Roy', change: -1 },
    { rank: 4, name: 'VIT Vellore', score: 32100, students: 200, topStudent: 'Anjali Gupta', change: 2 },
    { rank: 5, name: 'NIT Warangal', score: 29800, students: 78, topStudent: 'Vikram Desai', change: 0 },
    { rank: 6, name: 'SRM Chennai', score: 27500, students: 180, topStudent: 'Rahul Kumar', change: -2 },
    { rank: 7, name: 'IIIT Hyderabad', score: 25200, students: 65, topStudent: 'Deepika Nair', change: 1 },
    { rank: 8, name: 'NIT Karnataka', score: 23800, students: 90, topStudent: 'Karthik Iyer', change: 0 },
];

export default function LeaderboardPage() {
    const [tab, setTab] = useState<'overall' | 'coding' | 'college' | 'weekly'>('overall');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [myRank, setMyRank] = useState(42);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        loadData();
    }, [tab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const me = await api.getMe().catch(() => null);
            const data = [...MOCK_DATA];
            // Insert current user somewhere mid-board
            if (me) {
                data.splice(3, 0, {
                    rank: 4,
                    display_name: me.profile?.display_name || me.display_name || 'You',
                    username: me.profile?.username || 'you',
                    score: me.profile?.skillten_score || 750,
                    college: me.profile?.college_name || 'Your College',
                    problems_solved: 90,
                    streak: 7,
                    badges: 2,
                    isYou: true,
                    change: 5,
                });
                // Re-rank
                data.forEach((d, i) => { d.rank = i + 1; });
            }
            setLeaderboard(data);
        } catch {
            setLeaderboard(MOCK_DATA);
        }
        setLoading(false);
    };

    const getMedal = (r: number) => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `#${r}`;

    const top3 = leaderboard.slice(0, 3);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="max-w-3xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🏆 LEADERBOARD</span>
                                <h1 className="text-3xl font-bold mb-2">Top Students</h1>
                                <p className="text-white/60 text-sm mb-4">See how you rank against students across India. Updated every 15 minutes.</p>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
                                        <p className="text-2xl font-bold">#{myRank}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Your Rank</p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
                                        <p className="text-2xl font-bold">2,340</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Total Users</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                            {([
                                { key: 'overall' as const, label: '🏅 Overall' },
                                { key: 'coding' as const, label: '💻 Coding' },
                                { key: 'weekly' as const, label: '📆 This Week' },
                                { key: 'college' as const, label: '🏫 Colleges' },
                            ]).map(t => (
                                <button key={t.key} onClick={() => setTab(t.key)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${tab === t.key
                                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-200'
                                        }`}>{t.label}</button>
                            ))}
                        </div>

                        {/* Podium (top 3) */}
                        {!loading && tab !== 'college' && top3.length >= 3 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="flex items-end justify-center gap-3 mb-6">
                                {/* 2nd place */}
                                <div className="text-center flex-1">
                                    <div className="w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg mb-1">
                                        {top3[1].display_name[0]}
                                    </div>
                                    <p className="text-xs font-bold text-slate-900 truncate">{top3[1].display_name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{top3[1].college}</p>
                                    <div className="bg-gray-100 rounded-t-xl mt-1 h-16 flex items-center justify-center">
                                        <span className="text-lg">🥈</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700">{top3[1].score}</p>
                                </div>
                                {/* 1st place */}
                                <div className="text-center flex-1">
                                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl mb-1 ring-4 ring-amber-200">
                                        {top3[0].display_name[0]}
                                    </div>
                                    <p className="text-xs font-bold text-slate-900 truncate">{top3[0].display_name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{top3[0].college}</p>
                                    <div className="bg-amber-50 rounded-t-xl mt-1 h-24 flex items-center justify-center">
                                        <span className="text-2xl">🥇</span>
                                    </div>
                                    <p className="text-sm font-bold text-amber-600">{top3[0].score}</p>
                                </div>
                                {/* 3rd place */}
                                <div className="text-center flex-1">
                                    <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg mb-1">
                                        {top3[2].display_name[0]}
                                    </div>
                                    <p className="text-xs font-bold text-slate-900 truncate">{top3[2].display_name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{top3[2].college}</p>
                                    <div className="bg-orange-50 rounded-t-xl mt-1 h-12 flex items-center justify-center">
                                        <span className="text-lg">🥉</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700">{top3[2].score}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Loading */}
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="st-card p-4 animate-pulse h-16" />)}
                            </div>
                        ) : tab === 'college' ? (
                            /* College leaderboard */
                            <div className="space-y-2">
                                {COLLEGE_DATA.map((college, i) => (
                                    <motion.div key={college.name}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="st-card p-4 flex items-center gap-4 hover:shadow-md transition-all"
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${college.rank <= 3 ? 'bg-amber-100' : 'bg-slate-100'
                                            }`}>{getMedal(college.rank)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm text-slate-900">{college.name}</p>
                                            <p className="text-xs text-slate-500">{college.students} students · Top: {college.topStudent}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-indigo-600">{college.score.toLocaleString()}</p>
                                            <div className="flex items-center gap-1 justify-end">
                                                {college.change > 0 && <span className="text-[10px] text-green-600">▲{college.change}</span>}
                                                {college.change < 0 && <span className="text-[10px] text-red-500">▼{Math.abs(college.change)}</span>}
                                                {college.change === 0 && <span className="text-[10px] text-slate-400">—</span>}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            /* Individual leaderboard */
                            <div className="space-y-2">
                                {leaderboard.map((user, i) => (
                                    <motion.div key={user.username}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`st-card p-4 flex items-center gap-4 hover:shadow-md transition-all ${user.isYou ? 'ring-2 ring-indigo-500 bg-indigo-50/50' : ''}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${user.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                                            }`}>{getMedal(user.rank)}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-sm text-slate-900">{user.display_name}</p>
                                                {user.isYou && <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-bold">YOU</span>}
                                                {user.streak >= 30 && <span className="text-[10px]">🔥</span>}
                                            </div>
                                            <p className="text-xs text-slate-500">{user.college} · {user.problems_solved} problems · 🔥{user.streak}d</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-indigo-600">{user.score}</p>
                                            <div className="flex items-center gap-1 justify-end">
                                                {user.change && user.change > 0 && <span className="text-[10px] text-green-600">▲{user.change}</span>}
                                                {user.change && user.change < 0 && <span className="text-[10px] text-red-500">▼{Math.abs(user.change)}</span>}
                                                {(!user.change || user.change === 0) && <span className="text-[10px] text-slate-400">—</span>}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* CTA */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            className="mt-8 st-card p-6 text-center bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                            <span className="text-3xl block mb-2">🚀</span>
                            <h3 className="font-bold text-slate-900 mb-1">Climb the Ranks</h3>
                            <p className="text-sm text-slate-500 mb-3">Complete challenges, solve problems, and verify skills to boost your rank.</p>
                            <div className="flex gap-2 justify-center">
                                <Link href="/challenges" className="st-btn-primary text-xs px-4 py-2">Daily Challenges</Link>
                                <Link href="/campus" className="st-btn-secondary text-xs px-4 py-2">Campus Wars ⚔️</Link>
                            </div>
                        </motion.div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
