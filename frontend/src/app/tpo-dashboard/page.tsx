'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

interface StudentRow {
    id: string; name: string; branch: string; cgpa: number; mentixyScore: number;
    problemsSolved: number; aptitudePercentile: number; streak: number;
    readiness: 'highly-ready' | 'ready' | 'needs-work' | 'at-risk';
    skillsVerified: number; lastActive: string;
}

export default function TPODashboardPage() {
    const [students] = useState<StudentRow[]>([]); // TODO: Fetch from campus API
    const [drives] = useState<{ company: string; date: string; roles: string; eligibility: string; eligible: number; registered: number; status: string }[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'drives' | 'analytics'>('overview');
    const [readinessFilter, setReadinessFilter] = useState('all');
    const [branchFilter, setBranchFilter] = useState('all');
    const [sortBy, setSortBy] = useState<'score' | 'cgpa' | 'streak'>('score');

    
    const readinessColor = (r: string) => r === 'highly-ready' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
        r === 'ready' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            r === 'needs-work' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-red-50 text-red-700 border-red-200';

    const readinessLabel = (r: string) => r === 'highly-ready' ? '🟢 Highly Ready' :
        r === 'ready' ? '🔵 Ready' : r === 'needs-work' ? '🟡 Needs Work' : '🔴 At Risk';

    const filteredStudents = students
        .filter(s => readinessFilter === 'all' || s.readiness === readinessFilter)
        .filter(s => branchFilter === 'all' || s.branch === branchFilter)
        .sort((a, b) => sortBy === 'score' ? b.mentixyScore - a.mentixyScore :
            sortBy === 'cgpa' ? b.cgpa - a.cgpa : b.streak - a.streak);

    const clusters = {
        highlyReady: students.filter(s => s.readiness === 'highly-ready').length,
        ready: students.filter(s => s.readiness === 'ready').length,
        needsWork: students.filter(s => s.readiness === 'needs-work').length,
        atRisk: students.filter(s => s.readiness === 'at-risk').length,
    };

    const avgScore = students.length > 0 ? Math.round(students.reduce((a, s) => a + s.mentixyScore, 0) / students.length) : 0;
    const avgCgpa = students.length > 0 ? (students.reduce((a, s) => a + s.cgpa, 0) / students.length).toFixed(1) : '0.0';
    const activeStudents = students.filter(s => !s.lastActive.includes('day')).length;

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <main className="pb-24 md:pb-8">
                {/* Hero */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white px-6 py-8">
                    <div className="max-w-6xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full inline-block mb-2 border border-white/10">🏫 T&P OFFICER DASHBOARD</span>
                                    <h1 className="text-2xl font-bold st-font-heading">SKCT, Coimbatore — Placement HQ</h1>
                                    <p className="text-white/40 text-xs mt-1">B.E. Computer Science · Class of 2026 · {students.length} students tracked</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-white/10 text-white text-xs font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/10">
                                        📊 Download Report
                                    </button>
                                    <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                                        📢 Send Alert to All
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-4 md:px-6 max-w-6xl mx-auto -mt-3 relative z-10">
                    <div className="flex gap-1 bg-white rounded-xl p-1 shadow-lg w-fit">
                        {[
                            { key: 'overview' as const, label: '📊 Overview', },
                            { key: 'students' as const, label: '👥 Students' },
                            { key: 'drives' as const, label: '🏢 Placement Drives' },
                            { key: 'analytics' as const, label: '📈 Analytics' },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === tab.key ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: 'Avg Mentixy Score', value: avgScore.toString(), color: 'text-indigo-600', sub: `vs national avg: 54` },
                                    { label: 'Avg CGPA', value: avgCgpa, color: 'text-violet-600', sub: 'B.E. CSE batch' },
                                    { label: 'Active This Week', value: `${activeStudents}/${students.length}`, color: 'text-emerald-600', sub: `${students.length > 0 ? Math.round(activeStudents / students.length * 100) : 0}% engagement` },
                                    { label: 'Campus Wars Rank', value: '#7', color: 'text-amber-600', sub: 'South India ranking' },
                                ].map(m => (
                                    <div key={m.label} className="st-card p-4">
                                        <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                                        <p className="text-xs text-slate-900 font-semibold mt-1">{m.label}</p>
                                        <p className="text-[10px] text-slate-400">{m.sub}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Student Readiness Clusters */}
                            <div className="st-card p-5">
                                <h3 className="font-bold text-sm text-slate-900 mb-3">📊 Student Readiness Clusters</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { label: 'Highly Ready', count: clusters.highlyReady, pct: students.length > 0 ? Math.round(clusters.highlyReady / students.length * 100) : 0, color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', desc: 'Score 75+, active, skills verified' },
                                        { label: 'Ready', count: clusters.ready, pct: students.length > 0 ? Math.round(clusters.ready / students.length * 100) : 0, color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', desc: 'Score 60-74, active within 3 days' },
                                        { label: 'Needs Work', count: clusters.needsWork, pct: students.length > 0 ? Math.round(clusters.needsWork / students.length * 100) : 0, color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', desc: 'Score 40-59, sporadic activity' },
                                        { label: 'At Risk', count: clusters.atRisk, pct: students.length > 0 ? Math.round(clusters.atRisk / students.length * 100) : 0, color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700', desc: 'Score <40, inactive 7+ days' },
                                    ].map(c => (
                                        <div key={c.label} className={`${c.bg} rounded-xl p-3 text-center`}>
                                            <p className={`text-2xl font-bold ${c.text}`}>{c.count}</p>
                                            <p className={`text-xs font-semibold ${c.text} mt-1`}>{c.label}</p>
                                            <div className="w-full bg-white/60 rounded-full h-2 mt-2">
                                                <div className={`h-2 rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                                            </div>
                                            <p className="text-[9px] text-slate-500 mt-1">{c.pct}% · {c.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Urgent Alerts */}
                            {(students.length > 0 || drives.length > 0) && (
                            <div className="st-card p-5 border-l-4 border-red-400 bg-red-50/30">
                                <h3 className="font-bold text-sm text-red-700 mb-2">⚠️ Urgent Attention Required</h3>
                                <div className="space-y-2 text-xs text-slate-700">
                                    {clusters.atRisk > 0 && <p>🔴 <strong>{clusters.atRisk} students</strong> haven't logged in for 7+ days. Last active: {students.filter(s => s.readiness === 'at-risk').map(s => s.name).join(', ')}.</p>}
                                    {drives.length > 0 && <p>🟡 <strong>{drives[0].company} drive on {drives[0].date}</strong> — only {drives[0].registered} of {drives[0].eligible} eligible students have registered.</p>}
                                    {students.filter(s => s.aptitudePercentile < 65).length > 0 && <p>🟡 <strong>{students.filter(s => s.aptitudePercentile < 65).length} students</strong> below aptitude cutoff (65th %ile). Borderline: {students.filter(s => s.aptitudePercentile >= 58 && s.aptitudePercentile < 65).map(s => s.name).join(', ') || 'None'}.</p>}
                                </div>
                            </div>
                            )}

                            {/* Upcoming Drives */}
                            <div className="st-card p-5">
                                <h3 className="font-bold text-sm text-slate-900 mb-3">🏢 Upcoming Placement Drives</h3>
                                <div className="space-y-2">
                                    {drives.slice(0, 3).map((d, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-sm font-bold">{d.company[0]}</div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-slate-900">{d.company} — {d.roles}</p>
                                                <p className="text-[10px] text-slate-400">{d.date} · {d.eligibility}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-indigo-600">{d.registered}/{d.eligible} registered</p>
                                                <p className={`text-[10px] font-semibold ${d.status === 'Registration Open' ? 'text-emerald-600' : 'text-amber-600'}`}>{d.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STUDENTS TAB */}
                    {activeTab === 'students' && (
                        <div className="space-y-4">
                            {/* Filters */}
                            <div className="flex flex-wrap gap-2">
                                <select value={readinessFilter} onChange={e => setReadinessFilter(e.target.value)} className="st-input text-xs w-40">
                                    <option value="all">All Readiness</option>
                                    <option value="highly-ready">🟢 Highly Ready</option>
                                    <option value="ready">🔵 Ready</option>
                                    <option value="needs-work">🟡 Needs Work</option>
                                    <option value="at-risk">🔴 At Risk</option>
                                </select>
                                <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="st-input text-xs w-32">
                                    <option value="all">All Branches</option>
                                    <option value="CSE">CSE</option>
                                    <option value="IT">IT</option>
                                    <option value="ECE">ECE</option>
                                    <option value="Mech">Mech</option>
                                </select>
                                <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="st-input text-xs w-36">
                                    <option value="score">Sort by Score</option>
                                    <option value="cgpa">Sort by CGPA</option>
                                    <option value="streak">Sort by Streak</option>
                                </select>
                                <span className="text-xs text-slate-400 self-center ml-auto">{filteredStudents.length} students</span>
                            </div>

                            {/* Student Table */}
                            <div className="st-card overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="text-left py-3 px-4 font-semibold text-slate-500">Student</th>
                                                <th className="text-center py-3 px-2 font-semibold text-slate-500">Branch</th>
                                                <th className="text-center py-3 px-2 font-semibold text-slate-500">CGPA</th>
                                                <th className="text-center py-3 px-2 font-semibold text-slate-500">Score</th>
                                                <th className="text-center py-3 px-2 font-semibold text-slate-500">Problems</th>
                                                <th className="text-center py-3 px-2 font-semibold text-slate-500">Aptitude</th>
                                                <th className="text-center py-3 px-2 font-semibold text-slate-500">Streak</th>
                                                <th className="text-center py-3 px-2 font-semibold text-slate-500">Skills</th>
                                                <th className="text-center py-3 px-2 font-semibold text-slate-500">Readiness</th>
                                                <th className="text-center py-3 px-2 font-semibold text-slate-500">Active</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.map((s, i) => (
                                                <tr key={s.id} className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors cursor-pointer">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">{s.name[0]}</div>
                                                            <span className="font-semibold text-slate-900">{s.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-center py-3 px-2 text-slate-600">{s.branch}</td>
                                                    <td className="text-center py-3 px-2 font-semibold">{s.cgpa}</td>
                                                    <td className={`text-center py-3 px-2 font-bold ${s.mentixyScore >= 75 ? 'text-emerald-600' : s.mentixyScore >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{s.mentixyScore}</td>
                                                    <td className="text-center py-3 px-2 text-slate-600">{s.problemsSolved}</td>
                                                    <td className={`text-center py-3 px-2 font-semibold ${s.aptitudePercentile >= 75 ? 'text-emerald-600' : s.aptitudePercentile >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{s.aptitudePercentile}th</td>
                                                    <td className="text-center py-3 px-2">
                                                        {s.streak > 0 ? <span className="text-orange-500 font-bold">🔥 {s.streak}d</span> : <span className="text-slate-300">—</span>}
                                                    </td>
                                                    <td className="text-center py-3 px-2 text-indigo-600 font-semibold">{s.skillsVerified}</td>
                                                    <td className="text-center py-3 px-2">
                                                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-bold border ${readinessColor(s.readiness)}`}>
                                                            {readinessLabel(s.readiness)}
                                                        </span>
                                                    </td>
                                                    <td className="text-center py-3 px-2 text-slate-400">{s.lastActive}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DRIVES TAB */}
                    {activeTab === 'drives' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-sm text-slate-900">Placement Drive Calendar</h3>
                                <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                                    + Add Company Visit
                                </button>
                            </div>
                            {drives.map((d, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    className="st-card p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg">{d.company[0]}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900">{d.company}</h4>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${d.status === 'Registration Open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>{d.status}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-2">{d.roles} · {d.date}</p>
                                            <p className="text-xs text-slate-400 mb-3">Eligibility: {d.eligibility}</p>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                                    <p className="text-lg font-bold text-indigo-600">{d.eligible}</p>
                                                    <p className="text-[9px] text-slate-400">Eligible</p>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                                    <p className="text-lg font-bold text-emerald-600">{d.registered}</p>
                                                    <p className="text-[9px] text-slate-400">Registered</p>
                                                </div>
                                                <div className="bg-slate-50 rounded-lg p-2 text-center">
                                                    <p className="text-lg font-bold text-amber-600">{d.eligible - d.registered}</p>
                                                    <p className="text-[9px] text-slate-400">Not yet</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition-colors">📢 Notify Students</button>
                                            <button className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors">👥 View Eligible</button>
                                            <button className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors">📊 Readiness Report</button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* ANALYTICS TAB */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Department-wise */}
                                <div className="st-card p-5">
                                    <h3 className="font-bold text-sm text-slate-900 mb-3">🏛️ Department-Wise Readiness</h3>
                                    <div className="text-center py-6">
                                        <p className="text-xs text-slate-500">Department data will populate when students are tracked</p>
                                    </div>
                                </div>

                                {/* Vs Last Year */}
                                <div className="st-card p-5">
                                    <h3 className="font-bold text-sm text-slate-900 mb-3">📈 vs Last Year (Class of 2025)</h3>
                                    {[
                                        { metric: 'Average Mentixy Score', current: avgScore, prev: 48, unit: '' },
                                        { metric: 'Avg Problems Solved', current: students.length > 0 ? Math.round(students.reduce((a, s) => a + s.problemsSolved, 0) / students.length) : 0, prev: 34, unit: '' },
                                        { metric: 'Active Rate (7-day)', current: students.length > 0 ? Math.round(activeStudents / students.length * 100) : 0, prev: 42, unit: '%' },
                                        { metric: 'Skills Verified (avg)', current: students.length > 0 ? +(students.reduce((a, s) => a + s.skillsVerified, 0) / students.length).toFixed(1) : 0, prev: 1.2, unit: '' },
                                    ].map(m => {
                                        const delta = Math.round(((m.current - m.prev) / m.prev) * 100);
                                        return (
                                            <div key={m.metric} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                                <span className="text-xs text-slate-600">{m.metric}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-900">{m.current}{m.unit}</span>
                                                    <span className={`text-[10px] font-bold ${delta > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                        {delta > 0 ? '↑' : '↓'} {Math.abs(delta)}%
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">(was {m.prev}{m.unit})</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Report Generation */}
                            <div className="st-card p-5 bg-gradient-to-br from-indigo-50 to-violet-50">
                                <h3 className="font-bold text-sm text-slate-900 mb-2">📄 Generate Reports</h3>
                                <p className="text-xs text-slate-500 mb-3">Auto-generated reports for accreditation, management, and placement records.</p>
                                <div className="flex flex-wrap gap-2">
                                    {['NIRF Data Report', 'NAAC Accreditation', 'Placement Summary', 'Student Readiness Report', 'Company Visit History'].map(r => (
                                        <button key={r} className="px-3 py-2 bg-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                                            📋 {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
