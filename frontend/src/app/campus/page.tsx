'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

// Bible XF-13 â€” Campus Wars demo leaderboard

type Tab = 'national' | 'tier' | 'state';

export default function CampusPage() {
    const [tab, setTab] = useState<Tab>('national');
    const [selectedTier, setSelectedTier] = useState(1);
    const [placements, setPlacements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getPlacements().catch(() => ({ placements: [] })).then(p => {
            setPlacements(p.placements || []);
            setLoading(false);
        });
    }, []);

    const filtered: { rank: number; name: string; score: number; students: number; tier: number; change: number; state: string }[] = []; // TODO: Fetch from real API

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white px-6 py-8 relative overflow-hidden">
                        <div className="absolute top-2 right-4 text-6xl opacity-10">âš”ï¸</div>
                        <h1 className="text-2xl font-bold mb-1">âš”ï¸ Campus Wars</h1>
                        <p className="text-white/80 text-sm mb-4">Monthly college vs college â€” help your campus climb the leaderboard</p>
                        <div className="flex gap-2">
                            {(['national', 'tier', 'state'] as const).map(t => (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? 'bg-white text-red-600' : 'bg-white/15 text-white hover:bg-white/25'}`}>
                                    {t === 'national' ? 'ðŸ‡®ðŸ‡³ National' : t === 'tier' ? 'ðŸ… By Tier' : 'ðŸ“ By State'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">

                        {/* Your contribution */}
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border border-orange-200"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-slate-900">Your Contribution This Month</span>
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">0 pts</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">
                                Start solving problems to earn points for your college! Every problem solved = +1 point.
                            </p>
                            <Link href="/practice"
                                className="inline-block text-sm font-semibold text-red-600 hover:underline">
                                Help your college climb â†’
                            </Link>
                        </motion.div>

                        {/* Tier filter */}
                        {tab === 'tier' && (
                            <div className="flex gap-2">
                                {[1, 2, 3].map(tier => (
                                    <button key={tier} onClick={() => setSelectedTier(tier)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedTier === tier ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                                        Tier {tier}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Leaderboard */}
                        <section>
                            <h2 className="st-section-title mb-4">
                                {tab === 'national' ? 'National Leaderboard (Top 50)' : tab === 'tier' ? `Tier ${selectedTier} League` : 'State Rankings'}
                            </h2>
                            <div className="space-y-2">
                                {filtered.map((college, i) => (
                                    <motion.div key={college.name}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className={`st-card p-4 flex items-center gap-4 ${i < 3 ? 'border-l-4' : ''} ${i === 0 ? 'border-l-yellow-500' : i === 1 ? 'border-l-slate-400' : i === 2 ? 'border-l-amber-700' : ''}`}
                                    >
                                        {/* Rank */}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-slate-100 text-slate-700' : i === 2 ? 'bg-amber-100 text-amber-800' : 'bg-slate-50 text-slate-500'
                                            }`}>
                                            {i < 3 ? ['ðŸ¥‡', 'ðŸ¥ˆ', 'ðŸ¥‰'][i] : `#${college.rank}`}
                                        </div>

                                        {/* College info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-slate-900 text-sm truncate">{college.name}</h3>
                                                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">T{college.tier}</span>
                                            </div>
                                            <p className="text-xs text-slate-400">{college.students} active students Â· {college.state}</p>
                                        </div>

                                        {/* Score + change */}
                                        <div className="text-right shrink-0">
                                            <p className="font-bold text-slate-900 tabular-nums">{college.score.toLocaleString()}</p>
                                            <p className={`text-xs font-semibold ${college.change > 0 ? 'text-green-600' : college.change < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                                {college.change > 0 ? `â†‘ ${college.change}` : college.change < 0 ? `â†“ ${Math.abs(college.change)}` : 'â€”'}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* How scoring works */}
                        <section className="st-card p-6">
                            <h3 className="font-bold text-slate-900 mb-4">ðŸ“Š How Campus Score Works</h3>
                            <p className="text-xs text-slate-500 mb-4">
                                Score = (total_student_activity / enrolled_students) Ã— 1000 â€” normalized so small colleges compete fairly.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { action: 'Assessment completed', pts: '+50', icon: 'ðŸ§¬' },
                                    { action: 'Daily streak (per student)', pts: '+2/day', icon: 'ðŸ”¥' },
                                    { action: 'Problem solved', pts: '+1', icon: 'ðŸ’»' },
                                    { action: 'Challenge participated', pts: '+10', icon: 'âš¡' },
                                    { action: 'Placement reported', pts: '+100', icon: 'ðŸŽ‰' },
                                    { action: 'Skill verified', pts: '+5', icon: 'âœ…' },
                                ].map(item => (
                                    <div key={item.action} className="bg-slate-50 rounded-xl p-3">
                                        <span className="text-lg block mb-1">{item.icon}</span>
                                        <p className="text-xs font-medium text-slate-700">{item.action}</p>
                                        <p className="text-xs font-bold text-indigo-600">{item.pts}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Tiers explained */}
                        <section className="st-card p-6">
                            <h3 className="font-bold text-slate-900 mb-4">ðŸ† Tier Leagues</h3>
                            <div className="space-y-3">
                                {[
                                    { tier: 'Tier 1', desc: 'IITs, NITs, BITS, IIMs + top private', badge: 'ðŸ¥‡' },
                                    { tier: 'Tier 2', desc: 'State universities, good private engineering', badge: 'ðŸ¥ˆ' },
                                    { tier: 'Tier 3', desc: 'Other engineering colleges', badge: 'ðŸ¥‰' },
                                ].map(t => (
                                    <div key={t.tier} className="flex items-center gap-3 py-2">
                                        <span className="text-xl">{t.badge}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{t.tier} League</p>
                                            <p className="text-xs text-slate-500">{t.desc}</p>
                                        </div>
                                    </div>
                                ))}
                                <p className="text-[10px] text-indigo-500 italic">Top 3 from Tier 2 get promoted to Tier 1 next month!</p>
                            </div>
                        </section>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
