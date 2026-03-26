'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ArchetypeCardProps {
    displayName: string;
    archetype: string;
    score: number;
    dimensions: { analytical: number; interpersonal: number; creative: number; systematic: number };
    college?: string;
    targetRole?: string;
}

const ARCHETYPE_STYLES: Record<string, { gradient: string; emoji: string; tagline: string }> = {
    'Analytical Builder': { gradient: 'from-blue-600 to-indigo-700', emoji: '🔬', tagline: 'Turns complexity into clarity' },
    'Creative Thinker': { gradient: 'from-purple-600 to-pink-600', emoji: '🎨', tagline: 'Sees the world differently' },
    'Technical Lead': { gradient: 'from-emerald-600 to-teal-700', emoji: '⚙️', tagline: 'Ship it. Then improve it.' },
    'People Connector': { gradient: 'from-amber-500 to-orange-600', emoji: '🤝', tagline: 'The bridge between teams' },
    'Strategic Visionary': { gradient: 'from-rose-600 to-red-700', emoji: '🔭', tagline: 'Thinks 3 steps ahead' },
    'Systematic Executor': { gradient: 'from-cyan-600 to-blue-700', emoji: '📐', tagline: 'Gets it done, on time, every time' },
};

export function ShareableArchetypeCard({ displayName, archetype, score, dimensions, college, targetRole }: ArchetypeCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);

    const style = ARCHETYPE_STYLES[archetype] || ARCHETYPE_STYLES['Analytical Builder'];

    const handleShare = async () => {
        const text = `🧬 My Mentixy archetype: ${archetype}!\n📊 Score: ${score}/1000\n${style.tagline}\n\nDiscover your career DNA → mentixy.in`;
        if (navigator.share) {
            try { await navigator.share({ title: `Mentixy - ${archetype}`, text }); } catch { /* cancelled */ }
        } else {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const dimMax = Math.max(dimensions.analytical, dimensions.interpersonal, dimensions.creative, dimensions.systematic, 1);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-full max-w-sm mx-auto"
        >
            <div className={`bg-gradient-to-br ${style.gradient} rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden`}>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center text-[10px] font-bold">M</div>
                        <span className="text-xs text-white/60 font-medium">Mentixy Career DNA</span>
                    </div>

                    {/* Name + Archetype */}
                    <p className="text-sm text-white/70">{displayName}</p>
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                        <span>{style.emoji}</span> {archetype}
                    </h2>
                    <p className="text-xs text-white/50 italic mb-5">{style.tagline}</p>

                    {/* Score */}
                    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 mb-4">
                        <div className="flex items-end justify-between mb-3">
                            <div>
                                <p className="text-xs text-white/60">Mentixy Score</p>
                                <p className="text-4xl font-bold tabular-nums">{score}</p>
                            </div>
                            <p className="text-xs text-white/40">/ 1000</p>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(score / 1000) * 100}%` }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                                className="h-full bg-white rounded-full"
                            />
                        </div>
                    </div>

                    {/* 4D Dimensions */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                            { label: 'Analytical', value: dimensions.analytical, color: 'bg-blue-300' },
                            { label: 'Interpersonal', value: dimensions.interpersonal, color: 'bg-pink-300' },
                            { label: 'Creative', value: dimensions.creative, color: 'bg-purple-300' },
                            { label: 'Systematic', value: dimensions.systematic, color: 'bg-emerald-300' },
                        ].map(d => (
                            <div key={d.label} className="bg-white/10 rounded-xl p-2.5">
                                <p className="text-[10px] text-white/60 mb-1">{d.label}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-white/15 rounded-full h-1.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(d.value / dimMax) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full ${d.color} rounded-full`}
                                        />
                                    </div>
                                    <span className="text-xs font-bold tabular-nums">{d.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Meta */}
                    {(college || targetRole) && (
                        <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
                            {college && <span>🎓 {college}</span>}
                            {targetRole && <span>🎯 {targetRole}</span>}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/30">mentixy.in</span>
                        <button onClick={handleShare}
                            className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95">
                            {copied ? '✓ Copied!' : '📤 Share'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
