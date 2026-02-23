'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ViyaScore, StreakCounter, SkillBadge, ActivityHeatmap, BadgeShelf } from '@/components/ui';

export default function PublicProfilePage() {
    const params = useParams();
    const username = params?.username as string;
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!username) return;
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        fetch(`${BACKEND_URL}/api/auth/profile/${username}`)
            .then(res => {
                if (!res.ok) throw new Error('Profile not found');
                return res.json();
            })
            .then(data => {
                setProfile(data);
                setLoading(false);
            })
            .catch(e => {
                setError(e.message);
                setLoading(false);
            });
    }, [username]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50">
            {/* Skeleton */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 h-48 animate-pulse" />
            <div className="max-w-2xl mx-auto px-4 -mt-12 space-y-4">
                <div className="flex items-end gap-4">
                    <div className="w-24 h-24 bg-slate-200 rounded-3xl animate-pulse" />
                    <div className="space-y-2 pb-2 flex-1">
                        <div className="st-skeleton h-5 w-40" />
                        <div className="st-skeleton h-3 w-24" />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => <div key={i} className="st-skeleton h-20 rounded-xl" />)}
                </div>
            </div>
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-xl font-semibold text-slate-900 mb-2">Profile not found</p>
            <p className="text-slate-500 mb-6">The user @{username} doesn&apos;t exist on SkillTen</p>
            <Link href="/" className="st-btn-primary px-6">Go Home</Link>
        </div>
    );

    const {
        display_name, archetype_name, skillten_score, college_name, target_role,
        streak_days, coding_stats, assessment_profile, badges, verified_skills,
        activity_heatmap, score_trend, score_percentile, placement, bio,
    } = profile;

    const tagline = archetype_name
        ? `${archetype_name} | ${target_role || 'Career Explorer'}`
        : target_role || 'SkillTen User';

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top nav */}
            <nav className="bg-white/95 backdrop-blur-lg border-b border-slate-200 px-6 py-3 sticky top-0 z-50">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">ST</div>
                        <span className="text-base font-bold text-slate-900">Skill<span className="text-indigo-600">Ten</span></span>
                    </Link>
                    <Link href="/signup" className="st-btn-primary text-sm py-2 px-4">Get SkillTen Free</Link>
                </div>
            </nav>

            {/* Hero profile header */}
            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 pt-12 pb-16 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
                <div className="max-w-2xl mx-auto relative z-10 flex items-center gap-5">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-3xl font-bold shrink-0"
                    >
                        {display_name?.[0]?.toUpperCase() || '?'}
                    </motion.div>
                    <div>
                        <h1 className="text-2xl font-bold">{display_name}</h1>
                        <p className="text-white/60 text-sm">@{username}</p>
                        <p className="text-white/80 text-sm mt-1">{tagline}</p>
                        {college_name && <p className="text-white/50 text-xs mt-0.5">🎓 {college_name}</p>}
                    </div>
                </div>
            </div>

            {/* Score + Stats */}
            <div className="max-w-2xl mx-auto px-4 -mt-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-5 mb-6"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">SkillTen Score™</p>
                            <ViyaScore
                                score={skillten_score || 0}
                                trend={score_trend}
                                percentile={score_percentile}
                                size="card"
                            />
                        </div>
                        <StreakCounter days={streak_days || 0} compact />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: 'Problems', value: coding_stats?.total || 0 },
                            { label: 'Streak', value: `${streak_days || 0}d` },
                            { label: 'Badges', value: badges?.length || 0 },
                            { label: 'Skills', value: verified_skills?.length || 0 },
                        ].map(stat => (
                            <div key={stat.label} className="text-center">
                                <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                                <p className="text-[10px] text-slate-400 uppercase">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="max-w-2xl mx-auto px-4 space-y-5 pb-12">

                {/* Bio / Summary */}
                {(bio || assessment_profile?.summary) && (
                    <section className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">About</h2>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {bio || assessment_profile?.summary || 'Career profile analysis complete.'}
                        </p>
                    </section>
                )}

                {/* Activity Heatmap (Bible FE-05) */}
                <section className="bg-white rounded-2xl p-5 shadow-sm">
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Activity</h2>
                    <ActivityHeatmap data={activity_heatmap} days={180} />
                    <p className="text-xs text-slate-400 mt-3 text-center">
                        {streak_days || 0} day current streak · Consistent learner
                    </p>
                </section>

                {/* Placement (if placed) */}
                {placement && (
                    <motion.section
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-green-200"
                    >
                        <h2 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-3">🎉 Placed</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🏢</div>
                            <div>
                                <p className="font-bold text-slate-900">{placement.company}</p>
                                <p className="text-sm text-slate-600">{placement.role}</p>
                                {placement.ctc_lpa && <p className="text-xs text-green-700 font-semibold">₹{placement.ctc_lpa} LPA</p>}
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* Verified Skills (Bible FE-05 — KEY differentiator) */}
                {verified_skills && verified_skills.length > 0 && (
                    <section className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                            Verified Skills
                        </h2>
                        <p className="text-[10px] text-indigo-500 mb-4">✓ Quiz-tested, not self-claimed</p>
                        <div className="flex flex-wrap gap-2">
                            {verified_skills.map((skill: any, i: number) => (
                                <SkillBadge
                                    key={i}
                                    skill={skill.name || skill}
                                    score={skill.score}
                                    verified={true}
                                    level={skill.level}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Coding Stats */}
                {coding_stats && (
                    <section className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Coding</h2>
                        <div className="grid grid-cols-3 gap-4 text-center mb-4">
                            <div><p className="text-xl font-bold text-green-600">{coding_stats.easy || 0}</p><p className="text-xs text-slate-500">Easy</p></div>
                            <div><p className="text-xl font-bold text-yellow-600">{coding_stats.medium || 0}</p><p className="text-xs text-slate-500">Medium</p></div>
                            <div><p className="text-xl font-bold text-red-600">{coding_stats.hard || 0}</p><p className="text-xs text-slate-500">Hard</p></div>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
                            {['bg-green-500', 'bg-yellow-500', 'bg-red-500'].map((color, i) => {
                                const vals = [coding_stats.easy || 0, coding_stats.medium || 0, coding_stats.hard || 0];
                                const total = vals.reduce((a: number, b: number) => a + b, 0) || 1;
                                return <div key={i} className={`${color} h-full`} style={{ width: `${(vals[i] / total) * 100}%` }} />;
                            })}
                        </div>
                    </section>
                )}

                {/* Badges */}
                {badges && badges.length > 0 && (
                    <section className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Achievements</h2>
                        <BadgeShelf badges={badges} />
                    </section>
                )}

                {/* 4D Profile */}
                {assessment_profile?.dimensions && (
                    <section className="bg-white rounded-2xl p-5 shadow-sm">
                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">4D Career Profile</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Analytical', value: assessment_profile.dimensions.analytical, color: 'bg-blue-500' },
                                { label: 'Interpersonal', value: assessment_profile.dimensions.interpersonal, color: 'bg-pink-500' },
                                { label: 'Creative', value: assessment_profile.dimensions.creative, color: 'bg-purple-500' },
                                { label: 'Systematic', value: assessment_profile.dimensions.systematic, color: 'bg-emerald-500' },
                            ].map(d => (
                                <div key={d.label} className="bg-slate-50 rounded-xl p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-600 font-medium">{d.label}</span>
                                        <span className="text-xs font-bold text-slate-900">{d.value || 0}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${d.value || 0}%` }}
                                            transition={{ duration: 1 }}
                                            className={`h-full ${d.color} rounded-full`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recruiter CTA */}
                <div className="bg-indigo-600 rounded-2xl p-6 text-white text-center">
                    <p className="font-semibold mb-1">Interested in {display_name?.split(' ')[0]}?</p>
                    <p className="text-sm text-indigo-200 mb-4">This profile shows verified data — not self-claimed skills</p>
                    <Link href="/signup" className="bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-semibold text-sm inline-block hover:bg-indigo-50 transition-colors">
                        Contact via SkillTen →
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-400">
                <p>Powered by <Link href="/" className="text-indigo-600 font-semibold">SkillTen</Link> — The last career profile you&apos;ll ever need.</p>
            </footer>
        </div>
    );
}
