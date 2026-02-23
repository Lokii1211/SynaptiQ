'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShareableArchetypeCard } from '@/components/profile/ShareableArchetypeCard';
import { auth } from '@/lib/api';

// Typewriter text effect
function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
    const [displayed, setDisplayed] = useState('');
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayed(text.slice(0, i + 1));
            i++;
            if (i >= text.length) { clearInterval(timer); onComplete?.(); }
        }, 60);
        return () => clearInterval(timer);
    }, [text]);
    return <span>{displayed}<span className="animate-pulse">|</span></span>;
}

// SVG Radar Chart
function RadarChart({ data, animate }: { data: { axis: string; value: number }[]; animate: boolean }) {
    const size = 280;
    const center = size / 2;
    const maxR = 110;
    const levels = 4;

    const angleStep = (2 * Math.PI) / data.length;
    const points = data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (d.value / 100) * maxR;
        return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle), ...d };
    });

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
            {/* Grid circles */}
            {Array.from({ length: levels }).map((_, i) => (
                <polygon
                    key={i}
                    points={data.map((_, j) => {
                        const angle = j * angleStep - Math.PI / 2;
                        const r = ((i + 1) / levels) * maxR;
                        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                    }).join(' ')}
                    fill="none" stroke="#e2e8f0" strokeWidth="1"
                />
            ))}
            {/* Axis lines */}
            {data.map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                return (
                    <line key={i}
                        x1={center} y1={center}
                        x2={center + maxR * Math.cos(angle)} y2={center + maxR * Math.sin(angle)}
                        stroke="#e2e8f0" strokeWidth="1"
                    />
                );
            })}
            {/* Data polygon */}
            <motion.path
                d={pathD}
                fill="rgba(99, 102, 241, 0.15)" stroke="#6366F1" strokeWidth="2.5"
                initial={animate ? { opacity: 0, scale: 0.3 } : {}}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ transformOrigin: `${center}px ${center}px` }}
            />
            {/* Data points */}
            {points.map((p, i) => (
                <motion.circle key={i} cx={p.x} cy={p.y} r="4" fill="#6366F1"
                    initial={animate ? { opacity: 0 } : {}} animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                />
            ))}
            {/* Labels */}
            {data.map((d, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const lx = center + (maxR + 25) * Math.cos(angle);
                const ly = center + (maxR + 25) * Math.sin(angle);
                return (
                    <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                        className="fill-slate-600 text-[11px] font-medium"
                    >
                        {d.axis}
                    </text>
                );
            })}
            {/* Score values */}
            {points.map((p, i) => (
                <text key={`v${i}`} x={p.x} y={p.y - 12} textAnchor="middle"
                    className="fill-indigo-700 text-[10px] font-bold"
                >
                    {p.value}
                </text>
            ))}
        </svg>
    );
}

// Career Match Card
function CareerMatchCard({ match, rank }: { match: any; rank: number }) {
    return (
        <div className="st-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-xl flex items-center justify-center text-lg font-bold text-indigo-600">
                {rank}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{match.name}</p>
                <p className="text-xs text-slate-500 truncate">{match.why || 'Strong match with your profile'}</p>
            </div>
            <div className="text-right">
                <p className={`text-lg font-bold ${(match.score || 0) >= 80 ? 'text-green-600' : (match.score || 0) >= 60 ? 'text-indigo-600' : 'text-yellow-600'}`}>
                    {match.score || 75}%
                </p>
                <p className="text-[10px] text-slate-400">match</p>
            </div>
        </div>
    );
}

const ARCHETYPE_GRADIENTS: Record<string, string> = {
    'AN': 'from-indigo-600 to-violet-700',
    'QSB': 'from-indigo-600 to-violet-700',
    'VIS': 'from-teal-500 to-cyan-600',
    'PEC': 'from-rose-500 to-pink-600',
    'TLA': 'from-emerald-500 to-teal-600',
    'SYS': 'from-blue-600 to-indigo-700',
    'CRE': 'from-purple-500 to-violet-600',
    'INV': 'from-orange-500 to-red-500',
    'LDR': 'from-amber-500 to-orange-600',
};

interface ResultsRevealProps {
    archetype: { code: string; name: string; description?: string };
    dimensions: { analytical: number; interpersonal: number; creative: number; systematic: number };
    matches: any[];
    advice?: string;
    personalitySummary?: string;
}

export function ResultsReveal({ archetype, dimensions, matches, advice, personalitySummary }: ResultsRevealProps) {
    const [phase, setPhase] = useState<'loading' | 'intro' | 'archetype' | 'radar' | 'careers' | 'plan'>('loading');

    useEffect(() => {
        const seq = [
            { delay: 1500, p: 'intro' },
            { delay: 3000, p: 'archetype' },
            { delay: 5500, p: 'radar' },
            { delay: 7000, p: 'careers' },
            { delay: 9500, p: 'plan' },
        ];
        const timers = seq.map(({ delay, p }) => setTimeout(() => setPhase(p as any), delay));
        return () => timers.forEach(clearTimeout);
    }, []);

    const gradient = ARCHETYPE_GRADIENTS[archetype.code] || 'from-indigo-600 to-violet-700';

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Loading */}
            <AnimatePresence>
                {phase === 'loading' && (
                    <motion.div exit={{ opacity: 0, scale: 0.95 }}
                        className="flex-1 flex flex-col items-center justify-center p-8 min-h-screen"
                    >
                        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6" />
                        <p className="text-slate-600 text-lg text-center">Analysing your responses...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Intro */}
            <AnimatePresence>
                {phase === 'intro' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 flex items-center justify-center p-8 min-h-screen"
                    >
                        <p className="text-xl text-slate-700 text-center font-medium leading-relaxed">
                            We&apos;ve been waiting for you<br />to discover this...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Archetype reveal */}
            {(['archetype', 'radar', 'careers', 'plan'].includes(phase)) && (
                <div className={`bg-gradient-to-br ${gradient} px-6 py-10 text-white`}>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                        className="text-sm uppercase tracking-widest mb-2"
                    >
                        Your Career Archetype
                    </motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-4"
                    >
                        {phase === 'archetype'
                            ? <TypewriterText text={archetype.name} />
                            : archetype.name
                        }
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="text-white/80 text-lg leading-relaxed"
                    >
                        {archetype.description || personalitySummary || 'Your unique career profile has been decoded.'}
                    </motion.p>
                </div>
            )}

            {/* Radar chart */}
            {(['radar', 'careers', 'plan'].includes(phase)) && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="px-6 py-8"
                >
                    <h3 className="st-section-title mb-6">Your 4D Profile</h3>
                    <RadarChart
                        data={[
                            { axis: 'Analytical', value: dimensions.analytical },
                            { axis: 'Interpersonal', value: dimensions.interpersonal },
                            { axis: 'Creative', value: dimensions.creative },
                            { axis: 'Systematic', value: dimensions.systematic },
                        ]}
                        animate={phase === 'radar'}
                    />
                </motion.div>
            )}

            {/* Career matches */}
            {(['careers', 'plan'].includes(phase)) && (
                <div className="px-4 pb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 px-2">Your Top Career Matches</h3>
                    <div className="space-y-3">
                        {(matches || []).slice(0, 5).map((match: any, index: number) => (
                            <motion.div
                                key={match.slug || index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.4 }}
                            >
                                <CareerMatchCard match={match} rank={index + 1} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Shareable Card + Action buttons */}
            {phase === 'plan' && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="px-4 pb-8"
                >
                    {/* Shareable card */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">📤 Share Your Career DNA</h3>
                        <ShareableArchetypeCard
                            displayName={auth.getUser()?.profile?.display_name || auth.getUser()?.display_name || 'Student'}
                            archetype={archetype.name}
                            score={auth.getUser()?.profile?.skillten_score || 0}
                            dimensions={dimensions}
                            college={auth.getUser()?.profile?.college_name}
                            targetRole={auth.getUser()?.profile?.target_role}
                        />
                    </div>

                    {advice && (
                        <div className="bg-indigo-50 p-4 rounded-xl mb-4 border border-indigo-100">
                            <p className="text-xs font-semibold text-indigo-600 mb-1">💡 AI Advice</p>
                            <p className="text-sm text-indigo-900">{advice}</p>
                        </div>
                    )}

                    <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 pb-safe -mx-4">
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors active:scale-[0.98]"
                        >
                            Get My Personalized Roadmap →
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
