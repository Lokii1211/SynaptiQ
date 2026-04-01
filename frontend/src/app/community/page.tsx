'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
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
    postType?: 'text' | 'placement' | 'solution' | 'achievement' | 'poll' | 'ama';
    metadata?: {
        company?: string; role?: string; ctc?: string; rounds?: string[];
        problemTitle?: string; language?: string; codeSnippet?: string; complexity?: string;
        achievementTitle?: string; achievementIcon?: string;
        pollOptions?: { text: string; votes: number }[]; pollTotal?: number;
        amaHost?: string; amaRole?: string; amaStatus?: 'live' | 'upcoming' | 'ended';
    };
}


const CATEGORIES = ['All', 'Placements', 'Career Advice', 'Resources', 'Success Stories', 'Questions', 'Off-Campus'];

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filter, setFilter] = useState('All');
    const [showCompose, setShowCompose] = useState(false);
    const [newPost, setNewPost] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [votedPolls, setVotedPolls] = useState<Record<string, number>>({});
    const [feedTab, setFeedTab] = useState<'foryou' | 'college' | 'career' | 'placements' | 'study'>('foryou');
    const [showReactions, setShowReactions] = useState<string | null>(null);

    const REACTIONS = [
        { emoji: '💡', label: 'Insightful' },
        { emoji: '🔥', label: 'Inspiring' },
        { emoji: '🤝', label: 'Relatable' },
        { emoji: '👏', label: 'Impressive' },
        { emoji: '💪', label: 'Motivating' },
    ];

    useEffect(() => {
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
            author: { name: user?.display_name || 'You', avatar: '😊', college: user?.profile?.college_name || 'Mentixy User' },
            content: newPost, tags: selectedTags.length > 0 ? selectedTags : ['general'],
            likes: 0, replies: 0, time: 'Just now', liked: false
        };
        setPosts(prev => [post, ...prev]);
        setNewPost('');
        setSelectedTags([]);
        setShowCompose(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
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
                                {/* Feed Tabs (Bible L2) */}
                                <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200 overflow-x-auto mb-2">
                                    {([
                                        { id: 'foryou' as const, label: '🏠 For You' },
                                        { id: 'college' as const, label: '🏫 My College' },
                                        { id: 'career' as const, label: '💼 My Career' },
                                        { id: 'placements' as const, label: '🏆 Placements' },
                                        { id: 'study' as const, label: '📚 Study' },
                                    ]).map(t => (
                                        <button key={t.id} onClick={() => setFeedTab(t.id)}
                                            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${feedTab === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

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

                                        {/* Structured Post: Placement Card (Bible Phase 4) */}
                                        {post.postType === 'placement' && post.metadata && (
                                            <div className="mb-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">🎉</span>
                                                    <div>
                                                        <p className="text-sm font-bold text-emerald-800">Placed at {post.metadata.company}!</p>
                                                        <p className="text-xs text-emerald-600">{post.metadata.role} · {post.metadata.ctc}</p>
                                                    </div>
                                                </div>
                                                {post.metadata.rounds && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {post.metadata.rounds.map((r, i) => (
                                                            <span key={i} className="text-[9px] bg-white border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                                                {i + 1}. {r}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Structured Post: Solution Share (Bible Phase 4) */}
                                        {post.postType === 'solution' && post.metadata && (
                                            <div className="mb-3 bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
                                                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-indigo-400 font-semibold">💡 {post.metadata.problemTitle}</span>
                                                        <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{post.metadata.language}</span>
                                                    </div>
                                                    <span className="text-[9px] text-emerald-400 font-mono">{post.metadata.complexity}</span>
                                                </div>
                                                <pre className="px-4 py-3 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed">{post.metadata.codeSnippet}</pre>
                                            </div>
                                        )}

                                        {/* Structured Post: Poll (Bible Phase 4) */}
                                        {post.postType === 'poll' && post.metadata?.pollOptions && (
                                            <div className="mb-3 space-y-2">
                                                {post.metadata.pollOptions.map((opt, i) => {
                                                    const voted = votedPolls[post.id] !== undefined;
                                                    const isSelected = votedPolls[post.id] === i;
                                                    const pct = voted && post.metadata?.pollTotal ? Math.round((opt.votes / post.metadata.pollTotal) * 100) : 0;
                                                    return (
                                                        <button key={i}
                                                            onClick={() => {
                                                                if (!voted) setVotedPolls(prev => ({ ...prev, [post.id]: i }));
                                                            }}
                                                            className={`w-full text-left relative overflow-hidden rounded-xl px-4 py-3 border transition-all ${voted
                                                                ? (isSelected ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-slate-50')
                                                                : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'
                                                                }`}>
                                                            {voted && (
                                                                <div className={`absolute inset-y-0 left-0 ${isSelected ? 'bg-indigo-100' : 'bg-slate-100'} transition-all duration-700`} style={{ width: `${pct}%` }} />
                                                            )}
                                                            <div className="relative flex items-center justify-between z-10">
                                                                <span className={`text-xs font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                                    {isSelected && '✓ '}{opt.text}
                                                                </span>
                                                                {voted && <span className={`text-xs font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>{pct}%</span>}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                                <p className="text-[10px] text-slate-400 text-right">
                                                    {votedPolls[post.id] !== undefined ? `${post.metadata.pollTotal} votes` : 'Tap to vote'}
                                                </p>
                                            </div>
                                        )}

                                        {/* Structured Post: AMA (Bible Phase 4) */}
                                        {post.postType === 'ama' && post.metadata && (
                                            <div className="mb-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {post.metadata.amaStatus === 'live' && (
                                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                            LIVE NOW
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-violet-600 font-semibold">🎤 {post.metadata.amaRole}</span>
                                                </div>
                                                <button className="w-full text-center bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors">
                                                    💬 Ask a Question
                                                </button>
                                            </div>
                                        )}

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
                                        <p className="text-xs text-slate-400 text-center py-4">Topics will appear as the community grows</p>
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
