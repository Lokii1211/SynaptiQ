'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function CommunityPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'feed' | 'discussions' | 'success'>('feed');

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        api.getCommunityPosts().then(data => {
            setPosts(data.posts || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">💬 Community</h1>
                        <p className="text-slate-500 text-sm">Share experiences, ask questions, celebrate wins</p>
                        <div className="flex gap-2 mt-4">
                            {(['feed', 'discussions', 'success'] as const).map(t => (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                                        }`}
                                >{t === 'success' ? '🎉 Success Stories' : t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-4">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="st-card p-5 animate-pulse h-28" />)
                        ) : posts.length === 0 ? (
                            <div className="text-center py-16 st-card">
                                <span className="text-5xl block mb-4">💬</span>
                                <p className="text-slate-500 text-lg">Community is launching soon!</p>
                                <p className="text-slate-400 text-sm mt-1">Be the first to share your career journey</p>
                            </div>
                        ) : (
                            posts.map((post: any, i: number) => (
                                <motion.div key={post.id || i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="st-card p-5"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {(post.author_name || '?')[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{post.author_name}</p>
                                            <p className="text-xs text-slate-400">{post.created_at}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-700">{post.content}</p>
                                    {post.tags && (
                                        <div className="flex gap-1.5 mt-3">
                                            {post.tags.map((tag: string) => (
                                                <span key={tag} className="text-[11px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
