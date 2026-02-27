'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';

export default function CoursesPage() {
    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const courses = [
        { id: 1, title: 'DSA for Placements', provider: 'SkillTen', duration: '8 weeks', level: 'Beginner', icon: '💻', free: true, students: '12K+', rating: 4.8, tags: ['Arrays', 'Trees', 'DP'] },
        { id: 2, title: 'System Design Basics', provider: 'SkillTen', duration: '6 weeks', level: 'Intermediate', icon: '🏗️', free: true, students: '5K+', rating: 4.7, tags: ['Scalability', 'Databases'] },
        { id: 3, title: 'Machine Learning A-Z', provider: 'YouTube Curated', duration: '10 weeks', level: 'Beginner', icon: '🤖', free: true, students: '8K+', rating: 4.6, tags: ['Python', 'NumPy', 'Sklearn'] },
        { id: 4, title: 'Web Dev Bootcamp', provider: 'Free Resources', duration: '12 weeks', level: 'Beginner', icon: '🌐', free: true, students: '15K+', rating: 4.9, tags: ['React', 'Node.js', 'CSS'] },
        { id: 5, title: 'GATE CS Preparation', provider: 'Community', duration: '16 weeks', level: 'Advanced', icon: '📚', free: true, students: '3K+', rating: 4.5, tags: ['OS', 'DBMS', 'Networks'] },
        { id: 6, title: 'Aptitude & Reasoning', provider: 'SkillTen', duration: '4 weeks', level: 'Beginner', icon: '🧠', free: true, students: '20K+', rating: 4.4, tags: ['Quant', 'Verbal', 'Logic'] },
    ];

    const levelColor = (l: string) => {
        if (l === 'Beginner') return 'bg-green-50 text-green-700 border-green-200';
        if (l === 'Intermediate') return 'bg-amber-50 text-amber-700 border-amber-200';
        return 'bg-red-50 text-red-700 border-red-200';
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">📚 Free Courses</h1>
                        <p className="text-slate-500 text-sm">Curated free resources — no paid courses, no affiliate BS</p>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {courses.map((course, i) => (
                                <motion.div key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="st-card p-5 hover:shadow-xl group cursor-pointer h-full flex flex-col"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-3xl">{course.icon}</span>
                                        <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${levelColor(course.level)}`}>
                                            {course.level}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                                    <p className="text-xs text-slate-500 mb-3">{course.provider} • {course.duration}</p>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {course.tags.map(tag => (
                                            <span key={tag} className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="mt-auto flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                                        <span>⭐ {course.rating} • {course.students}</span>
                                        <span className="text-green-600 font-bold">🆓 FREE</span>
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
