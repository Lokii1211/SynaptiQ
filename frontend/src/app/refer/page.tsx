'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import Link from 'next/link';

interface Referral {
    name: string;
    joined: string;
    status: 'joined' | 'completed_assessment' | 'active';
}

export default function ReferPage() {
    const [referralCode, setReferralCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [totalXP, setTotalXP] = useState(0);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        const user = auth.getUser();
        const code = user?.profile?.username ? `SKTN-${user.profile.username.toUpperCase().slice(0, 6)}` : 'SKTN-USER';
        setReferralCode(code);
        // Mock referral data
        setReferrals([
            { name: 'Rahul K.', joined: '2 days ago', status: 'completed_assessment' },
            { name: 'Sneha M.', joined: '5 days ago', status: 'active' },
        ]);
        setTotalXP(175);
    }, []);

    const shareLink = `https://mentixy.in/signup?ref=${referralCode}`;
    const shareText = `🧬 I discovered my Career DNA on Mentixy — find out which career suits YOU! Free AI-powered career intelligence for Indian students.\n\n${shareLink}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = shareLink;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Join Mentixy', text: shareText, url: shareLink });
            } catch { /* cancelled */ }
        } else {
            handleCopy();
        }
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    };

    const STATUS_LABELS = {
        joined: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Joined' },
        completed_assessment: { bg: 'bg-green-50', text: 'text-green-700', label: 'Assessed ✓' },
        active: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Active 🔥' },
    };

    const REWARDS = [
        { count: 1, reward: '+50 XP', icon: '🎁', achieved: referrals.length >= 1 },
        { count: 3, reward: '+150 XP + Streak Freeze', icon: '🧊', achieved: referrals.length >= 3 },
        { count: 5, reward: '+300 XP + "Campus Influencer" badge', icon: '📣', achieved: referrals.length >= 5 },
        { count: 10, reward: '+500 XP + "Brand Ambassador" badge + 1mo Pro', icon: '👑', achieved: referrals.length >= 10 },
        { count: 25, reward: '+1000 XP + Lifetime Pro Access', icon: '💎', achieved: referrals.length >= 25 },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="max-w-3xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">🎁 REFER & EARN</span>
                                <h1 className="text-3xl font-bold mb-2">Invite Friends, Earn Rewards</h1>
                                <p className="text-white/60 text-sm mb-2">Both you and your friend get XP when they join. Help your campus grow on Mentixy.</p>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
                                        <p className="text-2xl font-bold">{referrals.length}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Referrals</p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
                                        <p className="text-2xl font-bold">{totalXP}</p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">XP Earned</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-5">

                        {/* Your Code */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="st-card p-6">
                            <h3 className="font-bold text-slate-900 mb-3">Your Referral Link</h3>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-600 truncate">
                                    {shareLink}
                                </div>
                                <button onClick={handleCopy}
                                    className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${copied
                                        ? 'bg-green-100 text-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}>
                                    {copied ? '✓ Copied' : '📋 Copy'}
                                </button>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button onClick={handleWhatsApp}
                                    className="flex-1 bg-green-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                                    📱 WhatsApp
                                </button>
                                <button onClick={handleShare}
                                    className="flex-1 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                                    📤 Share
                                </button>
                            </div>
                        </motion.section>

                        {/* How it works */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                            className="st-card p-6">
                            <h3 className="font-bold text-slate-900 mb-4">How Referrals Work</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { step: '1', icon: '📤', title: 'Share Your Link', desc: 'Send your referral link to friends and classmates' },
                                    { step: '2', icon: '🎯', title: 'Friend Joins', desc: 'They sign up and take the Career Assessment' },
                                    { step: '3', icon: '🎁', title: 'Both Earn XP', desc: 'You get +50 XP, they get +25 XP bonus' },
                                ].map(s => (
                                    <div key={s.step} className="text-center">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl mx-auto mb-2">
                                            {s.icon}
                                        </div>
                                        <p className="font-bold text-sm text-slate-900 mb-0.5">{s.title}</p>
                                        <p className="text-xs text-slate-500">{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Reward Tiers */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="st-card p-6">
                            <h3 className="font-bold text-slate-900 mb-4">🏆 Reward Tiers</h3>
                            <div className="space-y-3">
                                {REWARDS.map((r, i) => (
                                    <motion.div key={r.count}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 + i * 0.05 }}
                                        className={`flex items-center gap-4 p-3 rounded-xl ${r.achieved
                                            ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-100'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${r.achieved ? 'bg-green-100' : 'bg-white'}`}>
                                            {r.achieved ? '✅' : r.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-semibold text-sm ${r.achieved ? 'text-green-700' : 'text-slate-900'}`}>
                                                {r.count} Referral{r.count > 1 ? 's' : ''}
                                            </p>
                                            <p className="text-xs text-slate-500">{r.reward}</p>
                                        </div>
                                        {!r.achieved && (
                                            <span className="text-xs text-slate-400">{Math.max(r.count - referrals.length, 0)} more</span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Referral History */}
                        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                            className="st-card p-6">
                            <h3 className="font-bold text-slate-900 mb-3">Your Referrals</h3>
                            {referrals.length === 0 ? (
                                <div className="text-center py-8">
                                    <span className="text-4xl block mb-3">🤝</span>
                                    <p className="text-slate-500 text-sm">No referrals yet. Share your link to get started!</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {referrals.map((r, i) => {
                                        const s = STATUS_LABELS[r.status];
                                        return (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                                                    {r.name[0]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm text-slate-900">{r.name}</p>
                                                    <p className="text-[10px] text-slate-400">{r.joined}</p>
                                                </div>
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${s.bg} ${s.text}`}>{s.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.section>

                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
