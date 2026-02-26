'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';
import Link from 'next/link';

interface Post {
    id: string;
    author: { name: string; avatar: string; college: string; badge?: string };
    content: string;
    tags: string[];
    likes: number;
    replies: number;
    time: string;
    liked: boolean;
}

const MOCK_POSTS: Post[] = [
    {
        id: '1', author: { name: 'Priya S.', avatar: '🧑‍💻', college: 'VIT Vellore', badge: 'Top Contributor' },
        content: 'Just cleared Amazon OA! Key tip: Practice sliding window and two-pointer problems. The HLD round was about designing a URL shortener. Happy to share my prep resources 🎉',
        tags: ['placement', 'amazon', 'tips'], likes: 42, replies: 18, time: '2h ago', liked: false
    },
    {
        id: '2', author: { name: 'Rohit K.', avatar: '👨‍🎓', college: 'NIT Trichy' },
        content: 'Can someone explain the difference between observability and monitoring? Getting conflicting answers from different sources. Preparing for SRE roles.',
        tags: ['devops', 'question'], likes: 15, replies: 8, time: '5h ago', liked: false
    },
    {
        id: '3', author: { name: 'Ananya M.', avatar: '👩‍💼', college: 'BITS Pilani', badge: 'Mentor' },
        content: 'Free resource dump for Data Science prep:\n• Statistics: Khan Academy + StatQuest\n• ML: Andrew Ng Coursera (financial aid available)\n• Projects: Kaggle micro-courses\n• SQL: Mode Analytics\nDon\'t pay for overpriced courses!',
        tags: ['resources', 'data-science', 'free'], likes: 87, replies: 32, time: '1d ago', liked: false
    },
    {
        id: '4', author: { name: 'Vikram P.', avatar: '🧑', college: 'SRM Chennai' },
        content: 'CGPA 6.8 — placed at Zoho for 6.5 LPA! Proof that CGPA isn\'t everything. Focus on DSA + projects + communication skills. Campus placement isn\'t the only way.',
        tags: ['success-story', 'motivation'], likes: 156, replies: 45, time: '2d ago', liked: false
    },
    {
        id: '5', author: { name: 'Kavitha R.', avatar: '👩‍🔬', college: 'Anna University' },
        content: 'Which is better for a fresher: service company (TCS, Infosys) or startup? I have offers from both. The startup pays more but less job security. Parents want the big brand name.',
        tags: ['career-advice', 'dilemma'], likes: 28, replies: 22, time: '3d ago', liked: false
    },
];

const TRENDING_TOPICS = [
    { tag: 'placement-2026', count: 342, emoji: '🎯' },
    { tag: 'off-campus', count: 218, emoji: '🌐' },
    { tag: 'dsa-roadmap', count: 189, emoji: '🗺️' },
    { tag: 'salary-negotiation', count: 156, emoji: '💰' },
    { tag: 'resume-tips', count: 134, emoji: '📄' },
];

const CATEGORIES = ['All', 'Placements', 'Career Advice', 'Resources', 'Success Stories', 'Questions', 'Off-Campus'];

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [filter, setFilter] = useState('All');
    const [showCompose, setShowCompose] = useState(false);
    const [newPost, setNewPost] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
    }, []);

    const toggleLike = (id: string) => {
        setPosts(prev => prev.map(p =>
            p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
        ));
    };

    const handlePost = () => {
        if (!newPost.trim()) return;
        const user = auth.getUser();
        const post: Post = {
            id: Date.now().toString(),
            author: { name: user?.display_name || 'You', avatar: '😊', college: user?.profile?.college_name || 'SkillTen User' },
            content: newPost, tags: selectedTags.length > 0 ? selectedTags : ['general'],
            likes: 0, replies: 0, time: 'Just now', liked: false
        };
        setPosts(prev => [post, ...prev]);
        setNewPost('');
        setSelectedTags([]);
        setShowCompose(false);
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="max-w-4xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🗣️ COMMUNITY</span>
                                <h1 className="text-3xl font-bold mb-2">Student Community</h1>
                                <p className="text-white/60 text-sm mb-4">Talk placement prep, share resources, ask questions. No recruiters. Just students helping students.</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="bg-white/15 px-3 py-1 rounded-full">{posts.length} discussions</span>
                                    <span className="bg-white/15 px-3 py-1 rounded-full">24 online now</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Main Feed */}
                            <div className="flex-1 space-y-4">
                                {/* Compose */}
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="st-card p-4">
                                    {showCompose ? (
                                        <div>
                                            <textarea className="st-input h-32 resize-none" placeholder="Share your experience, ask a question, or help someone out..."
                                                value={newPost} onChange={e => setNewPost(e.target.value)} autoFocus />
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {['placement', 'resources', 'tips', 'career-advice', 'question', 'success-story'].map(tag => (
                                                    <button key={tag} onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                                                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${selectedTags.includes(tag)
                                                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                            }`}>#{tag}</button>
                                                ))}
                                            </div>
                                            <div className="flex justify-end gap-2 mt-3">
                                                <button onClick={() => setShowCompose(false)} className="st-btn-secondary text-xs px-4 py-2">Cancel</button>
                                                <button onClick={handlePost} className="st-btn-primary text-xs px-4 py-2"
                                                    disabled={!newPost.trim()}>Post →</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => setShowCompose(true)}
                                            className="w-full text-left text-sm text-slate-400 hover:text-slate-600 transition-all flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50">
                                            <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm">+</span>
                                            Share something with the community...
                                        </button>
                                    )}
                                </motion.div>

                                {/* Category Filter */}
                                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                                    {CATEGORIES.map(cat => (
                                        <button key={cat} onClick={() => setFilter(cat)}
                                            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === cat
                                                ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-200'
                                                }`}>{cat}</button>
                                    ))}
                                </div>

                                {/* Posts */}
                                {posts.map((post, i) => (
                                    <motion.div key={post.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="st-card p-5 hover:shadow-md transition-all"
                                    >
                                        {/* Author header */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center text-lg">
                                                {post.author.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-sm text-slate-900">{post.author.name}</p>
                                                    {post.author.badge && (
                                                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">{post.author.badge}</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400">{post.author.college} · {post.time}</p>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <p className="text-sm text-slate-700 whitespace-pre-line mb-3 leading-relaxed">{post.content}</p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">#{tag}</span>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                                            <button onClick={() => toggleLike(post.id)}
                                                className={`flex items-center gap-1.5 text-xs font-medium transition-all ${post.liked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}>
                                                {post.liked ? '❤️' : '🤍'} {post.likes}
                                            </button>
                                            <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-600 transition-all">
                                                💬 {post.replies} replies
                                            </button>
                                            <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-600 transition-all ml-auto">
                                                📤 Share
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Sidebar (desktop) */}
                            <div className="hidden md:block w-72 space-y-4 shrink-0">
                                {/* Trending */}
                                <div className="st-card p-4">
                                    <h3 className="font-bold text-slate-900 text-sm mb-3">🔥 Trending Topics</h3>
                                    <div className="space-y-2">
                                        {TRENDING_TOPICS.map(topic => (
                                            <div key={topic.tag} className="flex items-center gap-2.5 group cursor-pointer">
                                                <span className="text-lg">{topic.emoji}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">#{topic.tag}</p>
                                                    <p className="text-[10px] text-slate-400">{topic.count} discussions</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Community Guidelines */}
                                <div className="st-card p-4">
                                    <h3 className="font-bold text-slate-900 text-sm mb-2">📋 Community Rules</h3>
                                    <ul className="space-y-1.5 text-xs text-slate-500">
                                        <li>✓ Be respectful and helpful</li>
                                        <li>✓ Share real experiences, not rumors</li>
                                        <li>✓ No spamming referral links</li>
                                        <li>✓ Tag posts correctly</li>
                                        <li>✓ Don't share confidential interview Qs</li>
                                    </ul>
                                </div>

                                {/* Quick Links */}
                                <div className="st-card p-4">
                                    <h3 className="font-bold text-slate-900 text-sm mb-2">⚡ Quick Links</h3>
                                    <div className="space-y-1.5">
                                        <Link href="/network" className="block text-xs text-indigo-600 hover:text-indigo-700 font-medium">🤝 Find Study Partners</Link>
                                        <Link href="/people-like-you" className="block text-xs text-indigo-600 hover:text-indigo-700 font-medium">👥 Similar Peers</Link>
                                        <Link href="/leaderboard" className="block text-xs text-indigo-600 hover:text-indigo-700 font-medium">🏅 Leaderboard</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
