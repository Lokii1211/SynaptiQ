'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

/* ─── Campus Drive Calendar + Company Readiness Calculator (Bible Phase 9) ─── */

const USER_PROFILE = {
    cgpa: 7.2,
    branch: 'CSE',
    year: 2026,
    pythonScore: 74,
    sqlScore: 61,
    aptitudePercentile: 71,
    codingProblems: 87,
    aptitudeScore: 68,
    techMcqScore: 65,
    verbalScore: 72,
};

interface CampusDrive {
    id: number;
    company: string;
    icon: string;
    role: string;
    lpa: string;
    date: string;
    type: 'my-college' | 'off-campus' | 'pan-india';
    status: 'upcoming' | 'live' | 'completed';
    registrationDeadline: string;
    eligibility: { cgpa: number; branches: string[]; yearOfPassing: number[] };
    process: string[];
    readiness?: number;
}

const CAMPUS_DRIVES: CampusDrive[] = [
    { id: 1, company: 'TCS', icon: '🏢', role: 'System Engineer', lpa: '3.36-7.0 LPA', date: '2026-03-15', type: 'my-college', status: 'upcoming', registrationDeadline: '2026-03-10', eligibility: { cgpa: 6.0, branches: ['CSE', 'ECE', 'IT', 'EEE', 'ME'], yearOfPassing: [2026] }, process: ['NQT Online Test', 'Technical Interview', 'Managerial Interview', 'HR Interview'] },
    { id: 2, company: 'Infosys', icon: '🔷', role: 'Systems Engineer', lpa: '3.6-9.5 LPA', date: '2026-03-22', type: 'my-college', status: 'upcoming', registrationDeadline: '2026-03-18', eligibility: { cgpa: 6.0, branches: ['CSE', 'ECE', 'IT', 'EEE'], yearOfPassing: [2026] }, process: ['InfyTQ Online Test', 'Technical Interview', 'HR Interview'] },
    { id: 3, company: 'Wipro', icon: '💜', role: 'Project Engineer', lpa: '3.5 LPA', date: '2026-04-05', type: 'my-college', status: 'upcoming', registrationDeadline: '2026-03-30', eligibility: { cgpa: 6.0, branches: ['CSE', 'ECE', 'IT', 'ME'], yearOfPassing: [2026] }, process: ['NLTH Online Test', 'Coding Round', 'Technical Interview', 'HR Interview'] },
    { id: 4, company: 'Cognizant', icon: '⚡', role: 'Programmer Analyst', lpa: '4.0-6.75 LPA', date: '2026-04-12', type: 'my-college', status: 'upcoming', registrationDeadline: '2026-04-08', eligibility: { cgpa: 6.5, branches: ['CSE', 'ECE', 'IT'], yearOfPassing: [2026] }, process: ['GenC Online Test', 'Coding Assessment', 'Communication Assessment', 'HR Interview'] },
    { id: 5, company: 'Amazon', icon: '📦', role: 'SDE-1', lpa: '26-32 LPA', date: '2026-05-10', type: 'pan-india', status: 'upcoming', registrationDeadline: '2026-04-25', eligibility: { cgpa: 7.0, branches: ['CSE', 'IT'], yearOfPassing: [2026] }, process: ['Online Assessment (2 Coding)', 'Technical Round 1', 'Technical Round 2', 'Bar Raiser', 'HR'] },
    { id: 6, company: 'Flipkart', icon: '🛒', role: 'SDE-1', lpa: '20-24 LPA', date: '2026-05-20', type: 'off-campus', status: 'upcoming', registrationDeadline: '2026-05-10', eligibility: { cgpa: 7.0, branches: ['CSE', 'IT'], yearOfPassing: [2026] }, process: ['Online Coding Test', 'Machine Coding', 'Technical Round', 'HR'] },
    { id: 7, company: 'Capgemini', icon: '🔵', role: 'Analyst', lpa: '3.8 LPA', date: '2026-02-28', type: 'my-college', status: 'completed', registrationDeadline: '2026-02-20', eligibility: { cgpa: 5.5, branches: ['CSE', 'ECE', 'IT', 'EEE', 'ME', 'CIVIL'], yearOfPassing: [2026] }, process: ['Online Test', 'Group Discussion', 'Technical Interview', 'HR Interview'] },
    { id: 8, company: 'Microsoft', icon: '🪟', role: 'SWE Intern', lpa: '₹1.5L/month', date: '2026-06-01', type: 'pan-india', status: 'upcoming', registrationDeadline: '2026-05-15', eligibility: { cgpa: 8.0, branches: ['CSE', 'IT'], yearOfPassing: [2026, 2027] }, process: ['Online Assessment', 'Group Fly Round', 'Technical Interview 1', 'Technical Interview 2', 'HR'] },
    { id: 9, company: 'Zoho', icon: '🟠', role: 'Member Technical Staff', lpa: '5.5-8.0 LPA', date: '2026-03-25', type: 'off-campus', status: 'upcoming', registrationDeadline: '2026-03-15', eligibility: { cgpa: 0, branches: ['CSE', 'ECE', 'IT', 'EEE', 'ME', 'CIVIL'], yearOfPassing: [2026] }, process: ['C Programming Round', 'Advanced Coding Round', 'Technical Interview 1', 'Technical Interview 2', 'HR'] },
    { id: 10, company: 'HCL', icon: '🟦', role: 'Software Engineer', lpa: '3.5-4.5 LPA', date: '2026-04-18', type: 'my-college', status: 'upcoming', registrationDeadline: '2026-04-12', eligibility: { cgpa: 6.0, branches: ['CSE', 'ECE', 'IT', 'EEE'], yearOfPassing: [2026] }, process: ['Online Test', 'Technical Interview', 'HR Interview'] },
];

function calculateReadiness(drive: CampusDrive, profile: typeof USER_PROFILE) {
    let total = 0; let max = 0;
    // CGPA check
    max += 20;
    if (drive.eligibility.cgpa === 0 || profile.cgpa >= drive.eligibility.cgpa) total += 20;
    else if (profile.cgpa >= drive.eligibility.cgpa - 0.5) total += 10;
    // Branch check
    max += 15;
    if (drive.eligibility.branches.includes(profile.branch)) total += 15;
    // Year check
    max += 10;
    if (drive.eligibility.yearOfPassing.includes(profile.year)) total += 10;
    // Coding readiness
    max += 25;
    if (profile.codingProblems >= 100) total += 25;
    else if (profile.codingProblems >= 50) total += 15;
    else if (profile.codingProblems >= 20) total += 8;
    // Aptitude readiness
    max += 15;
    if (profile.aptitudePercentile >= 75) total += 15;
    else if (profile.aptitudePercentile >= 60) total += 10;
    else if (profile.aptitudePercentile >= 40) total += 5;
    // Tech MCQ / skills
    max += 15;
    if (profile.techMcqScore >= 70) total += 15;
    else if (profile.techMcqScore >= 50) total += 8;
    else total += 3;
    return Math.min(Math.round((total / max) * 100), 100);
}

function getImprovementTips(readiness: number, drive: CampusDrive, profile: typeof USER_PROFILE): string[] {
    const tips: string[] = [];
    if (profile.cgpa < drive.eligibility.cgpa && drive.eligibility.cgpa > 0) tips.push(`CGPA is below cutoff (${drive.eligibility.cgpa}). Improve in remaining semesters.`);
    if (profile.codingProblems < 50) tips.push('Solve 30+ more coding problems — focus on ' + drive.company + '-tagged questions.');
    if (profile.aptitudePercentile < 70) tips.push(`Improve aptitude to 70th+ percentile (current: ${profile.aptitudePercentile}). Take 5 timed tests.`);
    if (profile.techMcqScore < 70) tips.push(`Technical MCQ score (${profile.techMcqScore}%) needs improvement. Revise OS, DBMS, CN basics.`);
    if (drive.company === 'TCS') tips.push('Take 2 TCS NQT mock tests before the drive.');
    if (drive.company === 'Amazon' || drive.company === 'Flipkart') tips.push('Focus on Medium/Hard DSA problems — especially Arrays, Trees, and DP.');
    if (tips.length === 0) tips.push('You\'re well-prepared! Review your weak topics and do a final mock.');
    return tips;
}

function daysUntil(dateStr: string) {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function CampusCalendarPage() {
    const [filter, setFilter] = useState<'all' | 'my-college' | 'off-campus' | 'pan-india'>('all');
    const [selectedDrive, setSelectedDrive] = useState<CampusDrive | null>(null);
    const [view, setView] = useState<'calendar' | 'readiness'>('calendar');

    
    const drives = useMemo(() => {
        const d = CAMPUS_DRIVES.map(dr => ({ ...dr, readiness: calculateReadiness(dr, USER_PROFILE) }));
        if (filter === 'all') return d;
        return d.filter(dr => dr.type === filter);
    }, [filter]);

    const upcomingDrives = drives.filter(d => d.status === 'upcoming').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const completedDrives = drives.filter(d => d.status === 'completed');

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <main className="flex-1 pb-24 md:pb-8">
                {/* Hero */}
                <div className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white px-6 py-8">
                    <h1 className="text-2xl font-bold mb-2 st-font-heading">📅 Campus Drive Calendar</h1>
                    <p className="text-white/80 text-sm mb-4">See all upcoming drives + check if you&apos;re ready</p>
                    <div className="flex gap-2 flex-wrap">
                        {(['all', 'my-college', 'off-campus', 'pan-india'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-white text-teal-700' : 'bg-white/15 text-white hover:bg-white/25'}`}>
                                {f === 'all' ? '📋 All Drives' : f === 'my-college' ? '🏫 My College' : f === 'off-campus' ? '🌐 Off Campus' : '🇮🇳 Pan India'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Upcoming Drives', value: upcomingDrives.length, icon: '📅', color: 'from-indigo-500 to-violet-600' },
                            { label: 'Eligible For', value: upcomingDrives.filter(d => d.readiness && d.readiness >= 50).length, icon: '✅', color: 'from-emerald-500 to-green-600' },
                            { label: 'Ready (80%+)', value: upcomingDrives.filter(d => d.readiness && d.readiness >= 80).length, icon: '🎯', color: 'from-amber-500 to-orange-600' },
                        ].map(s => (
                            <div key={s.label} className="st-card p-4 text-center">
                                <div className={`w-10 h-10 mx-auto bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-lg mb-2 text-white`}>{s.icon}</div>
                                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                                <p className="text-[10px] text-slate-400">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Upcoming Drives */}
                    <div>
                        <h2 className="st-section-title">📆 Upcoming Drives</h2>
                        <div className="space-y-3">
                            {upcomingDrives.map((drive, i) => {
                                const days = daysUntil(drive.date);
                                const eligible = drive.eligibility.branches.includes(USER_PROFILE.branch) &&
                                    (drive.eligibility.cgpa === 0 || USER_PROFILE.cgpa >= drive.eligibility.cgpa) &&
                                    drive.eligibility.yearOfPassing.includes(USER_PROFILE.year);

                                return (
                                    <motion.div key={drive.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                                        <button onClick={() => setSelectedDrive(drive)} className="w-full text-left st-card p-5 hover:shadow-lg transition-all group">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">{drive.icon}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{drive.company}</h3>
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${drive.type === 'my-college' ? 'bg-indigo-50 text-indigo-600' : drive.type === 'off-campus' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                            {drive.type === 'my-college' ? '🏫 Campus' : drive.type === 'off-campus' ? '🌐 Off-Campus' : '🇮🇳 Pan India'}
                                                        </span>
                                                        {eligible ? (
                                                            <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold">✓ Eligible</span>
                                                        ) : (
                                                            <span className="text-[9px] px-1.5 py-0.5 bg-red-50 text-red-500 rounded-full font-bold">✗ Not Eligible</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500">{drive.role} · {drive.lpa}</p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <span className="text-[10px] text-slate-400">📅 {new Date(drive.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                        <span className={`text-[10px] font-bold ${days <= 7 ? 'text-red-500' : days <= 14 ? 'text-amber-500' : 'text-slate-400'}`}>
                                                            ⏳ {days} days left
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Readiness Gauge */}
                                                <div className="flex-shrink-0 text-center">
                                                    <div className="relative w-14 h-14">
                                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                                                            <circle cx="24" cy="24" r="20" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                                                            <circle cx="24" cy="24" r="20" fill="none"
                                                                stroke={drive.readiness! >= 80 ? '#10B981' : drive.readiness! >= 60 ? '#F59E0B' : '#EF4444'}
                                                                strokeWidth="4" strokeLinecap="round"
                                                                strokeDasharray={`${(drive.readiness! / 100) * 125.6} ${125.6 - (drive.readiness! / 100) * 125.6}`} />
                                                        </svg>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                            <span className="text-xs font-bold text-slate-900">{drive.readiness}%</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-[9px] text-slate-400 mt-0.5">Readiness</p>
                                                </div>
                                            </div>
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Completed Drives */}
                    {completedDrives.length > 0 && (
                        <div>
                            <h2 className="st-section-title">✅ Completed Drives</h2>
                            <div className="space-y-2">
                                {completedDrives.map(drive => (
                                    <div key={drive.id} className="st-card p-4 opacity-60">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{drive.icon}</span>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-slate-900">{drive.company} — {drive.role}</p>
                                                <p className="text-[10px] text-slate-400">{drive.lpa} · {new Date(drive.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                            </div>
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Completed</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ═══ DRIVE DETAIL + READINESS MODAL ═══ */}
                <AnimatePresence>
                    {selectedDrive && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
                            onClick={(e) => { if (e.target === e.currentTarget) setSelectedDrive(null); }}>
                            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{selectedDrive.icon}</span>
                                        <div>
                                            <h2 className="font-bold text-slate-900">{selectedDrive.company}</h2>
                                            <p className="text-xs text-slate-500">{selectedDrive.role} · {selectedDrive.lpa}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedDrive(null)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
                                </div>

                                <div className="px-6 py-5 space-y-5">
                                    {/* Readiness Calculator */}
                                    <div className={`rounded-2xl p-5 ${selectedDrive.readiness! >= 80 ? 'bg-emerald-50 border border-emerald-200' : selectedDrive.readiness! >= 60 ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-20 h-20">
                                                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                                                    <circle cx="40" cy="40" r="32" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                                                    <circle cx="40" cy="40" r="32" fill="none"
                                                        stroke={selectedDrive.readiness! >= 80 ? '#10B981' : selectedDrive.readiness! >= 60 ? '#F59E0B' : '#EF4444'}
                                                        strokeWidth="6" strokeLinecap="round"
                                                        strokeDasharray={`${(selectedDrive.readiness! / 100) * 201} ${201 - (selectedDrive.readiness! / 100) * 201}`} />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-xl font-bold text-slate-900">{selectedDrive.readiness}%</span>
                                                    <span className="text-[9px] text-slate-500">Ready</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-900 mb-1">Your Readiness for {selectedDrive.company}</p>
                                                <p className="text-xs text-slate-600">
                                                    {selectedDrive.readiness! >= 80 ? '🎯 You\'re well-prepared! Polish final details.' :
                                                        selectedDrive.readiness! >= 60 ? '⚠️ Getting there. Some gaps to fix.' :
                                                            '❌ Significant preparation needed.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Readiness Breakdown */}
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">📊 Readiness Breakdown</h3>
                                        <div className="space-y-2">
                                            {[
                                                { label: 'CGPA', required: selectedDrive.eligibility.cgpa === 0 ? 'No cutoff' : `${selectedDrive.eligibility.cgpa}+`, yours: `${USER_PROFILE.cgpa}`, pass: selectedDrive.eligibility.cgpa === 0 || USER_PROFILE.cgpa >= selectedDrive.eligibility.cgpa },
                                                { label: 'Branch Eligibility', required: selectedDrive.eligibility.branches.join(', '), yours: USER_PROFILE.branch, pass: selectedDrive.eligibility.branches.includes(USER_PROFILE.branch) },
                                                { label: 'Coding (Problems)', required: selectedDrive.company === 'Amazon' || selectedDrive.company === 'Flipkart' ? '150+ (M/H focus)' : '50+', yours: `${USER_PROFILE.codingProblems} solved`, pass: USER_PROFILE.codingProblems >= 50 },
                                                { label: 'Aptitude', required: '65th+ %ile', yours: `${USER_PROFILE.aptitudePercentile}th %ile`, pass: USER_PROFILE.aptitudePercentile >= 65 },
                                                { label: 'Technical MCQ', required: '70%+', yours: `${USER_PROFILE.techMcqScore}%`, pass: USER_PROFILE.techMcqScore >= 70 },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${item.pass ? 'bg-emerald-500' : 'bg-red-400'}`}>
                                                        {item.pass ? '✓' : '✗'}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-slate-900">{item.label}</p>
                                                        <p className="text-[10px] text-slate-400">Required: {item.required} · Yours: {item.yours}</p>
                                                    </div>
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.pass ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                                        {item.pass ? 'CLEARED' : 'GAP'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Improvement Tips */}
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">💡 To Improve Readiness</h3>
                                        <div className="space-y-2">
                                            {getImprovementTips(selectedDrive.readiness!, selectedDrive, USER_PROFILE).map((tip, i) => (
                                                <div key={i} className="flex items-start gap-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                                    <span className="text-xs text-indigo-500 mt-0.5 flex-shrink-0">→</span>
                                                    <p className="text-xs text-indigo-700">{tip}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interview Process */}
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">🔄 Selection Process</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedDrive.process.map((step, i) => (
                                                <div key={i} className="flex items-center gap-1.5">
                                                    <span className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium">{step}</span>
                                                    {i < selectedDrive.process.length - 1 && <span className="text-slate-300 text-xs">→</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Registration + Action */}
                                    <div className="bg-slate-900 rounded-2xl p-5 text-white">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="text-[10px] text-slate-400">Registration Deadline</p>
                                                <p className="text-sm font-bold">{new Date(selectedDrive.registrationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${daysUntil(selectedDrive.registrationDeadline) <= 3 ? 'bg-red-500' : 'bg-emerald-500'}`}>
                                                {daysUntil(selectedDrive.registrationDeadline)} days left
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/study-plans`} className="flex-1 text-center bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold py-3 rounded-xl transition-colors">
                                                🎯 Prepare for {selectedDrive.company}
                                            </Link>
                                            <Link href={`/company/${selectedDrive.company.toLowerCase()}`} className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 rounded-xl transition-colors">
                                                📄 Company Page
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <BottomNav />
        </div>
    );
}
