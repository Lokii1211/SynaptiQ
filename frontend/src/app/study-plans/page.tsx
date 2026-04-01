'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

interface StudyPlan {
    id: string;
    title: string;
    icon: string;
    description: string;
    duration: string;
    dailyTime: string;
    problems: number;
    topics: { name: string; count: number; done: number }[];
    target: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    enrolled: number;
    completion: number;
    certificate: string;
    color: string;
}

const PLANS: StudyPlan[] = [
    {
        id: 'service', title: 'Service Company Ready', icon: '🏢', description: 'Crack TCS NQT, Infosys InfyTQ, Wipro NLTH. Aptitude + coding + HR prep.',
        duration: '5 weeks', dailyTime: '90 min/day', problems: 150, target: 'TCS · Infosys · Wipro · Cognizant · Capgemini',
        difficulty: 'Beginner', enrolled: 12847, completion: 0, certificate: 'Service Company Ready',
        topics: [
            { name: 'Aptitude — Quantitative', count: 30, done: 0 },
            { name: 'Aptitude — Logical Reasoning', count: 20, done: 0 },
            { name: 'Aptitude — Verbal', count: 15, done: 0 },
            { name: 'Arrays & Strings', count: 20, done: 0 },
            { name: 'Basic Data Structures', count: 15, done: 0 },
            { name: 'SQL Basics', count: 15, done: 0 },
            { name: 'OOP Concepts', count: 10, done: 0 },
            { name: 'CS Fundamentals (OS/DBMS)', count: 15, done: 0 },
            { name: 'HR Interview Prep', count: 10, done: 0 },
        ], color: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'product', title: 'Product Company Foundation', icon: '🚀', description: 'Medium-Hard DSA focus for Flipkart, Zomato, Swiggy, Razorpay.',
        duration: '10 weeks', dailyTime: '2 hrs/day', problems: 250, target: 'Flipkart · Zomato · Swiggy · Razorpay · PhonePe',
        difficulty: 'Advanced', enrolled: 5621, completion: 0, certificate: 'Product Company Ready',
        topics: [
            { name: 'Arrays & Two Pointers', count: 25, done: 0 },
            { name: 'Linked Lists', count: 15, done: 0 },
            { name: 'Stacks & Queues', count: 15, done: 0 },
            { name: 'Trees & BST', count: 30, done: 0 },
            { name: 'Graphs (BFS/DFS)', count: 25, done: 0 },
            { name: 'Dynamic Programming', count: 35, done: 0 },
            { name: 'Greedy & Backtracking', count: 20, done: 0 },
            { name: 'Sliding Window & Prefix', count: 15, done: 0 },
            { name: 'Tries & Heaps', count: 15, done: 0 },
            { name: 'System Design Basics', count: 10, done: 0 },
            { name: 'SQL Advanced', count: 20, done: 0 },
            { name: 'Behavioral Interview', count: 25, done: 0 },
        ], color: 'from-violet-500 to-purple-600',
    },
    {
        id: 'sql', title: 'SQL Master', icon: '🗃️', description: 'Become SQL-proficient in 3 weeks. SELECT to Window Functions.',
        duration: '3 weeks', dailyTime: '45 min/day', problems: 50, target: 'Data Analyst · Backend · Full Stack roles',
        difficulty: 'Intermediate', enrolled: 8932, completion: 0, certificate: 'SQL Verified',
        topics: [
            { name: 'SELECT & WHERE', count: 8, done: 0 },
            { name: 'JOINs (INNER, LEFT, RIGHT)', count: 10, done: 0 },
            { name: 'GROUP BY & HAVING', count: 8, done: 0 },
            { name: 'Subqueries & CTEs', count: 8, done: 0 },
            { name: 'Window Functions', count: 8, done: 0 },
            { name: 'Indexing & Optimization', count: 8, done: 0 },
        ], color: 'from-emerald-500 to-teal-500',
    },
    {
        id: 'sprint', title: '14-Day Sprint', icon: '⚡', description: 'Placement drive in 2 weeks? This covers 70% of what service companies ask.',
        duration: '2 weeks', dailyTime: '2 hrs/day', problems: 80, target: 'Emergency prep for any campus drive',
        difficulty: 'Intermediate', enrolled: 15234, completion: 0, certificate: 'Sprint Complete',
        topics: [
            { name: 'High-Frequency DSA', count: 25, done: 0 },
            { name: 'Top 30 Aptitude Patterns', count: 30, done: 0 },
            { name: 'CS Quick Revision', count: 15, done: 0 },
            { name: 'Mock Tests (Full)', count: 10, done: 0 },
        ], color: 'from-orange-500 to-red-500',
    },
    {
        id: 'aptitude', title: 'Aptitude Master', icon: '🧠', description: 'Comprehensive aptitude across Quant, LR, Verbal, and DI.',
        duration: '4 weeks', dailyTime: '60 min/day', problems: 200, target: 'All campus placements',
        difficulty: 'Beginner', enrolled: 9187, completion: 0, certificate: 'Aptitude Excellence',
        topics: [
            { name: 'Number Systems & HCF/LCM', count: 20, done: 0 },
            { name: 'Percentages & Profit/Loss', count: 20, done: 0 },
            { name: 'Time, Speed, Distance & Work', count: 25, done: 0 },
            { name: 'Probability & Permutations', count: 20, done: 0 },
            { name: 'Logical Reasoning', count: 30, done: 0 },
            { name: 'Data Interpretation', count: 25, done: 0 },
            { name: 'Verbal Ability', count: 30, done: 0 },
            { name: 'Full Mock Tests', count: 30, done: 0 },
        ], color: 'from-amber-500 to-yellow-500',
    },
    {
        id: 'data-analyst', title: 'Data Analyst Path', icon: '📊', description: 'SQL + Python + Statistics + Visualization for analyst roles.',
        duration: '8 weeks', dailyTime: '90 min/day', problems: 180, target: 'Data Analyst · Business Analyst · Analytics',
        difficulty: 'Intermediate', enrolled: 6543, completion: 0, certificate: 'Data Analyst Ready',
        topics: [
            { name: 'SQL (all levels)', count: 40, done: 0 },
            { name: 'Python for Data', count: 30, done: 0 },
            { name: 'Statistics Basics', count: 25, done: 0 },
            { name: 'Pandas & NumPy', count: 25, done: 0 },
            { name: 'Data Visualization', count: 20, done: 0 },
            { name: 'EDA Practice', count: 15, done: 0 },
            { name: 'Excel & Sheets', count: 10, done: 0 },
            { name: 'Case Studies', count: 15, done: 0 },
        ], color: 'from-indigo-500 to-blue-600',
    },
];

export default function StudyPlansPage() {
    const [plans] = useState(PLANS);
    const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
    const [enrolledPlanIds, setEnrolledPlanIds] = useState<string[]>([]);
    const [filter, setFilter] = useState<'all' | 'enrolled'>('all');

    useEffect(() => {
    }, []);

    const filtered = filter === 'enrolled' ? plans.filter(p => enrolledPlanIds.includes(p.id)) : plans;
    const diffColor = (d: string) => d === 'Beginner' ? 'bg-emerald-50 text-emerald-600' : d === 'Intermediate' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600';

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/4" />
                        <div className="max-w-4xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">📚 STUDY PLANS</span>
                                <h1 className="text-3xl font-bold mb-2 st-font-heading">Placement Prep Plans</h1>
                                <p className="text-white/60 text-sm mb-4">Structured, day-by-day plans that end in certification. Better than any SDE sheet.</p>
                                <div className="flex gap-2">
                                    {[{ key: 'all' as const, label: `All Plans (${plans.length})` }, { key: 'enrolled' as const, label: `My Plans (${enrolledPlanIds.length})` }].map(f => (
                                        <button key={f.key} onClick={() => setFilter(f.key)}
                                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f.key ? 'bg-white text-indigo-700' : 'bg-white/15 text-white/80 hover:bg-white/25'}`}>{f.label}</button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
                        {/* Plan Cards */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {filtered.map((plan, i) => {
                                const totalDone = plan.topics.reduce((a, t) => a + t.done, 0);
                                const totalProblems = plan.topics.reduce((a, t) => a + t.count, 0);
                                const progress = totalProblems > 0 ? Math.round((totalDone / totalProblems) * 100) : 0;
                                const isEnrolled = enrolledPlanIds.includes(plan.id);

                                return (
                                    <motion.div key={plan.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        className="st-card overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                                        onClick={() => setSelectedPlan(plan)}
                                    >
                                        <div className={`h-2 bg-gradient-to-r ${plan.color}`} />
                                        <div className="p-5">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
                                                    {plan.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">{plan.title}</h3>
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${diffColor(plan.difficulty)}`}>{plan.difficulty}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{plan.duration} · {plan.dailyTime} · {plan.problems} problems</p>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-500 leading-relaxed mb-3">{plan.description}</p>

                                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{plan.enrolled.toLocaleString()} enrolled</span>
                                                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-semibold">🏅 Cert: {plan.certificate}</span>
                                            </div>

                                            <p className="text-[10px] text-slate-400 mb-2">🎯 For: {plan.target}</p>

                                            {isEnrolled && (
                                                <div className="mb-2">
                                                    <div className="flex justify-between text-[10px] mb-1">
                                                        <span className="text-slate-500">Progress</span>
                                                        <span className="font-bold text-indigo-600">{progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                                        <div className={`h-2 rounded-full bg-gradient-to-r ${plan.color}`} style={{ width: `${progress}%` }} />
                                                    </div>
                                                </div>
                                            )}

                                            <button onClick={(e) => { e.stopPropagation(); if (!isEnrolled) setEnrolledPlanIds(prev => [...prev, plan.id]); }}
                                                className={`w-full py-2 text-xs font-semibold rounded-xl transition-all ${isEnrolled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                                                {isEnrolled ? '✓ Enrolled — Continue →' : 'Start Plan →'}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Detail Modal */}
                        <AnimatePresence>
                            {selectedPlan && (
                                <>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setSelectedPlan(null)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                                        className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-[8%] max-w-lg w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[85vh] overflow-y-auto"
                                    >
                                        <div className={`h-3 bg-gradient-to-r ${selectedPlan.color}`} />
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`w-14 h-14 bg-gradient-to-br ${selectedPlan.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                                                    {selectedPlan.icon}
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-slate-900">{selectedPlan.title}</h2>
                                                    <p className="text-xs text-slate-500">{selectedPlan.duration} · {selectedPlan.dailyTime}</p>
                                                </div>
                                            </div>

                                            <p className="text-sm text-slate-600 leading-relaxed mb-4">{selectedPlan.description}</p>

                                            <div className="bg-slate-50 rounded-xl p-3 mb-4">
                                                <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">📋 Topic Breakdown</p>
                                                <div className="space-y-2">
                                                    {selectedPlan.topics.map((t, i) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                                                            <span className="flex-1 text-xs text-slate-700">{t.name}</span>
                                                            <span className="text-[10px] text-slate-400 font-semibold">{t.count} problems</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-violet-50 rounded-xl p-3 mb-4">
                                                <p className="text-[10px] text-violet-600 uppercase font-bold mb-1">🏅 On Completion</p>
                                                <p className="text-xs text-violet-700">Earn the "{selectedPlan.certificate}" certificate. Added to your profile and shareable on LinkedIn.</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button onClick={() => { if (!enrolledPlanIds.includes(selectedPlan.id)) setEnrolledPlanIds(prev => [...prev, selectedPlan.id]); setSelectedPlan(null); }}
                                                    className="flex-1 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                                                    {enrolledPlanIds.includes(selectedPlan.id) ? 'Continue Plan →' : 'Start Plan →'}
                                                </button>
                                                <button onClick={() => setSelectedPlan(null)} className="px-4 py-3 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl">✕</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        {/* Custom Plan CTA */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                            className="mt-6 st-card p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">🤖</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-sm mb-1">AI-Generated Personal Plan</h3>
                                    <p className="text-xs text-slate-400">Tell us your target company, time available, and we'll create a day-by-day plan just for you.</p>
                                </div>
                                <Link href="/chat" className="px-4 py-2 bg-white text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors whitespace-nowrap">
                                    Generate Plan →
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
