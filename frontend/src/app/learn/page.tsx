'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

/* ═══ Skill Gap Pipeline Data (Bible C1/L5) ═══ */
const SKILL_GAPS = [
    {
        skill: 'SQL', priority: 'critical', score: 0, needed: 70, demandPct: 90,
        resources: [
            { title: 'SQL for Data Analysis — NPTEL', provider: 'NPTEL', type: 'course', cost: 'FREE', duration: '8 weeks', rating: 4.6, passRate: 84, url: '#' },
            { title: 'Complete SQL Bootcamp — Udemy', provider: 'Udemy', type: 'course', cost: '₹499', duration: '12 hours', rating: 4.7, passRate: 78, url: '#' },
        ],
    },
    {
        skill: 'Python (Intermediate)', priority: 'high', score: 35, needed: 60, demandPct: 85,
        resources: [
            { title: 'Python for Everybody — Coursera', provider: 'Coursera', type: 'course', cost: 'Free Audit', duration: '8 weeks', rating: 4.8, passRate: 81, url: '#' },
            { title: 'Kaggle Python + Pandas', provider: 'Kaggle', type: 'interactive', cost: 'FREE', duration: '6 hours', rating: 4.5, passRate: 89, url: '#' },
        ],
    },
    {
        skill: 'Excel / Google Sheets', priority: 'medium', score: 0, needed: 50, demandPct: 55,
        resources: [
            { title: 'Excel for Beginners — YouTube', provider: 'YouTube', type: 'playlist', cost: 'FREE', duration: '6 hours', rating: 4.3, passRate: 72, url: '#' },
        ],
    },
    {
        skill: 'Statistics', priority: 'high', score: 20, needed: 65, demandPct: 71,
        resources: [
            { title: 'Intro to Statistics — Khan Academy', provider: 'Khan Academy', type: 'course', cost: 'FREE', duration: '10 hours', rating: 4.7, passRate: 76, url: '#' },
            { title: 'Statistics with Python — NPTEL', provider: 'NPTEL', type: 'course', cost: 'FREE', duration: '12 weeks', rating: 4.4, passRate: 68, url: '#' },
        ],
    },
];

const LEARNING_CALENDAR = [
    { week: 'Week 1-2', topic: 'SQL Basics', hours: 8, resource: 'NPTEL SQL Course', status: 'current' as const },
    { week: 'Week 3-4', topic: 'SQL Advanced (Joins, Subqueries)', hours: 10, resource: 'NPTEL SQL + Practice', status: 'upcoming' as const },
    { week: 'Week 5', topic: 'Mentixy SQL Verification Quiz', hours: 2, resource: 'Mentixy Platform', status: 'upcoming' as const },
    { week: 'Week 6-8', topic: 'Python for Data Analysis', hours: 12, resource: 'Kaggle + Coursera', status: 'upcoming' as const },
    { week: 'Week 9', topic: 'Mentixy Python Intermediate Verification', hours: 2, resource: 'Mentixy Platform', status: 'upcoming' as const },
    { week: 'Week 10-11', topic: 'Statistics Fundamentals', hours: 10, resource: 'Khan Academy', status: 'upcoming' as const },
    { week: 'Week 12', topic: 'Excel Basics + Final Assessment', hours: 8, resource: 'YouTube + Mentixy', status: 'upcoming' as const },
];

const TRACKED_RESOURCES = [
    { title: 'Python for Everybody', status: 'completed' as const, skill: 'Python', score: 82, date: 'Feb 10' },
    { title: 'Array Problems Sheet', status: 'in-progress' as const, skill: 'DSA', progress: 67, date: 'Feb 20' },
    { title: 'NPTEL SQL Basics', status: 'in-progress' as const, skill: 'SQL', progress: 23, date: 'Feb 25' },
    { title: 'Aptitude Shortcuts Guide', status: 'bookmarked' as const, skill: 'Aptitude', date: 'Feb 22' },
];

export default function LearnPage() {
    const [tab, setTab] = useState<'pipeline' | 'calendar' | 'resources' | 'roadmap'>('pipeline');
    const [roadmaps, setRoadmaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [form, setForm] = useState({ target_career: '', hours_per_week: 10 });

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        api.getMyRoadmaps().then(data => {
            setRoadmaps(data.roadmaps || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const generateRoadmap = async () => {
        if (!form.target_career) return;
        setGenerating(true);
        try {
            await api.aiGenerateRoadmap({ target_career: form.target_career, hours_per_week: form.hours_per_week });
            const data = await api.getMyRoadmaps();
            setRoadmaps(data.roadmaps || []);
            setForm({ target_career: '', hours_per_week: 10 });
        } catch (e: any) {
            alert(e.message || 'Failed to generate roadmap');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-6 py-8">
                        <div className="max-w-4xl mx-auto">
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                                <h1 className="text-2xl font-bold mb-2">📚 Learning Hub</h1>
                                <p className="text-white/80 text-sm">Skill gap → Learning → Verification pipeline. Not just courses — your complete career-linked learning intelligence.</p>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
                        {/* Tabs */}
                        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200 mb-6 overflow-x-auto">
                            {([
                                { id: 'pipeline' as const, label: '🔴 Skill Gap Pipeline' },
                                { id: 'calendar' as const, label: '📅 Learning Calendar' },
                                { id: 'resources' as const, label: '📖 My Resources' },
                                { id: 'roadmap' as const, label: '🗺️ AI Roadmaps' },
                            ]).map(t => (
                                <button key={t.id} onClick={() => setTab(t.id)}
                                    className={`flex-shrink-0 flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {/* ═══ Skill Gap Pipeline (Bible C1) ═══ */}
                            {tab === 'pipeline' && (
                                <motion.div key="pipeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-100 mb-4">
                                        <p className="text-xs font-bold text-indigo-700 mb-1">🎯 Your Career Target: Data Analyst</p>
                                        <p className="text-[11px] text-indigo-600">Based on your CareerDNA™ assessment and target role, here are your skill gaps with recommended learning resources:</p>
                                    </div>

                                    {SKILL_GAPS.map((gap, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="st-card p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${gap.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                                                gap.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                                                                    'bg-emerald-100 text-emerald-700'
                                                            }`}>{gap.priority.toUpperCase()}</span>
                                                        <h3 className="text-sm font-bold text-slate-900">{gap.skill}</h3>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400">Appears in {gap.demandPct}% of Data Analyst JDs</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400">Current: <span className={`font-bold ${gap.score >= gap.needed ? 'text-emerald-600' : 'text-red-500'}`}>{gap.score || 'Missing'}</span></p>
                                                    <p className="text-[10px] text-slate-400">Needed: ≥{gap.needed}th %ile</p>
                                                </div>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                                                <div className={`rounded-full h-2 transition-all ${gap.score >= gap.needed ? 'bg-emerald-400' : gap.score > 0 ? 'bg-amber-400' : 'bg-red-300'}`}
                                                    style={{ width: `${(gap.score / gap.needed) * 100}%` }} />
                                            </div>

                                            {/* Recommended Resources */}
                                            <div className="space-y-2">
                                                {gap.resources.map((r, ri) => (
                                                    <div key={ri} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                                                        <span className="text-lg">{r.type === 'course' ? '📹' : r.type === 'interactive' ? '💻' : '📺'}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-slate-900">{r.title}</p>
                                                            <div className="flex items-center gap-2 text-[9px] text-slate-400 mt-0.5">
                                                                <span>{r.provider}</span>
                                                                <span>·</span>
                                                                <span className={r.cost === 'FREE' || r.cost === 'Free Audit' ? 'text-emerald-600 font-bold' : 'text-slate-500'}>{r.cost}</span>
                                                                <span>·</span>
                                                                <span>{r.duration}</span>
                                                                <span>·</span>
                                                                <span>⭐ {r.rating}</span>
                                                            </div>
                                                            <p className="text-[9px] text-indigo-500 mt-0.5">{r.passRate}% of students who completed this passed Mentixy&apos;s verification</p>
                                                        </div>
                                                        <button className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-lg hover:bg-indigo-200 flex-shrink-0">
                                                            Start →
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Verification CTA */}
                                            <div className="mt-3 flex items-center gap-2 text-[10px] text-indigo-600">
                                                <span>🏅</span>
                                                <span>After completing → Take Mentixy {gap.skill} Verification Quiz</span>
                                                {gap.score > 0 && (
                                                    <span className="ml-auto text-emerald-600">Verifying would increase your Mentixy Score by ~8 points</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {/* ═══ Learning Calendar (Bible C1) ═══ */}
                            {tab === 'calendar' && (
                                <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                                        <p className="text-xs font-bold text-emerald-800">📅 Auto-Generated Learning Calendar</p>
                                        <p className="text-[11px] text-emerald-600 mt-1">Based on your placement season (87 days away) and 10 hours/week availability. Adjust if behind schedule — plan auto-recalculates.</p>
                                    </div>

                                    <div className="space-y-2">
                                        {LEARNING_CALENDAR.map((week, i) => (
                                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.04 }}
                                                className={`st-card p-4 flex items-center gap-4 ${week.status === 'current' ? 'border-l-4 border-indigo-500' : ''}`}>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${week.status === 'current' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {week.week.replace('Week ', 'W')}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900">{week.topic}</p>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                                        <span>📖 {week.resource}</span>
                                                        <span>·</span>
                                                        <span>⏱️ {week.hours} hours</span>
                                                    </div>
                                                </div>
                                                {week.status === 'current' ? (
                                                    <span className="text-[9px] bg-indigo-600 text-white px-2 py-1 rounded-full font-bold flex-shrink-0">IN PROGRESS</span>
                                                ) : (
                                                    <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-1 rounded-full font-bold flex-shrink-0">UPCOMING</span>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                                        <p className="text-[11px] text-amber-700">⚠️ Skipped 3 days this week? Don&apos;t worry — revised plan: Add 2 extra hours in Week 3-4 to catch up.</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══ My Resources (tracking) ═══ */}
                            {tab === 'resources' && (
                                <motion.div key="resources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                                    {TRACKED_RESOURCES.map((r, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="st-card p-4 flex items-center gap-3">
                                            <span className="text-lg">{r.status === 'completed' ? '✅' : r.status === 'in-progress' ? '📖' : '🔖'}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900">{r.title}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                                    <span>Skill: {r.skill}</span>
                                                    <span>·</span>
                                                    <span>{r.date}</span>
                                                </div>
                                                {r.status === 'in-progress' && r.progress && (
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                                                            <div className="bg-indigo-400 rounded-full h-1.5" style={{ width: `${r.progress}%` }} />
                                                        </div>
                                                        <span className="text-[9px] text-slate-400">{r.progress}%</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${r.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                    r.status === 'in-progress' ? 'bg-indigo-50 text-indigo-600' :
                                                        'bg-slate-100 text-slate-500'
                                                }`}>{r.status === 'completed' ? r.score ? `Verified: ${r.score}th %ile` : 'Done' : r.status.replace('-', ' ').toUpperCase()}</span>
                                        </motion.div>
                                    ))}

                                    <div className="text-center pt-4">
                                        <p className="text-sm text-slate-400 mb-2">Completed a course?</p>
                                        <Link href="/skills" className="text-sm text-indigo-600 font-bold hover:text-indigo-800">
                                            → Take the Mentixy Verification Quiz
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══ AI Roadmaps (original feature) ═══ */}
                            {tab === 'roadmap' && (
                                <motion.div key="roadmap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                                    <section className="st-card p-6">
                                        <h2 className="font-semibold text-slate-900 mb-4">🗺️ Generate New Roadmap</h2>
                                        <div className="flex flex-col md:flex-row gap-3">
                                            <input type="text" value={form.target_career}
                                                onChange={e => setForm(f => ({ ...f, target_career: e.target.value }))}
                                                placeholder="Target career (e.g., Data Scientist, SDE)" className="st-input flex-1" />
                                            <input type="number" value={form.hours_per_week}
                                                onChange={e => setForm(f => ({ ...f, hours_per_week: parseInt(e.target.value) || 10 }))}
                                                className="st-input w-32" min={1} max={60} />
                                            <button onClick={generateRoadmap} disabled={generating || !form.target_career}
                                                className="st-btn-primary whitespace-nowrap disabled:opacity-50 flex items-center gap-2">
                                                {generating ? (
                                                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
                                                ) : '✨ Generate'}
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2">Hours/week you can dedicate to learning</p>
                                    </section>

                                    <section>
                                        <h2 className="st-section-title mb-4">Your Roadmaps</h2>
                                        {loading ? (
                                            [1, 2].map(i => <div key={i} className="st-card p-6 animate-pulse h-24 mb-3" />)
                                        ) : roadmaps.length === 0 ? (
                                            <div className="text-center py-12 st-card">
                                                <span className="text-4xl block mb-3">📚</span>
                                                <p className="text-slate-500 mb-2">No roadmaps yet</p>
                                                <p className="text-xs text-slate-400">Generate your first personalized learning roadmap above!</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {roadmaps.map((rm: any, i: number) => (
                                                    <motion.div key={rm.id || i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.08 }} className="st-card p-5 hover:shadow-lg cursor-pointer">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h3 className="font-semibold text-slate-900">{rm.title || rm.target_career}</h3>
                                                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium">{rm.progress || 0}%</span>
                                                        </div>
                                                        <p className="text-sm text-slate-500">{rm.description || `Roadmap for ${rm.target_career}`}</p>
                                                        {rm.duration && <p className="text-xs text-slate-400 mt-2">⏱️ {rm.duration}</p>}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
