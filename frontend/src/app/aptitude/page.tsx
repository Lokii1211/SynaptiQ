'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

const COMPANY_FORMATS = [
    { name: 'TCS NQT', icon: '🏢', sections: ['Numerical', 'Verbal', 'Logical', 'Coding'], time: '180 min', questions: 80, color: 'from-blue-500 to-indigo-600' },
    { name: 'Infosys InfyTQ', icon: '🔷', sections: ['Aptitude', 'Verbal', 'Pseudo Code', 'Coding'], time: '150 min', questions: 65, color: 'from-cyan-500 to-blue-600' },
    { name: 'Wipro NLTH', icon: '💜', sections: ['Aptitude', 'Verbal', 'Tech MCQ', 'Coding'], time: '120 min', questions: 70, color: 'from-purple-500 to-violet-600' },
    { name: 'CTS GenC', icon: '⚡', sections: ['Analytical', 'Verbal', 'Quantitative'], time: '60 min', questions: 45, color: 'from-amber-500 to-orange-600' },
    { name: 'AMCAT', icon: '📊', sections: ['Quantitative', 'Logical', 'Verbal', 'Module'], time: '90 min', questions: 80, color: 'from-emerald-500 to-green-600' },
    { name: 'General Aptitude', icon: '🧠', sections: ['Quant', 'Logical', 'Verbal', 'Data Interpret'], time: '60 min', questions: 50, color: 'from-rose-500 to-pink-600' },
];

const CATEGORIES = [
    { name: 'Quantitative', icon: '📐', topics: 12, mastered: 0, total: 120 },
    { name: 'Logical Reasoning', icon: '🧩', topics: 10, mastered: 0, total: 100 },
    { name: 'Verbal Ability', icon: '📝', topics: 8, mastered: 0, total: 80 },
    { name: 'Data Interpretation', icon: '📊', topics: 6, mastered: 0, total: 60 },
];

export default function AptitudePage() {
    const [activeTab, setActiveTab] = useState<'practice' | 'tests'>('practice');

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; }
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white px-6 py-8">
                        <h1 className="text-2xl font-bold mb-2">🧠 Aptitude Engine</h1>
                        <p className="text-white/80 text-sm mb-4">Practice TCS, Infosys, Wipro patterns — beat the cutoff</p>
                        <div className="flex gap-3">
                            {['practice', 'tests'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab as any)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-teal-700' : 'bg-white/15 text-white hover:bg-white/25'}`}>
                                    {tab === 'practice' ? '📚 Practice' : '📝 Company Tests'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
                        <AnimatePresence mode="wait">
                            {activeTab === 'practice' ? (
                                <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <h2 className="st-section-title">Topic-Wise Practice</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {CATEGORIES.map((cat, i) => (
                                            <motion.div key={cat.name}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="st-card p-5 hover:shadow-lg transition-shadow"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-3xl">{cat.icon}</span>
                                                        <div>
                                                            <h3 className="font-bold text-slate-900">{cat.name}</h3>
                                                            <p className="text-xs text-slate-500">{cat.topics} topics · {cat.total} questions</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold">
                                                        {cat.mastered}/{cat.topics} mastered
                                                    </span>
                                                </div>
                                                {/* Progress bar */}
                                                <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                                                    <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${(cat.mastered / cat.topics) * 100}%` }} />
                                                </div>
                                                <button className="w-full st-btn-secondary text-sm py-2">Start Practicing →</button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="tests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <h2 className="st-section-title">Company-Specific Tests</h2>
                                    <p className="text-sm text-slate-500">Exact patterns used by top mass-recruiters. Practice in the real format.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {COMPANY_FORMATS.map((test, i) => (
                                            <motion.div key={test.name}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.08 }}
                                                className="st-card overflow-hidden hover:shadow-lg transition-shadow group"
                                            >
                                                <div className={`bg-gradient-to-r ${test.color} px-5 py-3 flex items-center gap-3`}>
                                                    <span className="text-2xl">{test.icon}</span>
                                                    <div>
                                                        <h3 className="font-bold text-white">{test.name}</h3>
                                                        <p className="text-xs text-white/70">{test.questions} Qs · {test.time}</p>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                                        {test.sections.map(s => (
                                                            <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{s}</span>
                                                        ))}
                                                    </div>
                                                    <button className="w-full st-btn-primary text-sm py-2.5 group-hover:shadow-md transition-shadow">
                                                        Start Mock Test →
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Certification CTA */}
                        <div className="bg-teal-50 rounded-2xl p-6 border border-teal-200 text-center">
                            <h3 className="font-bold text-slate-900 mb-2">🏅 SkillTen Aptitude Certified</h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Score 80%+ across all 4 categories to earn the SkillTen Aptitude Certification — visible on your public profile.
                            </p>
                            <Link href="/score" className="st-btn-primary text-sm px-6 py-2.5 inline-block">
                                View My Score →
                            </Link>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
