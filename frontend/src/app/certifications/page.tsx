'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

interface Certification {
    id: string;
    name: string;
    icon: string;
    description: string;
    duration: string;
    format: string;
    level: 'Basic' | 'Intermediate' | 'Advanced';
    validity: string;
    topics: string[];
    status: 'available' | 'in-progress' | 'earned';
    score?: number;
    earnedDate?: string;
    color: string;
}

const CERTIFICATIONS: Certification[] = [
    {
        id: 'python', name: 'Python Developer', icon: '🐍', description: 'Prove your Python programming expertise across fundamentals, OOP, and data structures',
        duration: '60 min', format: '3 Coding + 10 MCQ', level: 'Intermediate', validity: '1 year',
        topics: ['Syntax & Basics', 'OOP', 'Data Structures', 'File I/O', 'Libraries'],
        status: 'earned', score: 87, earnedDate: 'Jan 2026', color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'java', name: 'Java Developer', icon: '☕', description: 'Validate Java proficiency including collections, multithreading, and design patterns',
        duration: '60 min', format: '3 Coding + 10 MCQ', level: 'Intermediate', validity: '1 year',
        topics: ['Core Java', 'Collections', 'Multithreading', 'JDBC', 'Design Patterns'],
        status: 'available', color: 'from-orange-500 to-red-500'
    },
    {
        id: 'sql', name: 'SQL Mastery', icon: '🗃️', description: 'Master SQL from basic queries to joins, subqueries, window functions, and optimization',
        duration: '45 min', format: '5 Query Writing + 10 MCQ', level: 'Intermediate', validity: '1 year',
        topics: ['SELECT & Joins', 'Aggregations', 'Subqueries', 'Window Functions', 'Optimization'],
        status: 'in-progress', score: 45, color: 'from-emerald-500 to-teal-500'
    },
    {
        id: 'dsa', name: 'Problem Solving (DSA)', icon: '🧩', description: 'Demonstrate algorithmic thinking on arrays, trees, graphs, and dynamic programming',
        duration: '90 min', format: '4 Coding Problems', level: 'Advanced', validity: '1 year',
        topics: ['Arrays & Strings', 'Trees & Graphs', 'Dynamic Programming', 'Greedy'],
        status: 'available', color: 'from-violet-500 to-purple-600'
    },
    {
        id: 'aptitude', name: 'Aptitude Certification', icon: '🧠', description: 'Placement-ready aptitude across quantitative, logical, and verbal ability',
        duration: '60 min', format: '30 MCQ (Quant + LR + VA)', level: 'Intermediate', validity: '6 months',
        topics: ['Quantitative', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'],
        status: 'available', color: 'from-amber-500 to-orange-500'
    },
    {
        id: 'fullstack', name: 'Full Stack Readiness', icon: '🌐', description: 'End-to-end web development skills: HTML, CSS, JS, React, Node.js, SQL combined',
        duration: '90 min', format: '2 Coding + 1 Build + 15 MCQ', level: 'Advanced', validity: '1 year',
        topics: ['HTML/CSS', 'JavaScript', 'React', 'Node.js/Express', 'SQL', 'REST APIs'],
        status: 'available', color: 'from-pink-500 to-rose-500'
    },
    {
        id: 'datascience', name: 'Data Science Foundations', icon: '📊', description: 'Statistics, Python data libraries, ML basics, and data visualization',
        duration: '75 min', format: '2 Coding + 15 MCQ', level: 'Intermediate', validity: '1 year',
        topics: ['Statistics', 'Pandas/NumPy', 'Matplotlib', 'ML Basics', 'Feature Engineering'],
        status: 'available', color: 'from-indigo-500 to-blue-600'
    },
];

export default function CertificationsPage() {
    const [certs, setCerts] = useState<Certification[]>(CERTIFICATIONS);
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
    const [filter, setFilter] = useState<'all' | 'earned' | 'available'>('all');

    useEffect(() => {
    }, []);

    const filtered = certs.filter(c => filter === 'all' || (filter === 'earned' ? c.status === 'earned' : c.status !== 'earned'));
    const earnedCount = certs.filter(c => c.status === 'earned').length;

    const levelColor = (l: string) => l === 'Basic' ? 'bg-emerald-50 text-emerald-600' : l === 'Intermediate' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600';
    const statusBadge = (s: string) => s === 'earned' ? { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: '✓ Earned' } :
        s === 'in-progress' ? { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: '⏳ In Progress' } :
            { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600', label: 'Available' };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="max-w-4xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🏅 CERTIFICATIONS</span>
                                <h1 className="text-3xl font-bold mb-2 st-font-heading">Mentixy Certifications</h1>
                                <p className="text-white/60 text-sm mb-4">Industry-recognized skill certifications with proctored assessments and shareable credentials</p>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                                        <p className="text-xl font-bold">{earnedCount}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Earned</p>
                                    </div>
                                    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                                        <p className="text-xl font-bold">{certs.length}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Available</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
                        {/* Filters */}
                        <div className="flex gap-2 mb-5">
                            {[
                                { key: 'all' as const, label: 'All Certifications', count: certs.length },
                                { key: 'earned' as const, label: '✓ Earned', count: earnedCount },
                                { key: 'available' as const, label: 'Available', count: certs.length - earnedCount },
                            ].map(f => (
                                <button key={f.key} onClick={() => setFilter(f.key)}
                                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${filter === f.key
                                        ? 'bg-violet-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200'
                                        }`}>{f.label}
                                    <span className={`text-[10px] px-1 py-0.5 rounded ${filter === f.key ? 'bg-white/20' : 'bg-slate-100'}`}>{f.count}</span>
                                </button>
                            ))}
                        </div>

                        {/* Cert Cards */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {filtered.map((cert, i) => {
                                const sb = statusBadge(cert.status);
                                return (
                                    <motion.div key={cert.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="st-card overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                                        onClick={() => setSelectedCert(cert)}
                                    >
                                        <div className={`h-2 bg-gradient-to-r ${cert.color}`} />
                                        <div className="p-5">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className={`w-12 h-12 bg-gradient-to-br ${cert.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg`}>
                                                    {cert.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-violet-600 transition-colors">{cert.name}</h3>
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${levelColor(cert.level)}`}>{cert.level}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{cert.duration} · {cert.format}</p>
                                                </div>
                                            </div>

                                            <p className="text-xs text-slate-500 leading-relaxed mb-3">{cert.description}</p>

                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {cert.topics.slice(0, 4).map(t => (
                                                    <span key={t} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{t}</span>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10px] px-2 py-1 rounded-md font-semibold border ${sb.bg} ${sb.text}`}>{sb.label}</span>
                                                {cert.score && cert.status === 'earned' && (
                                                    <span className="text-sm font-bold text-emerald-600">{cert.score}%</span>
                                                )}
                                                <span className="text-[10px] text-slate-400">Valid: {cert.validity}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Detail Modal */}
                        <AnimatePresence>
                            {selectedCert && (
                                <>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setSelectedCert(null)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                                        className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-[10%] md:top-[15%] max-w-lg w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[80vh] overflow-y-auto"
                                    >
                                        <div className={`h-3 bg-gradient-to-r ${selectedCert.color}`} />
                                        <div className="p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`w-14 h-14 bg-gradient-to-br ${selectedCert.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                                                    {selectedCert.icon}
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-slate-900">{selectedCert.name}</h2>
                                                    <p className="text-xs text-slate-500">{selectedCert.level} · {selectedCert.duration}</p>
                                                </div>
                                            </div>

                                            <p className="text-sm text-slate-600 leading-relaxed mb-4">{selectedCert.description}</p>

                                            <div className="space-y-3 mb-4">
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1.5">📋 Test Format</p>
                                                    <p className="text-sm text-slate-700 font-medium">{selectedCert.format}</p>
                                                    <p className="text-xs text-slate-500 mt-1">Duration: {selectedCert.duration} · Validity: {selectedCert.validity}</p>
                                                </div>

                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1.5">📚 Topics Covered</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {selectedCert.topics.map(t => (
                                                            <span key={t} className="text-xs bg-white text-slate-600 px-2 py-1 rounded-md border border-slate-100">{t}</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1.5">🔒 Proctoring</p>
                                                    <ul className="text-xs text-slate-600 space-y-1">
                                                        <li>• Tab-switch detection (3 warnings → disqualification)</li>
                                                        <li>• Randomized question pool (unique test every time)</li>
                                                        <li>• 30-day cooldown between attempts</li>
                                                        <li>• Results sealed for 2 hours</li>
                                                    </ul>
                                                </div>

                                                <div className="bg-violet-50 rounded-xl p-3">
                                                    <p className="text-[10px] text-violet-600 uppercase font-bold mb-1.5">🎁 What You Get</p>
                                                    <ul className="text-xs text-violet-700 space-y-1">
                                                        <li>• Certificate PDF with QR code verification</li>
                                                        <li>• Badge on your Mentixy profile</li>
                                                        <li>• Shareable URL for LinkedIn & resume</li>
                                                        <li>• Recruiter visibility boost</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                {selectedCert.status === 'earned' ? (
                                                    <>
                                                        <button className="flex-1 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl">📄 View Certificate</button>
                                                        <button className="px-4 py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl">🔗 Share</button>
                                                    </>
                                                ) : (
                                                    <button className="flex-1 py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
                                                        {selectedCert.status === 'in-progress' ? 'Continue Test →' : 'Start Certification →'}
                                                    </button>
                                                )}
                                                <button onClick={() => setSelectedCert(null)} className="px-4 py-3 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl">✕</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        {/* How It Works */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            className="mt-8 st-card p-6">
                            <h3 className="font-bold text-slate-900 mb-4">🎯 How Mentixy Certifications Work</h3>
                            <div className="grid md:grid-cols-4 gap-4 text-center">
                                {[
                                    { step: '1', title: 'Choose', desc: 'Select a certification matching your career goals', icon: '🎯' },
                                    { step: '2', title: 'Prepare', desc: 'Practice with topic-specific problems and quizzes', icon: '📚' },
                                    { step: '3', title: 'Test', desc: 'Take the proctored assessment within time limit', icon: '⏱️' },
                                    { step: '4', title: 'Earn', desc: 'Score 70%+ to earn your verified credential', icon: '🏅' },
                                ].map(s => (
                                    <div key={s.step} className="bg-slate-50 rounded-xl p-4">
                                        <span className="text-2xl block mb-2">{s.icon}</span>
                                        <p className="text-xs text-violet-600 font-bold uppercase mb-1">Step {s.step}</p>
                                        <p className="font-semibold text-sm text-slate-900 mb-1">{s.title}</p>
                                        <p className="text-[10px] text-slate-500">{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
