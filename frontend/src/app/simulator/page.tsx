'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function SimulatorPage() {
    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const scenarios = [
        { id: 'technical', icon: '💻', title: 'Technical Interview', desc: 'Practice DSA and system design with AI interviewer', difficulty: 'Medium', duration: '30 min', company: 'Google-style' },
        { id: 'behavioral', icon: '🗣️', title: 'Behavioral Interview', desc: 'STAR method practice with AI feedback', difficulty: 'Easy', duration: '20 min', company: 'Amazon-style' },
        { id: 'system-design', icon: '🏗️', title: 'System Design', desc: 'Design systems like Twitter, Uber, etc.', difficulty: 'Hard', duration: '45 min', company: 'Meta-style' },
        { id: 'hr', icon: '👔', title: 'HR Round', desc: 'Salary negotiation, culture fit, career goals', difficulty: 'Easy', duration: '15 min', company: 'Any company' },
        { id: 'case-study', icon: '📊', title: 'Case Study', desc: 'Business analysis and product thinking', difficulty: 'Medium', duration: '35 min', company: 'McKinsey-style' },
        { id: 'coding-live', icon: '⚡', title: 'Live Coding', desc: 'Debug and optimize code under time pressure', difficulty: 'Hard', duration: '25 min', company: 'Startup-style' },
    ];

    const diffColor = (d: string) => {
        if (d === 'Easy') return 'bg-green-50 text-green-700 border-green-200';
        if (d === 'Medium') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        return 'bg-red-50 text-red-700 border-red-200';
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-gradient-to-br from-violet-600 to-purple-700 text-white px-6 py-8">
                        <h1 className="text-2xl font-bold mb-2">🎭 Interview Simulator</h1>
                        <p className="text-white/80 text-sm">Practice with AI that mimics real Indian company interviews</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-4">
                            {scenarios.map((s, i) => (
                                <motion.div key={s.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="st-card p-6 hover:shadow-xl group cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-3xl">{s.icon}</span>
                                        <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${diffColor(s.difficulty)}`}>
                                            {s.difficulty}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{s.title}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{s.desc}</p>
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>⏱️ {s.duration}</span>
                                        <span>{s.company}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
