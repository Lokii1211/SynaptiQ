'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    category: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    earned: boolean;
    earned_at?: string;
    progress?: number;
    max_progress?: number;
}

const BADGE_CATALOG: Badge[] = [
    // ── Streak badges ──
    { id: 'streak-7', name: 'Week Warrior', icon: '🔥', description: 'Maintain a 7-day streak', category: 'Consistency', rarity: 'common', earned: false, max_progress: 7 },
    { id: 'streak-30', name: 'Monthly Machine', icon: '⚡', description: '30-day unbroken streak', category: 'Consistency', rarity: 'rare', earned: false, max_progress: 30 },
    { id: 'streak-100', name: 'Century Legend', icon: '💎', description: '100-day streak — Top 1% dedication', category: 'Consistency', rarity: 'legendary', earned: false, max_progress: 100 },

    // ── Coding badges ──
    { id: 'first-solve', name: 'First Blood', icon: '💻', description: 'Solve your first coding problem', category: 'Coding', rarity: 'common', earned: false },
    { id: 'easy-10', name: 'Warm Up', icon: '🟢', description: 'Solve 10 easy problems', category: 'Coding', rarity: 'common', earned: false, max_progress: 10 },
    { id: 'medium-10', name: 'Getting Serious', icon: '🟡', description: 'Solve 10 medium problems', category: 'Coding', rarity: 'rare', earned: false, max_progress: 10 },
    { id: 'hard-5', name: 'Beast Mode', icon: '🔴', description: 'Solve 5 hard problems', category: 'Coding', rarity: 'epic', earned: false, max_progress: 5 },
    { id: 'poly-3', name: 'Polyglot Coder', icon: '🌍', description: 'Solve problems in 3+ languages', category: 'Coding', rarity: 'rare', earned: false, max_progress: 3 },

    // ── Assessment badges ──
    { id: 'assessed', name: 'Know Thyself', icon: '🧬', description: 'Complete the 4D Career Assessment', category: 'Assessment', rarity: 'common', earned: false },
    { id: 'score-50', name: 'Half Century', icon: '📈', description: 'Reach SkillTen Score of 50+', category: 'Assessment', rarity: 'common', earned: false },
    { id: 'score-75', name: 'Top Performer', icon: '🏆', description: 'Reach SkillTen Score of 75+', category: 'Assessment', rarity: 'epic', earned: false },
    { id: 'score-90', name: 'Elite Status', icon: '👑', description: 'Reach SkillTen Score of 90+', category: 'Assessment', rarity: 'legendary', earned: false },

    // ── Aptitude badges ──
    { id: 'apt-first', name: 'Quick Thinker', icon: '🧮', description: 'Complete your first aptitude test', category: 'Aptitude', rarity: 'common', earned: false },
    { id: 'apt-p90', name: 'Sharp Mind', icon: '🧠', description: 'Score in top 10% on aptitude', category: 'Aptitude', rarity: 'epic', earned: false },
    { id: 'apt-all-sections', name: 'All-Rounder', icon: '🎯', description: 'Complete all 3 aptitude sections', category: 'Aptitude', rarity: 'rare', earned: false, max_progress: 3 },

    // ── Skills badges ──
    { id: 'skill-1', name: 'Verified', icon: '✓', description: 'Verify your first skill via quiz', category: 'Skills', rarity: 'common', earned: false },
    { id: 'skill-5', name: 'Multi-Skilled', icon: '🎨', description: 'Verify 5 different skills', category: 'Skills', rarity: 'rare', earned: false, max_progress: 5 },
    { id: 'skill-expert', name: 'Expert Certified', icon: '🏅', description: 'Score Expert level on any skill', category: 'Skills', rarity: 'epic', earned: false },

    // ── Social badges ──
    { id: 'profile-shared', name: 'Put Yourself Out', icon: '📤', description: 'Share your public profile', category: 'Social', rarity: 'common', earned: false },
    { id: 'referral-1', name: 'Brand Ambassador', icon: '🤝', description: 'Get 1 friend to sign up', category: 'Social', rarity: 'common', earned: false },
    { id: 'referral-5', name: 'Campus Influencer', icon: '📣', description: 'Refer 5 friends to SkillTen', category: 'Social', rarity: 'rare', earned: false, max_progress: 5 },
    { id: 'campus-top3', name: 'Campus Champion', icon: '⚔️', description: 'Get your college in Campus Wars Top 3', category: 'Social', rarity: 'epic', earned: false },

    // ── Mock Drive badges ──
    { id: 'drive-done', name: 'Placement Ready', icon: '🏢', description: 'Complete a full Mock Placement Drive', category: 'Mock Drive', rarity: 'rare', earned: false },
    { id: 'drive-pass', name: 'All Rounds Clear', icon: '🎉', description: 'Pass all 4 rounds in a Mock Drive', category: 'Mock Drive', rarity: 'epic', earned: false },
    { id: 'drive-p80', name: 'Recruiter\'s Choice', icon: '💼', description: 'Score 80%+ placement probability', category: 'Mock Drive', rarity: 'legendary', earned: false },

    // ── Learning & Career ──
    { id: 'roadmap-created', name: 'Pathfinder', icon: '🗺️', description: 'Generate your first career roadmap', category: 'Career', rarity: 'common', earned: false },
    { id: 'resume-built', name: 'Resume Master', icon: '📄', description: 'Build your resume on SkillTen', category: 'Career', rarity: 'common', earned: false },
    { id: 'job-applied', name: 'Go-Getter', icon: '🎯', description: 'Apply to your first job through SkillTen', category: 'Career', rarity: 'common', earned: false },
];

const RARITY_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    common: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', glow: '' },
    rare: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', glow: '' },
    epic: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', glow: 'shadow-purple-100' },
    legendary: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', glow: 'shadow-amber-100 shadow-lg' },
};

const CATEGORIES = ['All', 'Consistency', 'Coding', 'Assessment', 'Aptitude', 'Skills', 'Social', 'Mock Drive', 'Career'];

export default function AchievementsPage() {
    const [badges, setBadges] = useState<Badge[]>(BADGE_CATALOG);
    const [filter, setFilter] = useState('All');
    const [showEarned, setShowEarned] = useState<'all' | 'earned' | 'locked'>('all');
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        api.getMe().then(u => {
            setUser(u);
            // Hydrate badge progress from user data
            const streak = u?.profile?.streak_days || 0;
            const score = u?.profile?.skillten_score || 0;
            const easy = u?.profile?.coding_stats?.easy || 0;
            const medium = u?.profile?.coding_stats?.medium || 0;
            const hard = u?.profile?.coding_stats?.hard || 0;
            const skills = u?.profile?.verified_skills?.length || 0;
            const hasAssessment = !!u?.profile?.archetype_name;

            setBadges(prev => prev.map(b => {
                const copy = { ...b };
                switch (b.id) {
                    case 'streak-7': copy.progress = Math.min(streak, 7); copy.earned = streak >= 7; break;
                    case 'streak-30': copy.progress = Math.min(streak, 30); copy.earned = streak >= 30; break;
                    case 'streak-100': copy.progress = Math.min(streak, 100); copy.earned = streak >= 100; break;
                    case 'first-solve': copy.earned = (easy + medium + hard) > 0; break;
                    case 'easy-10': copy.progress = Math.min(easy, 10); copy.earned = easy >= 10; break;
                    case 'medium-10': copy.progress = Math.min(medium, 10); copy.earned = medium >= 10; break;
                    case 'hard-5': copy.progress = Math.min(hard, 5); copy.earned = hard >= 5; break;
                    case 'assessed': copy.earned = hasAssessment; break;
                    case 'score-50': copy.earned = score >= 50; break;
                    case 'score-75': copy.earned = score >= 75; break;
                    case 'score-90': copy.earned = score >= 90; break;
                    case 'skill-1': copy.earned = skills >= 1; break;
                    case 'skill-5': copy.progress = Math.min(skills, 5); copy.earned = skills >= 5; break;
                }
                return copy;
            }));
        }).catch(() => { });
    }, []);

    const filtered = badges.filter(b => {
        if (filter !== 'All' && b.category !== filter) return false;
        if (showEarned === 'earned' && !b.earned) return false;
        if (showEarned === 'locked' && b.earned) return false;
        return true;
    });

    const earnedCount = badges.filter(b => b.earned).length;
    const totalCount = badges.length;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    {/* Hero */}
                    <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
                        <div className="max-w-3xl mx-auto relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-4 inline-block">🏆 ACHIEVEMENTS</span>
                                <h1 className="text-3xl font-bold mb-2">Badge Collection</h1>
                                <p className="text-white/70 text-sm mb-4">Earn badges by building real skills. These are verified, not self-claimed.</p>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3">
                                        <p className="text-3xl font-bold">{earnedCount}<span className="text-lg text-white/50">/{totalCount}</span></p>
                                        <p className="text-[10px] text-white/60 uppercase font-semibold">Collected</p>
                                    </div>
                                    <div className="flex-1">
                                        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                            <motion.div className="h-full bg-white rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.3 }}
                                            />
                                        </div>
                                        <p className="text-xs text-white/50 mt-1">{Math.round((earnedCount / totalCount) * 100)}% complete</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                        <div className="max-w-3xl mx-auto px-4 py-3">
                            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
                                {CATEGORIES.map(cat => (
                                    <button key={cat} onClick={() => setFilter(cat)}
                                        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === cat
                                            ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
                                            }`}>{cat}</button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                {(['all', 'earned', 'locked'] as const).map(v => (
                                    <button key={v} onClick={() => setShowEarned(v)}
                                        className={`text-xs font-medium px-3 py-1 rounded-md transition-all capitalize ${showEarned === v
                                            ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                                            }`}>{v === 'all' ? 'All' : v === 'earned' ? `Earned (${earnedCount})` : `Locked (${totalCount - earnedCount})`}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Badge Grid */}
                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {filtered.map((badge, i) => {
                                const style = RARITY_STYLES[badge.rarity];
                                return (
                                    <motion.button key={badge.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => setSelectedBadge(badge)}
                                        className={`relative p-4 rounded-2xl border text-left transition-all hover:shadow-md ${badge.earned
                                            ? `${style.bg} ${style.border} ${style.glow}`
                                            : 'bg-white border-slate-200 opacity-50 grayscale'
                                            }`}
                                    >
                                        <span className={`text-3xl block mb-2 ${!badge.earned ? 'filter grayscale' : ''}`}>{badge.icon}</span>
                                        <p className={`text-sm font-bold ${badge.earned ? 'text-slate-900' : 'text-slate-400'} mb-0.5`}>{badge.name}</p>
                                        <p className="text-[10px] text-slate-500 line-clamp-2">{badge.description}</p>

                                        {/* Rarity label */}
                                        <span className={`absolute top-2 right-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${style.bg} ${style.text} ${style.border} border`}>
                                            {badge.rarity}
                                        </span>

                                        {/* Progress bar */}
                                        {badge.max_progress && !badge.earned && (
                                            <div className="mt-2">
                                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full"
                                                        style={{ width: `${((badge.progress || 0) / badge.max_progress) * 100}%` }}
                                                    />
                                                </div>
                                                <p className="text-[9px] text-slate-400 mt-0.5">{badge.progress || 0}/{badge.max_progress}</p>
                                            </div>
                                        )}

                                        {badge.earned && (
                                            <span className="absolute top-2 left-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-16">
                                <span className="text-5xl block mb-4">🏆</span>
                                <p className="text-slate-500">No badges match your filter</p>
                            </div>
                        )}
                    </div>

                    {/* Badge Detail Modal */}
                    <AnimatePresence>
                        {selectedBadge && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
                                onClick={() => setSelectedBadge(null)}
                            >
                                <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                                    className="bg-white rounded-3xl p-8 max-w-sm w-full text-center"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                                        className="text-6xl block mb-4">
                                        {selectedBadge.icon}
                                    </motion.span>
                                    <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedBadge.name}</h2>
                                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${RARITY_STYLES[selectedBadge.rarity].bg} ${RARITY_STYLES[selectedBadge.rarity].text} ${RARITY_STYLES[selectedBadge.rarity].border} border inline-block mb-3`}>
                                        {selectedBadge.rarity}
                                    </span>
                                    <p className="text-sm text-slate-600 mb-4">{selectedBadge.description}</p>

                                    {selectedBadge.earned ? (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                            <p className="text-green-700 font-semibold text-sm">✓ Earned!</p>
                                            {selectedBadge.earned_at && (
                                                <p className="text-green-600 text-xs mt-0.5">{selectedBadge.earned_at}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                                            <p className="text-slate-500 text-sm font-medium">🔒 Not yet earned</p>
                                            {selectedBadge.max_progress && (
                                                <div className="mt-2">
                                                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full transition-all"
                                                            style={{ width: `${((selectedBadge.progress || 0) / selectedBadge.max_progress) * 100}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-1">{selectedBadge.progress || 0}/{selectedBadge.max_progress} progress</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <button onClick={() => setSelectedBadge(null)}
                                        className="st-btn-secondary w-full text-sm">Close</button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
