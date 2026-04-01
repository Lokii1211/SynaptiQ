'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

interface Milestone {
    id: string;
    skill: string;
    resource: string;
    is_free: boolean;
    hours: number;
    project: string;
    status: 'complete' | 'in_progress' | 'upcoming' | 'missed';
}

interface Phase {
    phase_number: number;
    title: string;
    duration_weeks: number;
    milestones: Milestone[];
}

interface Roadmap {
    target_career: string;
    total_months: number;
    current_phase: number;
    phases: Phase[];
    generated_at: string;
    last_rerouted_at?: string;
}


export default function RoadmapPage() {
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const data = await api.getMyRoadmaps();
                setRoadmap(data?.[0] || null);
            } catch {
                setRoadmap(null);
            } finally {
                setLoading(false);
            }
        };
        if (auth.isLoggedIn()) fetchRoadmap();
        else { setRoadmap(null); setLoading(false); }
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );

    if (!roadmap) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <TopBar />
                <main className="md:ml-56 pb-24 md:pb-8">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
                        <span className="text-5xl block mb-4">🗺️</span>
                        <h2 className="text-2xl font-bold text-white mb-2">No Roadmap Yet</h2>
                        <p className="text-slate-400 text-sm mb-6 text-center max-w-md">Take the career assessment to get an AI-generated personalized roadmap tailored to your goals.</p>
                        <Link href="/assessment" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">Take Assessment →</Link>
                    </div>
                </main>
                <BottomNav />
            </div>
        );
    }

    const r = roadmap;
    const totalMilestones = r.phases.reduce((acc, p) => acc + p.milestones.length, 0);
    const completedMilestones = r.phases.reduce((acc, p) => acc + p.milestones.filter(m => m.status === 'complete').length, 0);
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    const statusIcon = (s: string) => s === 'complete' ? '✅' : s === 'in_progress' ? '🔵' : s === 'missed' ? '❌' : '⬜';
    const statusColor = (s: string) => s === 'complete' ? 'border-green-500/50 bg-green-500/5' : s === 'in_progress' ? 'border-indigo-500/50 bg-indigo-500/10' : s === 'missed' ? 'border-red-500/50 bg-red-500/5' : 'border-slate-700 bg-slate-800/30';

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <TopBar />
            <main className="md:ml-56 pb-24 md:pb-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-8">
                    <div className="max-w-3xl mx-auto">
                        <p className="text-indigo-200 text-sm uppercase tracking-wider mb-1">Your Roadmap</p>
                        <h1 className="text-3xl font-bold">{r.target_career}</h1>
                        <p className="text-white/60 text-sm mt-1">{r.total_months} months total · Phase {r.current_phase} of {r.phases.length}</p>
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-indigo-200">Overall Progress</span>
                                <span className="text-white font-bold">{progress}%</span>
                            </div>
                            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.5 }} className="h-full bg-white rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                    {r.phases.map((phase, pi) => (
                        <motion.div key={phase.phase_number}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: pi * 0.1 }}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${phase.phase_number < r.current_phase ? 'bg-green-500 text-white' :
                                        phase.phase_number === r.current_phase ? 'bg-indigo-500 text-white' :
                                            'bg-slate-700 text-slate-400'
                                    }`}>
                                    {phase.phase_number < r.current_phase ? '✓' : phase.phase_number}
                                </span>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Phase {phase.phase_number}: {phase.title}</h2>
                                    <p className="text-xs text-slate-500">{phase.duration_weeks} weeks</p>
                                </div>
                            </div>

                            <div className="space-y-3 ml-5 border-l-2 border-slate-700 pl-6">
                                {phase.milestones.map(m => (
                                    <div key={m.id} className={`rounded-xl border p-4 ${statusColor(m.status)}`}>
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">{statusIcon(m.status)}</span>
                                            <div className="flex-1">
                                                <p className="font-medium text-white text-sm">{m.skill}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{m.resource} · {m.hours}h</p>
                                                <p className="text-xs text-indigo-300 mt-1">📦 Project: {m.project}</p>
                                            </div>
                                            {m.is_free && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">Free</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {/* Reroute CTA */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-center">
                        <p className="text-amber-300 text-sm mb-2">Falling behind or life happened?</p>
                        <Link href="/learn" className="inline-block bg-amber-500 text-white px-6 py-2 rounded-lg text-sm font-semibold">
                            🔄 Reroute My Roadmap
                        </Link>
                    </div>
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
