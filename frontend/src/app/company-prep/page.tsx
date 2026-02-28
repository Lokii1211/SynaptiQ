'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { auth } from '@/lib/api';
import Link from 'next/link';

/* ═══ Company Prep Kit Data ═══ */
interface CompanyKit {
    id: string; company: string; logo: string; type: string; avgPackage: string;
    problems: number; aptitude: number; technical: number; hr: number;
    mockDrive: boolean; interviewExperiences: number; readiness: number;
    pattern: { round: string; type: string; probability: string; details: string }[];
    topQuestions: { question: string; frequency: string; type: string }[];
    tips: string[];
}

const COMPANY_KITS: CompanyKit[] = [
    {
        id: 'tcs', company: 'TCS', logo: '🏢', type: 'Service', avgPackage: '₹3.5-7 LPA',
        problems: 50, aptitude: 40, technical: 20, hr: 15, mockDrive: true,
        interviewExperiences: 234, readiness: 73,
        pattern: [
            { round: 'Round 1', type: 'Aptitude (NQT)', probability: '100%', details: 'DI 30% | Ratio 25% | TSD 20% | Reasoning 25%' },
            { round: 'Round 2', type: 'Coding', probability: '98%', details: '70% Easy problems | 30% Medium | Language: Any' },
            { round: 'Round 3', type: 'Technical Interview', probability: '85%', details: '40% Projects | 30% OOP | 20% DBMS | 10% OS' },
            { round: 'Round 4', type: 'HR', probability: '90%', details: '90% "Tell me about yourself" | 60% Family | 40% Bond' },
        ],
        topQuestions: [
            { question: 'Reverse a linked list', frequency: '67%', type: 'coding' },
            { question: 'What is polymorphism?', frequency: '71%', type: 'technical' },
            { question: 'Explain your project', frequency: '89%', type: 'technical' },
            { question: 'Why TCS?', frequency: '78%', type: 'hr' },
            { question: 'Profit/Loss — DI set', frequency: '82%', type: 'aptitude' },
        ],
        tips: [
            'TCS NQT has negative marking — don\'t guess randomly',
            'Focus on DI + Ratio for aptitude — they cover 55% of questions',
            'For coding, practice Easy problems — 70% of TCS coding is Easy',
            'Know your project inside-out — 89% of technical rounds ask about it',
        ],
    },
    {
        id: 'infosys', company: 'Infosys', logo: '🔷', type: 'Service', avgPackage: '₹3.6-8 LPA',
        problems: 45, aptitude: 35, technical: 18, hr: 12, mockDrive: true,
        interviewExperiences: 189, readiness: 68,
        pattern: [
            { round: 'Round 1', type: 'Online Test (InfyTQ)', probability: '100%', details: 'Aptitude 40% | Coding 40% | Reasoning 20%' },
            { round: 'Round 2', type: 'Coding (HackerRank)', probability: '95%', details: '2 problems | 1 Easy + 1 Medium | 60 min' },
            { round: 'Round 3', type: 'Technical + HR', probability: '80%', details: 'Combined 30 min | Mostly projects + CS basics' },
        ],
        topQuestions: [
            { question: 'Binary Search implementation', frequency: '54%', type: 'coding' },
            { question: 'What are ACID properties?', frequency: '62%', type: 'technical' },
            { question: 'Explain MVC architecture', frequency: '45%', type: 'technical' },
            { question: 'Where do you see yourself in 5 years?', frequency: '73%', type: 'hr' },
        ],
        tips: [
            'InfyTQ certifications give you an edge during shortlisting',
            'Practice on HackerRank — that\'s their actual coding platform',
            'Combined Tech+HR round means be concise — 30 min total',
        ],
    },
    {
        id: 'amazon', company: 'Amazon', logo: '📦', type: 'Product', avgPackage: '₹12-28 LPA',
        problems: 80, aptitude: 0, technical: 30, hr: 10, mockDrive: true,
        interviewExperiences: 156, readiness: 45,
        pattern: [
            { round: 'Round 1', type: 'Online Assessment (OA)', probability: '100%', details: '2 coding problems + work style assessment | 90 min' },
            { round: 'Round 2', type: 'Technical (Phone Screen)', probability: '90%', details: 'DS/Algo problem solving on shared editor' },
            { round: 'Round 3', type: 'Onsite — Coding', probability: '85%', details: 'Live coding + system design basics' },
            { round: 'Round 4', type: 'Bar Raiser (Behavioral)', probability: '80%', details: 'Amazon Leadership Principles — STAR method' },
        ],
        topQuestions: [
            { question: 'Two Sum / Three Sum', frequency: '45%', type: 'coding' },
            { question: 'LRU Cache design', frequency: '38%', type: 'coding' },
            { question: 'Design a parking lot', frequency: '52%', type: 'system-design' },
            { question: 'Tell me about a time you disagreed with a team member', frequency: '89%', type: 'behavioral' },
        ],
        tips: [
            'Amazon OA has a "work style assessment" — don\'t skip it!',
            'Learn Amazon\'s 16 Leadership Principles by heart',
            'Use STAR method (Situation, Task, Action, Result) for behavioral',
            'Practice Medium-Hard LeetCode tagged "Amazon"',
        ],
    },
    {
        id: 'wipro', company: 'Wipro', logo: '🌸', type: 'Service', avgPackage: '₹3.5-6 LPA',
        problems: 40, aptitude: 35, technical: 15, hr: 12, mockDrive: true,
        interviewExperiences: 145, readiness: 78,
        pattern: [
            { round: 'Round 1', type: 'NLTH (Online Test)', probability: '100%', details: 'Aptitude 45% | Verbal 25% | Coding 30%' },
            { round: 'Round 2', type: 'Coding', probability: '92%', details: '1-2 Easy problems | Focus on basic logic' },
            { round: 'Round 3', type: 'Technical Interview', probability: '85%', details: 'CS fundamentals + project discussion' },
            { round: 'Round 4', type: 'HR', probability: '95%', details: 'Standard HR questions + bond discussion' },
        ],
        topQuestions: [
            { question: 'Fibonacci series', frequency: '72%', type: 'coding' },
            { question: 'Difference between process and thread', frequency: '58%', type: 'technical' },
            { question: 'Are you okay with relocating?', frequency: '85%', type: 'hr' },
        ],
        tips: [
            'Wipro NLTH has verbal section — practice reading comprehension',
            'Coding is easier than TCS — focus on logic building',
            'Be prepared to discuss bond terms in HR round',
        ],
    },
    {
        id: 'flipkart', company: 'Flipkart', logo: '🛒', type: 'Product', avgPackage: '₹15-25 LPA',
        problems: 70, aptitude: 0, technical: 25, hr: 8, mockDrive: false,
        interviewExperiences: 89, readiness: 38,
        pattern: [
            { round: 'Round 1', type: 'Online Coding', probability: '100%', details: '3 problems | Medium to Hard | 90 min' },
            { round: 'Round 2', type: 'Machine Coding', probability: '80%', details: 'Build a system in 90 min (e.g., Splitwise, Parking Lot)' },
            { round: 'Round 3', type: 'Problem Solving + DS', probability: '85%', details: 'Live coding with discussion' },
            { round: 'Round 4', type: 'System Design', probability: '70%', details: 'HLD basics — URL shortener, notification system' },
        ],
        topQuestions: [
            { question: 'Design Splitwise', frequency: '42%', type: 'machine-coding' },
            { question: 'Implement LRU Cache', frequency: '55%', type: 'coding' },
            { question: 'Rate limiter design', frequency: '38%', type: 'system-design' },
        ],
        tips: [
            'Machine coding round is unique to Flipkart — practice LLD',
            'Focus on Medium-Hard problems with graph and DP',
            'System design basics are checked even for freshers',
        ],
    },
];

export default function CompanyPrepPage() {
    const [selectedKit, setSelectedKit] = useState<CompanyKit | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'service' | 'product'>('all');

    useEffect(() => { if (!auth.isLoggedIn()) window.location.href = '/login'; }, []);

    const filteredKits = COMPANY_KITS.filter(k => {
        const matchesSearch = k.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || k.type.toLowerCase() === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-8">
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 st-font-heading">🎯 Company Prep Kits</h1>
                    <p className="text-sm text-slate-500 mt-1">Everything you need to crack any company — curated problems, patterns, and AI analysis</p>
                </motion.div>

                {selectedKit ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <button onClick={() => setSelectedKit(null)} className="text-sm text-indigo-600 font-medium hover:text-indigo-800">← Back to companies</button>

                        {/* Company Header */}
                        <div className="st-card p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-4xl">{selectedKit.logo}</span>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{selectedKit.company}</h2>
                                    <p className="text-sm text-slate-500">{selectedKit.type} Company · {selectedKit.avgPackage}</p>
                                </div>
                            </div>

                            {/* Readiness Meter */}
                            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-bold text-indigo-700">Your Readiness for {selectedKit.company}</p>
                                    <span className={`text-lg font-bold ${selectedKit.readiness >= 70 ? 'text-emerald-600' : selectedKit.readiness >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                                        {selectedKit.readiness}%
                                    </span>
                                </div>
                                <div className="w-full bg-white/50 rounded-full h-3">
                                    <div className={`rounded-full h-3 transition-all ${selectedKit.readiness >= 70 ? 'bg-emerald-500' : selectedKit.readiness >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                                        style={{ width: `${selectedKit.readiness}%` }} />
                                </div>
                            </div>

                            {/* Kit Stats */}
                            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                                {[
                                    { label: 'Coding Problems', value: selectedKit.problems, icon: '💻' },
                                    { label: 'Aptitude Qs', value: selectedKit.aptitude, icon: '🧮' },
                                    { label: 'Technical MCQ', value: selectedKit.technical, icon: '📝' },
                                    { label: 'HR Questions', value: selectedKit.hr, icon: '👔' },
                                    { label: 'Experiences', value: selectedKit.interviewExperiences, icon: '📖' },
                                ].map((s, i) => (
                                    <div key={i} className="text-center">
                                        <span className="text-lg">{s.icon}</span>
                                        <p className="text-sm font-bold text-slate-900">{s.value}</p>
                                        <p className="text-[9px] text-slate-400">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Interview Pattern Analysis */}
                        <div className="st-card p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-sm font-bold text-slate-900">🤖 AI Interview Pattern Analysis</h3>
                                <span className="text-[8px] bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-bold">SKILLTEN EXCLUSIVE</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mb-3">Analyzed from {selectedKit.interviewExperiences}+ interview experiences of SkillTen students</p>
                            <div className="space-y-2">
                                {selectedKit.pattern.map((round, i) => (
                                    <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                                        <span className={`text-[10px] px-2 py-1 rounded-lg font-bold flex-shrink-0 ${i === 0 ? 'bg-indigo-100 text-indigo-700' :
                                                i === 1 ? 'bg-violet-100 text-violet-700' :
                                                    i === 2 ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-amber-100 text-amber-700'
                                            }`}>{round.round}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-slate-900">{round.type}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{round.details}</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-indigo-600 flex-shrink-0">{round.probability}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Frequently Asked Questions */}
                        <div className="st-card p-5">
                            <h3 className="text-sm font-bold text-slate-900 mb-3">🔥 Most Asked Questions (Pattern-Based)</h3>
                            <div className="space-y-2">
                                {selectedKit.topQuestions.map((q, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${q.type === 'coding' ? 'bg-emerald-50 text-emerald-600' :
                                                q.type === 'technical' ? 'bg-indigo-50 text-indigo-600' :
                                                    q.type === 'hr' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-violet-50 text-violet-600'
                                            }`}>{q.type.toUpperCase()}</span>
                                        <p className="text-xs text-slate-700 flex-1">{q.question}</p>
                                        <span className="text-xs font-bold text-rose-500">{q.frequency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="st-card p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
                            <h3 className="text-sm font-bold text-amber-800 mb-3">💡 Insider Tips</h3>
                            <div className="space-y-2">
                                {selectedKit.tips.map((tip, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <span className="text-amber-500 font-bold text-xs mt-0.5">→</span>
                                        <p className="text-xs text-amber-700">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <Link href="/problems" className="py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl text-center hover:bg-indigo-700">
                                💻 Solve Problems
                            </Link>
                            <Link href="/aptitude" className="py-3 bg-violet-100 text-violet-700 text-xs font-bold rounded-xl text-center hover:bg-violet-200">
                                🧮 Practice Aptitude
                            </Link>
                            <Link href="/interview-experiences" className="py-3 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl text-center hover:bg-emerald-200">
                                📖 Read Experiences
                            </Link>
                            {selectedKit.mockDrive && (
                                <Link href="/mock-drive" className="py-3 bg-amber-100 text-amber-700 text-xs font-bold rounded-xl text-center hover:bg-amber-200">
                                    🎭 Mock Drive
                                </Link>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Search + Filter */}
                        <div className="flex gap-3 mb-5">
                            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search companies..." className="st-input flex-1" />
                            <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200">
                                {(['all', 'service', 'product'] as const).map(f => (
                                    <button key={f} onClick={() => setFilterType(f)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterType === f ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
                                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Company Cards */}
                        <div className="grid md:grid-cols-2 gap-3">
                            {filteredKits.map((kit, i) => (
                                <motion.div key={kit.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setSelectedKit(kit)}
                                    className="st-card p-5 cursor-pointer hover:shadow-xl hover:border-indigo-200 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{kit.logo}</span>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-slate-900">{kit.company}</h3>
                                            <p className="text-[10px] text-slate-400">{kit.type} · {kit.avgPackage}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-lg font-bold ${kit.readiness >= 70 ? 'text-emerald-600' : kit.readiness >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                                                {kit.readiness}%
                                            </span>
                                            <p className="text-[8px] text-slate-400">readiness</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                                        <span>💻 {kit.problems} problems</span>
                                        <span>🧮 {kit.aptitude} aptitude</span>
                                        <span>📖 {kit.interviewExperiences} experiences</span>
                                    </div>
                                    <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                                        <div className={`rounded-full h-1.5 ${kit.readiness >= 70 ? 'bg-emerald-400' : kit.readiness >= 50 ? 'bg-amber-400' : 'bg-red-300'}`}
                                            style={{ width: `${kit.readiness}%` }} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </main>
            <BottomNav />
        </div>
    );
}
