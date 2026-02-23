'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function First90DaysPage() {
    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const phases = [
        {
            phase: 'Week 1-2: Foundation',
            icon: '🌱',
            color: 'from-emerald-500 to-teal-500',
            tasks: [
                'Set up your development environment',
                'Learn your team\'s tech stack basics',
                'Shadow senior engineers in code reviews',
                'Understand the codebase architecture',
                'Schedule 1-on-1s with all team members',
            ],
        },
        {
            phase: 'Week 3-4: First Contributions',
            icon: '🔧',
            color: 'from-blue-500 to-cyan-500',
            tasks: [
                'Fix your first bug (start small)',
                'Write your first unit test',
                'Ask questions in daily standups',
                'Document something that was unclear to you',
                'Get your first PR merged',
            ],
        },
        {
            phase: 'Month 2: Building Confidence',
            icon: '🚀',
            color: 'from-violet-500 to-purple-500',
            tasks: [
                'Own a small feature end-to-end',
                'Present in a team meeting',
                'Contribute to sprint planning',
                'Start writing design docs',
                'Mentor the next new joiner',
            ],
        },
        {
            phase: 'Month 3: Making Impact',
            icon: '⭐',
            color: 'from-amber-500 to-orange-500',
            tasks: [
                'Lead a feature from design to deploy',
                'Share a tech talk or brown bag session',
                'Propose a process improvement',
                'Build relationships across teams',
                'Set 6-month growth goals with your manager',
            ],
        },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white px-6 py-8">
                        <h1 className="text-2xl font-bold mb-2">📅 First 90 Days Plan</h1>
                        <p className="text-white/80 text-sm">Your survival guide for the first job — what to do week by week</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-6">
                        {phases.map((phase, pi) => (
                            <motion.section key={phase.phase}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: pi * 0.15 }}
                                className="st-card overflow-hidden"
                            >
                                <div className={`bg-gradient-to-r ${phase.color} px-5 py-3 text-white`}>
                                    <span className="text-lg mr-2">{phase.icon}</span>
                                    <span className="font-bold text-sm">{phase.phase}</span>
                                </div>
                                <div className="p-5 space-y-2">
                                    {phase.tasks.map((task, i) => (
                                        <div key={i} className="flex items-start gap-3 group">
                                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5 group-hover:border-indigo-500 transition-colors cursor-pointer" />
                                            <p className="text-sm text-slate-700">{task}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        ))}

                        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 text-center">
                            <p className="text-sm text-slate-700">
                                💡 <strong>Pro tip:</strong> The #1 thing that separates successful freshers from struggling ones is
                                <strong> asking questions early</strong>. Nobody expects you to know everything.
                            </p>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
