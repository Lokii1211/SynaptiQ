'use client';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

// ─── Inline ProgressRing for Score ───
function ScoreRing({ score, size = 96 }: { score: number; size?: number }) {
    const radius = (size - 12) / 2;
    const circ = 2 * Math.PI * radius;
    const pct = Math.min(score, 100) / 100;
    const color = score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : score >= 25 ? '#f97316' : '#ef4444';

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="st-progress-ring">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
                <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color}
                    strokeWidth="6" strokeLinecap="round"
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: circ * (1 - pct) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeDasharray={circ}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900 tabular-nums">{score}</span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">Score</span>
            </div>
        </div>
    );
}

// ─── Inline Activity Heatmap (180-day GitHub style) ───
function MiniHeatmap({ data = {}, days = 180 }: { data?: Record<string, number>; days?: number }) {
    const cells = useMemo(() => {
        const result: { date: string; count: number }[] = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            result.push({ date: key, count: data[key] || 0 });
        }
        return result;
    }, [data, days]);

    const getColor = (count: number) => {
        if (count === 0) return 'bg-slate-100';
        if (count === 1) return 'bg-indigo-200';
        if (count <= 3) return 'bg-indigo-400';
        return 'bg-indigo-600';
    };

    return (
        <div className="flex flex-wrap gap-[3px]">
            {cells.map((c, i) => (
                <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${getColor(c.count)}`}
                    title={`${c.date}: ${c.count} activities`}
                />
            ))}
        </div>
    );
}

// ─── Skill Badge ───
function InlineSkillBadge({ skill, score, level }: { skill: string; score?: number; level?: string }) {
    const levelColor = level === 'expert' ? 'bg-purple-100 text-purple-700 border-purple-200'
        : level === 'advanced' ? 'bg-blue-100 text-blue-700 border-blue-200'
            : level === 'intermediate' ? 'bg-green-100 text-green-700 border-green-200'
                : 'bg-slate-100 text-slate-600 border-slate-200';

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${levelColor}`}>
            <span className="text-indigo-500 text-xs">✓</span>
            {skill}
            {score != null && <span className="text-xs opacity-60">{score}%</span>}
        </span>
    );
}

export default function PublicProfilePage() {
    const params = useParams();
    const username = params?.username as string;
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [shareMsg, setShareMsg] = useState('');

    useEffect(() => {
        if (!username) return;
        const BACKEND_URL = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') ? 'https://mentixy.vercel.app' : 'http://localhost:8000';
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

    const handleShare = async () => {
        const url = window.location.href;
        const text = `Check out ${profile?.display_name || username}'s verified career profile on Mentixy!`;
        try {
            if (navigator.share) {
                await navigator.share({ title: `${profile?.display_name} on Mentixy`, text, url });
            } else {
                await navigator.clipboard.writeText(url);
                setShareMsg('Link copied!');
                setTimeout(() => setShareMsg(''), 2000);
            }
        } catch { /* user cancelled */ }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 h-56" />
            <div className="max-w-2xl mx-auto px-4 -mt-16 space-y-4">
                <div className="flex items-end gap-4">
                    <div className="w-28 h-28 bg-white rounded-3xl shadow-xl animate-pulse" />
                    <div className="space-y-2 pb-2 flex-1">
                        <div className="st-skeleton h-6 w-40" />
                        <div className="st-skeleton h-4 w-24" />
                    </div>
                </div>
                <div className="st-skeleton h-32 rounded-2xl" />
                <div className="st-skeleton h-48 rounded-2xl" />
            </div>
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <span className="text-6xl block mb-4">🔍</span>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile not found</h1>
                <p className="text-slate-500 mb-8">The user @{username} doesn&apos;t exist on Mentixy yet.</p>
                <div className="flex gap-3 justify-center">
                    <Link href="/" className="st-btn-secondary px-6">Go Home</Link>
                    <Link href="/signup" className="st-btn-primary px-6">Create Yours Free</Link>
                </div>
            </motion.div>
        </div>
    );

    const {
        display_name, archetype_name, mentixy_score, college_name, target_role,
        streak_days, coding_stats, assessment_profile, badges, verified_skills,
        activity_heatmap, score_percentile, placement, bio, aptitude,
        open_to_work, campus_rank, graduation_year, stream,
    } = profile;

    const tagline = archetype_name
        ? `${archetype_name} · ${target_role || 'Career Explorer'}`
        : target_role || 'Mentixy Member';

    const codingTotal = (coding_stats?.easy || 0) + (coding_stats?.medium || 0) + (coding_stats?.hard || 0);
    const placementReadiness = Math.min(100, Math.round(
        ((mentixy_score || 0) * 0.3) + ((aptitude?.overall_percentile || 0) * 0.3) + (Math.min(codingTotal, 50) * 0.8) + ((verified_skills?.length || 0) * 5)
    ));

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ─── Top Navigation ─── */}
            <nav className="bg-white/95 backdrop-blur-lg border-b border-slate-200 px-6 py-3 sticky top-0 z-50">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">M</div>
                        <span className="text-base font-bold text-slate-900">Mentixy</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button onClick={handleShare} className="text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                            {shareMsg || '📤 Share'}
                        </button>
                        <Link href="/signup" className="st-btn-primary text-sm py-2 px-4">Join Free</Link>
                    </div>
                </div>
            </nav>

            {/* ─── Hero Profile Header ─── */}
            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 pt-14 pb-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
                <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full animate-float" />
                <div className="max-w-2xl mx-auto relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-5">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-4xl font-bold shadow-lg shrink-0 border border-white/20">
                            {display_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h1 className="text-3xl font-bold">{display_name}</h1>
                                {(open_to_work || profile.open_to_work) && (
                                    <span className="text-[10px] bg-green-400 text-green-900 px-2 py-0.5 rounded-full font-bold animate-pulse">Open to Work</span>
                                )}
                            </div>
                            <p className="text-white/60 text-sm font-medium">@{username}</p>
                            <p className="text-white/80 text-sm mt-1">{tagline}</p>
                            {college_name && (
                                <p className="text-white/50 text-xs mt-0.5">
                                    🎓 {college_name}{stream ? ` · ${stream}` : ''}{graduation_year ? ` · ${graduation_year}` : ''}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ─── Score Card (overlapping hero) ─── */}
            <div className="max-w-2xl mx-auto px-4 -mt-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-slate-100"
                >
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-5">
                            <ScoreRing score={mentixy_score || 0} />
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mentixy Score™</p>
                                {score_percentile && (
                                    <p className="text-sm text-indigo-600 font-semibold mt-0.5">Top {100 - score_percentile}%</p>
                                )}
                                <p className="text-xs text-slate-400 mt-0.5">Verified by AI assessment</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-slate-900">{streak_days || 0}🔥</p>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">Day Streak</p>
                        </div>
                    </div>

                    {/* Quick Stats Bar (PRO Bible 3.1) */}
                    <div className="grid grid-cols-5 gap-2">
                        {[
                            { label: 'Mentixy Score', value: mentixy_score || 0, icon: '⭐' },
                            { label: 'Streak', value: `${streak_days || 0}🔥`, icon: '' },
                            { label: 'Skills', value: `${verified_skills?.length || 0}/10`, icon: '✓' },
                            { label: 'Problems', value: codingTotal, icon: '💻' },
                            { label: 'Readiness', value: `${placementReadiness}%`, icon: '🎯' },
                        ].map(stat => (
                            <div key={stat.label} className="text-center bg-slate-50 rounded-xl p-2.5">
                                <p className="text-base font-bold text-slate-900 tabular-nums">{stat.value}</p>
                                <p className="text-[9px] text-slate-400 uppercase font-semibold">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="max-w-2xl mx-auto px-4 space-y-5 pb-16">
                {/* ─── Bio ─── */}
                {(bio || assessment_profile?.summary) && (
                    <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                    >
                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">About</h2>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {bio || assessment_profile?.summary || 'Career profile analysis complete.'}
                        </p>
                    </motion.section>
                )}

                {/* ─── Placement Card ─── */}
                {placement && (
                    <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-green-200"
                    >
                        <h2 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-3">🎉 Placed!</h2>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🏢</div>
                            <div>
                                <p className="font-bold text-slate-900 text-lg">{placement.company}</p>
                                <p className="text-sm text-slate-600">{placement.role}</p>
                                {placement.ctc_lpa && <p className="text-xs text-green-700 font-semibold mt-0.5">₹{placement.ctc_lpa} LPA</p>}
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* ─── Activity Heatmap ─── */}
                <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                >
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Activity (180 days)</h2>
                    <MiniHeatmap data={activity_heatmap} days={180} />
                    <p className="text-xs text-slate-400 mt-3 text-center">
                        {streak_days || 0} day streak · {codingTotal} problems solved
                    </p>
                </motion.section>

                {/* ─── Verified Skills (PRO Bible 3.1 — with score bars + expiry) ─── */}
                {verified_skills && verified_skills.length > 0 && (
                    <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Skills</h2>
                            <span className="text-[10px] text-indigo-500 font-semibold">✓ Quiz-verified</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-4">These skills are AI-tested, not self-claimed</p>
                        <div className="space-y-3">
                            {verified_skills.map((skill: any, i: number) => (
                                <div key={i} className="bg-slate-50 rounded-xl p-3">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-indigo-500 text-xs">🏅</span>
                                            <span className="text-sm font-semibold text-slate-800">{skill.name || skill.skill_name || skill}</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 tabular-nums">{skill.score || skill.verified_score || 0}/100</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${skill.score || skill.verified_score || 0}%` }}
                                            transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                                            className="h-full bg-indigo-500 rounded-full" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400">
                                            {skill.percentile ? `${skill.percentile}th percentile` : skill.proficiency_level || 'Verified'}
                                        </span>
                                        {(skill.expires_at || skill.verified_at) && (
                                            <span className="text-[10px] text-slate-400">
                                                {skill.expires_at ? `Expires: ${skill.expires_at}` : `Verified: ${skill.verified_at}`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* ─── Aptitude Scores (PRO Bible 3.1) ─── */}
                {(aptitude?.overall_percentile || aptitude?.tests_taken > 0) && (
                    <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                    >
                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Aptitude Scores</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Quantitative', value: aptitude?.quant_percentile, color: 'bg-blue-500' },
                                { label: 'Logical', value: aptitude?.logical_percentile, color: 'bg-emerald-500' },
                                { label: 'Verbal', value: aptitude?.verbal_percentile, color: 'bg-amber-500' },
                                { label: 'Overall', value: aptitude?.overall_percentile, color: 'bg-indigo-500' },
                            ].map(apt => (
                                <div key={apt.label} className="bg-slate-50 rounded-xl p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-slate-600 font-medium">{apt.label}</span>
                                        <span className="text-xs font-bold text-slate-800">{apt.value || '—'}{apt.value ? 'th' : ''}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className={`h-full ${apt.color} rounded-full transition-all duration-700`} style={{ width: `${apt.value || 0}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 text-center">Based on {aptitude?.tests_taken || 0} tests</p>
                    </motion.section>
                )}

                {/* ─── Coding Stats ─── */}
                {coding_stats && codingTotal > 0 && (
                    <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                    >
                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Coding Stats</h2>
                        <div className="grid grid-cols-3 gap-4 text-center mb-4">
                            <div className="bg-green-50 rounded-xl p-3">
                                <p className="text-2xl font-bold text-green-600">{coding_stats.easy || 0}</p>
                                <p className="text-xs text-green-600/80 font-medium">Easy</p>
                            </div>
                            <div className="bg-yellow-50 rounded-xl p-3">
                                <p className="text-2xl font-bold text-yellow-600">{coding_stats.medium || 0}</p>
                                <p className="text-xs text-yellow-600/80 font-medium">Medium</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-3">
                                <p className="text-2xl font-bold text-red-600">{coding_stats.hard || 0}</p>
                                <p className="text-xs text-red-600/80 font-medium">Hard</p>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
                            {[
                                { val: coding_stats.easy || 0, color: 'bg-green-500' },
                                { val: coding_stats.medium || 0, color: 'bg-yellow-500' },
                                { val: coding_stats.hard || 0, color: 'bg-red-500' },
                            ].map((seg, i) => (
                                <motion.div key={i} className={`${seg.color} h-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(seg.val / (codingTotal || 1)) * 100}%` }}
                                    transition={{ duration: 0.8, delay: 0.5 + i * 0.15 }}
                                />
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* ─── Badges ─── */}
                {badges && badges.length > 0 && (
                    <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                    >
                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Achievements</h2>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                            {badges.map((badge: any, i: number) => (
                                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.08 }}
                                    className="flex flex-col items-center gap-1 group"
                                >
                                    <span className="text-2xl group-hover:scale-125 transition-transform">{badge.icon || '🏅'}</span>
                                    <span className="text-[10px] text-slate-500 font-medium text-center line-clamp-2">{badge.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* ─── 4D Career Profile ─── */}
                {assessment_profile?.dimensions && (
                    <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
                    >
                        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">4D Career Profile</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Analytical', value: assessment_profile.dimensions.analytical, color: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700' },
                                { label: 'Interpersonal', value: assessment_profile.dimensions.interpersonal, color: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-700' },
                                { label: 'Creative', value: assessment_profile.dimensions.creative, color: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700' },
                                { label: 'Systematic', value: assessment_profile.dimensions.systematic, color: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700' },
                            ].map(d => (
                                <div key={d.label} className={`${d.light} rounded-xl p-4`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-xs ${d.text} font-semibold`}>{d.label}</span>
                                        <span className="text-sm font-bold text-slate-900">{d.value || 0}%</span>
                                    </div>
                                    <div className="w-full bg-white/80 rounded-full h-2">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${d.value || 0}%` }}
                                            transition={{ duration: 1, delay: 0.6 }}
                                            className={`h-full ${d.color} rounded-full`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* ─── Recruiter CTA ─── */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                    className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white text-center"
                >
                    <p className="text-lg font-bold mb-1">Interested in {display_name?.split(' ')[0]}?</p>
                    <p className="text-sm text-indigo-200 mb-5">This profile shows quiz-verified data — not self-claimed skills</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={handleShare} className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/30 transition-colors">
                            📤 Share Profile
                        </button>
                        <Link href="/signup" className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-colors">
                            Create Yours Free →
                        </Link>
                    </div>
                </motion.div>

                {/* ─── Mentixy watermark ─── */}
                <div className="text-center pt-4 pb-8">
                    <p className="text-xs text-slate-400">
                        Verified career profile on{' '}
                        <Link href="/" className="text-indigo-600 font-semibold hover:underline">Mentixy</Link>
                        {' '}— The last career profile you&apos;ll ever need.
                    </p>
                </div>
            </div>
        </div>
    );
}
