'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const MOCK_STUDENTS = [
    { id: '1', name: 'Arjun Sharma', stream: 'CSE', year: 3, score: 812, streak: 45, status: 'placed', company: 'Infosys', ctc: 6.5, avatar: '👨‍💻', risk: 'low' },
    { id: '2', name: 'Priya Patel', stream: 'IT', year: 4, score: 875, streak: 67, status: 'placed', company: 'TCS', ctc: 5.2, avatar: '👩‍💻', risk: 'low' },
    { id: '3', name: 'Rahul Kumar', stream: 'CSE', year: 3, score: 456, streak: 5, status: 'preparing', company: '', ctc: 0, avatar: '👨‍🎓', risk: 'high' },
    { id: '4', name: 'Sneha Reddy', stream: 'ECE', year: 4, score: 723, streak: 30, status: 'interviewing', company: 'Wipro', ctc: 0, avatar: '👩‍🔬', risk: 'medium' },
    { id: '5', name: 'Karthik Iyer', stream: 'CSE', year: 3, score: 389, streak: 2, status: 'inactive', company: '', ctc: 0, avatar: '👨‍🔧', risk: 'critical' },
    { id: '6', name: 'Ananya Gupta', stream: 'IT', year: 4, score: 841, streak: 55, status: 'placed', company: 'Cognizant', ctc: 4.8, avatar: '👩‍💼', risk: 'low' },
    { id: '7', name: 'Vikram Singh', stream: 'CSE', year: 3, score: 612, streak: 15, status: 'preparing', company: '', ctc: 0, avatar: '👨‍💻', risk: 'medium' },
    { id: '8', name: 'Divya Nair', stream: 'MECH', year: 4, score: 334, streak: 0, status: 'inactive', company: '', ctc: 0, avatar: '👩‍📊', risk: 'critical' },
    { id: '9', name: 'Amit Joshi', stream: 'CSE', year: 4, score: 756, streak: 38, status: 'interviewing', company: 'Capgemini', ctc: 0, avatar: '👨‍💻', risk: 'low' },
    { id: '10', name: 'Meera Das', stream: 'IT', year: 3, score: 567, streak: 10, status: 'preparing', company: '', ctc: 0, avatar: '👩‍💻', risk: 'medium' },
];

const UPCOMING_DRIVES = [
    { company: 'TCS', date: 'Mar 5, 2026', roles: 'Software Engineer, Business Analyst', ctc: '3.36 - 7.0 LPA', eligible: 42, registered: 38 },
    { company: 'Infosys', date: 'Mar 12, 2026', roles: 'System Engineer, Power Programmer', ctc: '3.6 - 9.5 LPA', eligible: 56, registered: 31 },
    { company: 'Wipro', date: 'Mar 20, 2026', roles: 'Project Engineer, WILP', ctc: '3.5 - 6.5 LPA', eligible: 48, registered: 22 },
    { company: 'Cognizant', date: 'Apr 1, 2026', roles: 'GenC, GenC Next', ctc: '4.0 - 6.75 LPA', eligible: 38, registered: 15 },
];

export default function CampusCommandPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'drives' | 'analytics' | 'reports'>('overview');
    const [studentFilter, setStudentFilter] = useState<string>('all');

    const placed = MOCK_STUDENTS.filter(s => s.status === 'placed');
    const atRisk = MOCK_STUDENTS.filter(s => s.risk === 'critical' || s.risk === 'high');
    const avgScore = Math.round(MOCK_STUDENTS.reduce((s, c) => s + c.score, 0) / MOCK_STUDENTS.length);
    const placementRate = Math.round((placed.length / MOCK_STUDENTS.length) * 100);

    const filteredStudents = studentFilter === 'all' ? MOCK_STUDENTS :
        studentFilter === 'at-risk' ? atRisk :
            MOCK_STUDENTS.filter(s => s.status === studentFilter);

    const riskColor = (r: string) => r === 'critical' ? 'bg-red-100 text-red-700' : r === 'high' ? 'bg-orange-100 text-orange-700' : r === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';
    const statusBadge = (s: string) => s === 'placed' ? 'bg-emerald-100 text-emerald-700' : s === 'interviewing' ? 'bg-blue-100 text-blue-700' : s === 'preparing' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';

    const tabs = ['overview', 'students', 'drives', 'analytics', 'reports'] as const;

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <header className="bg-slate-800/80 border-b border-slate-700 sticky top-0 z-30 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">ST</div>
                            <span className="text-xl font-bold">Skill<span className="text-indigo-400">Ten</span></span>
                        </Link>
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">Campus Command</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-400 text-xs">XYZ Institute of Technology</span>
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-sm">🏫</div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Tabs */}
                <div className="flex gap-1 bg-slate-800 rounded-xl p-1 border border-slate-700 mb-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize whitespace-nowrap ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Students', value: MOCK_STUDENTS.length.toString(), icon: '👥', sub: 'Active on Mentixy', color: 'from-indigo-500/20 to-violet-500/20', border: 'border-indigo-500/30' },
                                { label: 'Placement Rate', value: `${placementRate}%`, icon: '🎯', sub: `${placed.length} placed`, color: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/30' },
                                { label: 'Avg Score', value: avgScore.toString(), icon: '📊', sub: 'Mentixy Score', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
                                { label: 'At-Risk Students', value: atRisk.length.toString(), icon: '⚠️', sub: 'Need attention', color: 'from-red-500/20 to-rose-500/20', border: 'border-red-500/30' },
                            ].map((kpi, i) => (
                                <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className={`bg-gradient-to-br ${kpi.color} rounded-xl p-5 border ${kpi.border}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xl">{kpi.icon}</span>
                                        <span className="text-xs font-semibold text-slate-400">{kpi.label}</span>
                                    </div>
                                    <p className="text-3xl font-bold">{kpi.value}</p>
                                    <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Two-column layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* At-Risk Students */}
                            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                                <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    At-Risk Students
                                </h3>
                                <div className="space-y-3">
                                    {atRisk.map(s => (
                                        <div key={s.id} className="flex items-center gap-3 bg-slate-700/50 rounded-lg p-3">
                                            <span className="text-lg">{s.avatar}</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold">{s.name}</p>
                                                <p className="text-xs text-slate-400">{s.stream} · Year {s.year} · Score {s.score}</p>
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${riskColor(s.risk)}`}>{s.risk.toUpperCase()}</span>
                                        </div>
                                    ))}
                                    {atRisk.length === 0 && <p className="text-sm text-slate-500 text-center py-4">🎉 No at-risk students!</p>}
                                </div>
                            </div>

                            {/* Upcoming Drives */}
                            <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                                <h3 className="font-bold text-sm mb-4">🏢 Upcoming Placement Drives</h3>
                                <div className="space-y-3">
                                    {UPCOMING_DRIVES.slice(0, 3).map(d => (
                                        <div key={d.company} className="bg-slate-700/50 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-sm">{d.company}</p>
                                                <span className="text-xs text-slate-400">{d.date}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">{d.roles}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-emerald-400">{d.ctc}</span>
                                                <span className="text-xs text-slate-500">{d.registered}/{d.eligible} registered</span>
                                            </div>
                                            <div className="w-full bg-slate-600 rounded-full h-1.5 mt-2">
                                                <div className="bg-indigo-500 rounded-full h-1.5" style={{ width: `${(d.registered / d.eligible) * 100}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Placement Funnel */}
                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                            <h3 className="font-bold text-sm mb-4">📊 Placement Funnel</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {[
                                    { label: 'Registered', count: MOCK_STUDENTS.length, pct: 100, color: 'bg-slate-600' },
                                    { label: 'Active', count: MOCK_STUDENTS.filter(s => s.status !== 'inactive').length, pct: 80, color: 'bg-indigo-500' },
                                    { label: 'Applying', count: MOCK_STUDENTS.filter(s => ['interviewing', 'placed'].includes(s.status)).length, pct: 50, color: 'bg-violet-500' },
                                    { label: 'Interviewing', count: MOCK_STUDENTS.filter(s => s.status === 'interviewing').length, pct: 20, color: 'bg-amber-500' },
                                    { label: 'Placed', count: placed.length, pct: placementRate, color: 'bg-emerald-500' },
                                ].map((stage, i) => (
                                    <div key={stage.label} className="text-center">
                                        <div className="relative h-32 flex items-end justify-center mb-2">
                                            <motion.div initial={{ height: 0 }} animate={{ height: `${stage.pct}%` }}
                                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                                className={`w-full rounded-t-lg ${stage.color}`} />
                                        </div>
                                        <p className="text-sm font-bold">{stage.count}</p>
                                        <p className="text-[10px] text-slate-400">{stage.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div>
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            {[
                                { key: 'all', label: 'All' },
                                { key: 'placed', label: '✅ Placed' },
                                { key: 'interviewing', label: '🔵 Interviewing' },
                                { key: 'preparing', label: '🟡 Preparing' },
                                { key: 'inactive', label: '🔴 Inactive' },
                                { key: 'at-risk', label: '⚠️ At Risk' },
                            ].map(f => (
                                <button key={f.key} onClick={() => setStudentFilter(f.key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${studentFilter === f.key ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-700 text-left">
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-400">Student</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-400">Stream</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-400">Score</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-400">Streak</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-400">Status</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-400">Risk</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-400">Placement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map(s => (
                                        <tr key={s.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span>{s.avatar}</span>
                                                    <div>
                                                        <p className="font-semibold text-sm">{s.name}</p>
                                                        <p className="text-xs text-slate-500">Year {s.year}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{s.stream}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold">{s.score}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm">{s.streak > 0 ? `🔥 ${s.streak}d` : '—'}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${statusBadge(s.status)}`}>{s.status}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${riskColor(s.risk)}`}>{s.risk}</span>
                                            </td>
                                            <td className="px-4 py-3 text-xs">
                                                {s.company ? <span className="text-emerald-400">{s.company} · ₹{s.ctc} LPA</span> : <span className="text-slate-500">—</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Drives Tab */}
                {activeTab === 'drives' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg">📅 Placement Drives</h2>
                            <button className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                + Schedule Drive
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {UPCOMING_DRIVES.map(d => (
                                <motion.div key={d.company} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg">{d.company}</h3>
                                            <p className="text-xs text-slate-400">{d.date}</p>
                                        </div>
                                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/30">
                                            {d.ctc}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-300 mb-3">{d.roles}</p>
                                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                        <span>{d.registered} registered</span>
                                        <span>{d.eligible} eligible</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2">
                                        <div className="bg-indigo-500 rounded-full h-2 transition-all" style={{ width: `${(d.registered / d.eligible) * 100}%` }} />
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
                                            Notify Students
                                        </button>
                                        <button className="flex-1 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-600 transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Avg CTC', value: '₹5.4 LPA', delta: '+0.8 vs last year', icon: '💰' },
                                { label: 'Highest CTC', value: '₹12 LPA', delta: 'TCS Digital', icon: '🏆' },
                                { label: 'Companies Visited', value: '18', delta: 'This season', icon: '🏢' },
                                { label: 'Offer-to-Join', value: '89%', delta: '+3% vs last year', icon: '✅' },
                            ].map((s, i) => (
                                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">{s.icon}</span>
                                        <span className="text-xs text-slate-400 font-semibold">{s.label}</span>
                                    </div>
                                    <p className="text-2xl font-bold">{s.value}</p>
                                    <p className="text-xs text-emerald-400 mt-1">{s.delta}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Score distribution */}
                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                            <h3 className="font-bold text-sm mb-4">📊 Student Score Distribution</h3>
                            <div className="grid grid-cols-5 gap-3">
                                {[
                                    { range: '0-200', count: 0, color: 'bg-red-500' },
                                    { range: '201-400', count: 2, color: 'bg-orange-500' },
                                    { range: '401-600', count: 2, color: 'bg-amber-500' },
                                    { range: '601-800', count: 3, color: 'bg-indigo-500' },
                                    { range: '801+', count: 3, color: 'bg-emerald-500' },
                                ].map(b => (
                                    <div key={b.range} className="text-center">
                                        <div className="relative h-24 flex items-end justify-center mb-2">
                                            <motion.div initial={{ height: 0 }} animate={{ height: `${(b.count / MOCK_STUDENTS.length) * 100 * 2.5}%` }}
                                                transition={{ duration: 0.6 }}
                                                className={`w-full rounded-t-lg ${b.color}`} />
                                        </div>
                                        <p className="text-sm font-bold">{b.count}</p>
                                        <p className="text-[10px] text-slate-500">{b.range}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stream-wise placement */}
                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                            <h3 className="font-bold text-sm mb-4">🎓 Stream-wise Placement Status</h3>
                            <div className="space-y-3">
                                {[
                                    { stream: 'CSE', total: 5, placed: 1, interviewing: 1, pct: 20 },
                                    { stream: 'IT', total: 3, placed: 2, interviewing: 0, pct: 67 },
                                    { stream: 'ECE', total: 1, placed: 0, interviewing: 1, pct: 0 },
                                    { stream: 'MECH', total: 1, placed: 0, interviewing: 0, pct: 0 },
                                ].map(s => (
                                    <div key={s.stream} className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-slate-400 w-12">{s.stream}</span>
                                        <div className="flex-1 bg-slate-700 rounded-full h-3 relative overflow-hidden">
                                            <div className="bg-emerald-500 h-3 rounded-l-full" style={{ width: `${s.pct}%` }} />
                                        </div>
                                        <span className="text-xs text-slate-400 w-20 text-right">{s.placed}/{s.total} placed</span>
                                        <span className="text-xs font-bold w-10 text-right">{s.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                    <div className="space-y-4">
                        <h2 className="font-bold text-lg">📄 Placement Reports</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Placement Summary 2025-26', desc: 'Overall placement statistics, company-wise breakdown, CTC analysis', icon: '📊', type: 'PDF' },
                                { title: 'Student Readiness Report', desc: 'SWOT analysis of current batch, skill gap identification, at-risk students', icon: '📋', type: 'PDF' },
                                { title: 'Company Engagement Report', desc: 'Companies visited, offers made, conversion rates, feedback summary', icon: '🏢', type: 'PDF' },
                                { title: 'Mentixy Score Analysis', desc: 'Score distribution, trend over semester, correlation with placement outcomes', icon: '📈', type: 'Excel' },
                                { title: 'Parent Communication Kit', desc: 'WhatsApp-ready summaries, placement highlights, student progress reports', icon: '👨‍👩‍👦', type: 'PDF' },
                                { title: 'Interview Experience Database', desc: 'All interview experiences shared by students, company-wise, round-wise', icon: '💬', type: 'Excel' },
                            ].map(report => (
                                <div key={report.title} className="bg-slate-800 rounded-xl border border-slate-700 p-5 flex items-start gap-4">
                                    <span className="text-2xl mt-0.5">{report.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm">{report.title}</h3>
                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{report.desc}</p>
                                        <button className="mt-3 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                            📥 Download {report.type}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
