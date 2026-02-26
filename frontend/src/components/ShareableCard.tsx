'use client';
import { useRef, useState } from 'react';

interface ShareableCardProps {
    name: string;
    archetype?: string;
    topCareer: string;
    score: number;
    dimensions: {
        analytical: number;
        interpersonal: number;
        creative: number;
        systematic: number;
    };
    college?: string;
}

export function ShareableCard({
    name,
    archetype,
    topCareer,
    score,
    dimensions,
    college,
}: ShareableCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [shared, setShared] = useState(false);

    const handleShare = async () => {
        if (!cardRef.current) return;

        // Try native share
        const shareData = {
            title: `${name}'s Career DNA — SkillTen`,
            text: `🧬 My Career DNA says I'm a ${archetype || 'Future Leader'}! Top career match: ${topCareer}. Viya Score™: ${score}/100\n\nDiscover YOUR career DNA for free on SkillTen`,
            url: 'https://skillten.in',
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                setShared(true);
                setTimeout(() => setShared(false), 3000);
            } catch { /* user cancelled */ }
        } else {
            // Fallback: copy card text
            await navigator.clipboard.writeText(
                `${shareData.text}\n${shareData.url}`
            );
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    };

    const handleDownload = async () => {
        // Copy card content as text for sharing
        const text = `🧬 ${name}'s Career DNA — SkillTen\n\n🏷️ Archetype: ${archetype || 'Future Leader'}\n🎯 Top Career: ${topCareer}\n📊 Viya Score™: ${score}/100\n\n📐 4D Dimensions:\n  Analytical: ${dimensions.analytical}\n  Interpersonal: ${dimensions.interpersonal}\n  Creative: ${dimensions.creative}\n  Systematic: ${dimensions.systematic}\n\n🔗 Discover YOUR Career DNA: https://skillten.in`;
        try {
            await navigator.clipboard.writeText(text);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        } catch {
            handleShare();
        }
    };

    const maxDim = Math.max(dimensions.analytical, dimensions.interpersonal, dimensions.creative, dimensions.systematic);
    const dimBar = (val: number) => `${Math.round((val / Math.max(maxDim, 1)) * 100)}%`;

    return (
        <div className="space-y-3">
            {/* The card itself */}
            <div ref={cardRef} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-xl">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">ST</div>
                        <span className="text-xs font-semibold text-white/60">SkillTen Career DNA™</span>
                    </div>

                    {/* Name & Archetype */}
                    <h3 className="text-xl font-bold mb-0.5">{name}</h3>
                    {archetype && (
                        <p className="text-xs font-semibold text-amber-300 mb-3">🏷️ {archetype}</p>
                    )}
                    {college && <p className="text-xs text-white/40 mb-3">{college}</p>}

                    {/* Top Career */}
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 mb-4">
                        <p className="text-[10px] text-white/50 uppercase font-semibold mb-0.5">Top Career Match</p>
                        <p className="text-sm font-bold">{topCareer}</p>
                    </div>

                    {/* 4D Dimensions */}
                    <div className="space-y-2 mb-4">
                        {[
                            { label: 'Analytical', value: dimensions.analytical, color: 'bg-blue-400' },
                            { label: 'Interpersonal', value: dimensions.interpersonal, color: 'bg-green-400' },
                            { label: 'Creative', value: dimensions.creative, color: 'bg-amber-400' },
                            { label: 'Systematic', value: dimensions.systematic, color: 'bg-rose-400' },
                        ].map(d => (
                            <div key={d.label} className="flex items-center gap-2">
                                <span className="text-[10px] text-white/60 w-20 shrink-0">{d.label}</span>
                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className={`h-full ${d.color} rounded-full transition-all duration-500`} style={{ width: dimBar(d.value) }} />
                                </div>
                                <span className="text-[10px] text-white/60 w-8 text-right">{d.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Score */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-white/40 uppercase font-semibold">Viya Score™</p>
                            <p className="text-2xl font-bold">{score}<span className="text-sm text-white/50">/100</span></p>
                        </div>
                        <div className="text-right text-[10px] text-white/30">
                            <p>skillten.in</p>
                            <p>Discover YOUR Career DNA →</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button onClick={handleShare}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${shared ? 'bg-green-100 text-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}>
                    {shared ? '✓ Shared!' : '📤 Share Card'}
                </button>
                <button onClick={handleDownload}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    📥 Download
                </button>
            </div>
        </div>
    );
}
