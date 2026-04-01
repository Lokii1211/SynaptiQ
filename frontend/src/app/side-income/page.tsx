'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function SideIncomePage() {
    useEffect(() => {
    }, []);

    const stacks = [
        {
            tier: 'BEGINNER',
            color: 'from-green-500 to-emerald-600',
            earning: '₹5K-20K/month',
            gigs: [
                { title: 'Freelance Web Development', platform: 'Fiverr / Upwork', icon: '🌐', earning: '₹500-2000/project', skills: ['HTML', 'CSS', 'React'] },
                { title: 'Content Writing (Tech)', platform: 'Medium / Hashnode', icon: '✍️', earning: '₹3-10/word', skills: ['Writing', 'SEO'] },
                { title: 'YouTube Tutorials', platform: 'YouTube', icon: '🎥', earning: 'Ad revenue + course sales', skills: ['Teaching', 'Video Editing'] },
                { title: 'Data Entry / VA', platform: 'Internshala / LinkedIn', icon: '📋', earning: '₹8-15K/month', skills: ['Excel', 'Basic Computer'] },
            ]
        },
        {
            tier: 'INTERMEDIATE',
            color: 'from-blue-500 to-indigo-600',
            earning: '₹20K-80K/month',
            gigs: [
                { title: 'API Development', platform: 'Toptal / Upwork', icon: '⚙️', earning: '₹2K-5K/project', skills: ['Python', 'Node.js', 'REST'] },
                { title: 'UI/UX Design Freelance', platform: 'Dribbble / 99designs', icon: '🎨', earning: '₹5K-15K/project', skills: ['Figma', 'Design Systems'] },
                { title: 'Technical Blogging', platform: 'Dev.to / Company blogs', icon: '📝', earning: '₹2K-10K/post', skills: ['Deep Tech', 'Writing'] },
                { title: 'Online Tutoring', platform: 'Unacademy / Vedantu', icon: '🎓', earning: '₹30-50K/month', skills: ['DSA', 'Teaching'] },
            ]
        },
        {
            tier: 'ADVANCED',
            color: 'from-purple-500 to-violet-600',
            earning: '₹80K-3L+/month',
            gigs: [
                { title: 'SaaS Side Project', platform: 'Self-hosted', icon: '🚀', earning: '₹50K-5L+/month', skills: ['Full Stack', 'Marketing'] },
                { title: 'Open Source Consulting', platform: 'GitHub Sponsors', icon: '🔧', earning: 'Variable', skills: ['Deep expertise', 'Community'] },
                { title: 'Technical Course Creation', platform: 'Udemy / Teachable', icon: '📚', earning: '₹1-10L+/course', skills: ['Expert Knowledge', 'Video'] },
                { title: 'Contract Development', platform: 'Toptal / ARC', icon: '💼', earning: '₹2-5L/month', skills: ['Senior skills', 'System Design'] },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-6 py-8">
                        <h1 className="text-2xl font-bold mb-2">💸 Side Income Stack</h1>
                        <p className="text-white/80 text-sm">India-specific ways to earn while you study or work — from ₹5K to ₹3L+/month</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto space-y-8">
                        {stacks.map((stack, si) => (
                            <motion.section key={stack.tier}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: si * 0.15 }}
                            >
                                <div className={`bg-gradient-to-r ${stack.color} rounded-t-2xl px-5 py-3 flex items-center justify-between`}>
                                    <span className="text-white font-bold text-sm">{stack.tier}</span>
                                    <span className="text-white/80 text-xs">{stack.earning}</span>
                                </div>
                                <div className="bg-white rounded-b-2xl border border-t-0 border-slate-100 divide-y divide-slate-100">
                                    {stack.gigs.map((gig, gi) => (
                                        <motion.div key={gi}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: si * 0.15 + gi * 0.08 }}
                                            className="p-4 hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl mt-0.5">{gig.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-slate-900 text-sm mb-0.5">{gig.title}</h4>
                                                    <p className="text-xs text-slate-500 mb-2">{gig.platform} • {gig.earning}</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {gig.skills.map(s => (
                                                            <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        ))}

                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-center">
                            <p className="text-sm text-slate-700 mb-3">
                                <strong>🎯 Pro tip:</strong> Start at Beginner. The goal isn&apos;t to replace your job —
                                it&apos;s to build skills that make you <em>more</em> valuable at your main career.
                            </p>
                            <Link href="/skills" className="st-btn-primary text-sm py-2 px-5 inline-block">
                                Analyze Your Skills →
                            </Link>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
