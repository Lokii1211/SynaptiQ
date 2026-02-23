'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

function SkillGapContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [targetCareer, setTargetCareer] = useState(searchParams.get('career') || '');
    const [skillInput, setSkillInput] = useState('');
    const [currentSkills, setCurrentSkills] = useState<string[]>([]);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !currentSkills.includes(s)) {
            setCurrentSkills([...currentSkills, s]);
            setSkillInput('');
        }
    };

    const analyze = async () => {
        if (!targetCareer.trim() || currentSkills.length === 0) return;
        if (!auth.isLoggedIn()) { router.push('/login'); return; }
        setLoading(true);
        try {
            const data = await api.skillGapAnalysis({ current_skills: currentSkills, target_career: targetCareer });
            setResult(data);
        } catch (err: any) {
            if (err.message?.includes('401')) router.push('/login');
            else alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const importanceColor = (imp: string) => {
        if (imp === 'critical') return 'text-red-600 bg-red-50 border-red-200';
        if (imp === 'important') return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-slate-500 bg-slate-50 border-slate-200';
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">🎯 Skill Gap Analyzer</h1>
                        <p className="text-slate-500 text-sm">Enter your skills and target career — AI creates your personalized roadmap</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
                        {/* Input Form */}
                        <section className="st-card p-6">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Career</label>
                                    <input type="text" className="st-input" placeholder="e.g., Data Scientist"
                                        value={targetCareer} onChange={e => setTargetCareer(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Add Your Skills</label>
                                    <div className="flex gap-2">
                                        <input type="text" className="st-input flex-1" placeholder="e.g., Python"
                                            value={skillInput} onChange={e => setSkillInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                                        <button onClick={addSkill} className="st-btn-secondary px-4">Add</button>
                                    </div>
                                </div>
                            </div>

                            {currentSkills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {currentSkills.map(s => (
                                        <span key={s} className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-sm text-indigo-700 flex items-center gap-2 font-medium">
                                            {s}
                                            <button onClick={() => setCurrentSkills(currentSkills.filter(x => x !== s))} className="text-indigo-400 hover:text-indigo-700">×</button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            <button onClick={analyze} disabled={loading || !targetCareer.trim() || currentSkills.length === 0}
                                className="st-btn-primary disabled:opacity-50 flex items-center gap-2">
                                {loading ? (
                                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</>
                                ) : 'Analyze Skill Gap →'}
                            </button>
                        </section>

                        {/* Results */}
                        {result && (
                            <div className="space-y-4">
                                {/* Match Score */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className="st-card p-8 text-center">
                                    <p className="text-sm text-slate-500 mb-2">Skill Match for <span className="font-bold text-slate-900">{result.target_career}</span></p>
                                    <p className="text-6xl font-black st-gradient-text mb-3">{result.skill_match_percentage}%</p>
                                    <div className="max-w-sm mx-auto bg-slate-100 rounded-full h-3 overflow-hidden">
                                        <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                                            initial={{ width: 0 }} animate={{ width: `${result.skill_match_percentage}%` }}
                                            transition={{ duration: 1 }} />
                                    </div>
                                    <p className="text-sm text-slate-500 mt-3">{result.estimated_readiness}</p>
                                </motion.div>

                                {/* Skills Breakdown */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                    className="st-card p-6">
                                    <h2 className="font-bold text-slate-900 mb-4">Skills Breakdown</h2>
                                    <div className="space-y-2">
                                        {result.required_skills?.map((skill: any) => (
                                            <div key={skill.skill} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${skill.has ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {skill.has ? '✓' : '✗'}
                                                </span>
                                                <span className="flex-1 font-medium text-slate-800 text-sm">{skill.skill}</span>
                                                <span className={`px-2 py-0.5 rounded text-xs border font-medium ${importanceColor(skill.importance)}`}>
                                                    {skill.importance}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Learning Path */}
                                {result.learning_path && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                        className="st-card p-6">
                                        <h2 className="font-bold text-slate-900 mb-1">Your Learning Roadmap</h2>
                                        <p className="text-sm text-slate-500 mb-6">
                                            Estimated timeline: <span className="text-indigo-600 font-bold">{result.timeline_months} months</span>
                                        </p>
                                        <div className="space-y-4">
                                            {result.learning_path.map((step: any) => (
                                                <div key={step.step} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-8 h-8 bg-indigo-100 border border-indigo-200 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                                                            {step.step}
                                                        </div>
                                                        {step.step < result.learning_path.length && <div className="w-px flex-1 bg-slate-200 mt-2" />}
                                                    </div>
                                                    <div className="flex-1 pb-6">
                                                        <h4 className="font-bold text-slate-900 text-sm">{step.skill}</h4>
                                                        <p className="text-slate-500 text-sm mt-0.5">{step.resource}</p>
                                                        <div className="flex gap-3 text-xs mt-2">
                                                            <span className="text-slate-400">⏱️ {step.duration}</span>
                                                            <span className="text-slate-400 capitalize">📖 {step.type}</span>
                                                            <span className={step.free ? 'text-green-600' : 'text-amber-600'}>
                                                                {step.free ? '🆓 Free' : '💰 Paid'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Quick Wins */}
                                {result.quick_wins?.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        className="bg-green-50 rounded-2xl p-6 border border-green-200">
                                        <h2 className="font-bold text-slate-900 mb-3">⚡ Quick Wins (Start Today!)</h2>
                                        <ul className="space-y-2">
                                            {result.quick_wins.map((win: string, i: number) => (
                                                <li key={i} className="flex items-center gap-2 text-slate-700 text-sm">
                                                    <span className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center text-xs text-green-700">✓</span>
                                                    {win}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}

export default function SkillsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SkillGapContent />
        </Suspense>
    );
}
