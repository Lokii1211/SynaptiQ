'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function LearnPage() {
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
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-6 py-8">
                        <h1 className="text-2xl font-bold mb-2">📚 Learning Hub</h1>
                        <p className="text-white/80 text-sm">AI-powered learning roadmaps personalized for your career goals</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-6">
                        {/* Generate roadmap */}
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
                                    className="st-btn-primary whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
                                >
                                    {generating ? (
                                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
                                    ) : '✨ Generate'}
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Hours/week you can dedicate to learning</p>
                        </section>

                        {/* Existing roadmaps */}
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
                                        <motion.div key={rm.id || i}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                            className="st-card p-5 hover:shadow-lg cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-slate-900">{rm.title || rm.target_career}</h3>
                                                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium">
                                                    {rm.progress || 0}%
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500">{rm.description || `Roadmap for ${rm.target_career}`}</p>
                                            {rm.duration && <p className="text-xs text-slate-400 mt-2">⏱️ {rm.duration}</p>}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
