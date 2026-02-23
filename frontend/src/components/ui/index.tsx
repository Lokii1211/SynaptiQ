'use client';
import { motion } from 'framer-motion';

// ─── ViyaScore Component (Bible FE-01 #1) ───
interface ViyaScoreProps {
    score: number;
    trend?: number;
    percentile?: number;
    size?: 'hero' | 'card' | 'inline';
}

export function ViyaScore({ score, trend, percentile, size = 'card' }: ViyaScoreProps) {
    const sizes = {
        hero: { font: 'text-7xl', trend: 'text-lg', sub: 'text-sm' },
        card: { font: 'text-4xl', trend: 'text-sm', sub: 'text-xs' },
        inline: { font: 'text-xl', trend: 'text-xs', sub: 'text-[10px]' },
    };
    const s = sizes[size];

    return (
        <div className="flex items-end gap-3">
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${s.font} font-bold text-indigo-600 tabular-nums`}
            >
                {score}
            </motion.span>
            <div className="pb-1.5">
                {typeof trend === 'number' && (
                    <span className={`${s.trend} font-semibold ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                        {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}
                    </span>
                )}
                {typeof percentile === 'number' && (
                    <p className={`${s.sub} text-slate-400`}>Top {100 - percentile}% of users</p>
                )}
            </div>
        </div>
    );
}

// ─── StreakCounter Component (Bible FE-01) ───
interface StreakCounterProps {
    days: number;
    compact?: boolean;
}

export function StreakCounter({ days, compact = false }: StreakCounterProps) {
    const flames = Math.min(Math.floor(days / 7), 5);
    if (compact) {
        return (
            <span className="inline-flex items-center gap-1 text-sm font-bold text-orange-600">
                🔥 {days}d
            </span>
        );
    }
    return (
        <div className="flex items-center gap-2">
            <span className="text-2xl">{'🔥'.repeat(Math.max(flames, 1))}</span>
            <div>
                <p className="text-lg font-bold text-slate-900 tabular-nums">{days} days</p>
                <p className="text-xs text-slate-500">
                    {days === 0 ? 'Start your streak today!'
                        : days < 7 ? 'Building momentum!'
                            : days < 30 ? 'On fire! Keep going!'
                                : days < 100 ? `${Math.floor(days / 30)} month streak! 🏆`
                                    : 'Legendary streak! 👑'}
                </p>
            </div>
        </div>
    );
}

// ─── SkillBadge Component (Bible FE-01 #2) ───
interface SkillBadgeProps {
    skill: string;
    score?: number;
    verified?: boolean;
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    onClick?: () => void;
}

export function SkillBadge({ skill, score, verified = false, level, onClick }: SkillBadgeProps) {
    const levelColors = {
        beginner: 'bg-green-50 text-green-700 border-green-200',
        intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
        advanced: 'bg-purple-50 text-purple-700 border-purple-200',
        expert: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all hover:shadow-md ${level ? levelColors[level] : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
        >
            <span className="truncate max-w-[120px]">{skill}</span>
            {verified && score != null && (
                <span className="bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0.5 rounded font-bold">
                    ✓ {score}
                </span>
            )}
            {!verified && <span className="text-[10px] text-slate-400">unverified</span>}
        </motion.button>
    );
}

// ─── ActivityHeatmap Component (Bible FE-01 #3) ───
interface ActivityHeatmapProps {
    data?: Record<string, number>;  // { 'YYYY-MM-DD': count }
    days?: number;
}

export function ActivityHeatmap({ data = {}, days = 180 }: ActivityHeatmapProps) {
    const today = new Date();
    const cells: { date: string; count: number; dayOfWeek: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        cells.push({ date: key, count: data[key] || 0, dayOfWeek: d.getDay() });
    }

    const weeks: typeof cells[] = [];
    let currentWeek: typeof cells = [];
    cells.forEach((cell, i) => {
        currentWeek.push(cell);
        if (cell.dayOfWeek === 6 || i === cells.length - 1) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    const getColor = (count: number) => {
        if (count === 0) return 'bg-slate-100';
        if (count <= 1) return 'bg-indigo-200';
        if (count <= 3) return 'bg-indigo-400';
        if (count <= 5) return 'bg-indigo-600';
        return 'bg-indigo-800';
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex gap-[3px] min-w-fit">
                {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((cell) => (
                            <div
                                key={cell.date}
                                title={`${cell.date}: ${cell.count} activities`}
                                className={`w-3 h-3 rounded-sm ${getColor(cell.count)} transition-colors hover:ring-2 hover:ring-indigo-300`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-1 mt-2 justify-end text-[10px] text-slate-400">
                <span>Less</span>
                {['bg-slate-100', 'bg-indigo-200', 'bg-indigo-400', 'bg-indigo-600', 'bg-indigo-800'].map(c => (
                    <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
                ))}
                <span>More</span>
            </div>
        </div>
    );
}

// ─── ProgressRing Component ───
interface ProgressRingProps {
    value: number;
    max: number;
    size?: number;
    color?: string;
    label?: string;
}

export function ProgressRing({ value, max, size = 64, color = '#6366F1', label }: ProgressRingProps) {
    const r = (size - 8) / 2;
    const c = 2 * Math.PI * r;
    const pct = Math.min(value / max, 1);
    const offset = c * (1 - pct);

    return (
        <div className="flex flex-col items-center gap-1">
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={r} fill="none"
                    stroke={color} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={c}
                    initial={{ strokeDashoffset: c }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                />
            </svg>
            <span className="text-xs font-semibold text-slate-700">{label}</span>
        </div>
    );
}

// ─── BadgeShelf Component ───
interface Badge { name: string; icon?: string; earned_at?: string }

export function BadgeShelf({ badges }: { badges: Badge[] }) {
    return (
        <div className="flex flex-wrap gap-3">
            {badges.map((badge, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center gap-1.5 p-3 bg-amber-50 rounded-xl border border-amber-200 min-w-[80px]"
                >
                    <span className="text-2xl">{badge.icon || '🏅'}</span>
                    <span className="text-[10px] font-semibold text-amber-800 text-center leading-tight">{badge.name}</span>
                </motion.div>
            ))}
        </div>
    );
}

// ─── Toast Component ───
interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    visible: boolean;
    onClose: () => void;
}

export function Toast({ message, type = 'info', visible, onClose }: ToastProps) {
    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-indigo-600',
    };
    const icons = { success: '✓', error: '✕', info: 'ℹ' };

    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] ${colors[type]} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px]`}
        >
            <span className="text-lg">{icons[type]}</span>
            <span className="text-sm font-medium flex-1">{message}</span>
            <button onClick={onClose} className="text-white/60 hover:text-white text-lg">×</button>
        </motion.div>
    );
}

// ─── Skeleton Loading Components (Bible FE-01 #10) ───
export function SkeletonProfile() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="bg-gradient-to-r from-slate-200 to-slate-100 h-48 rounded-2xl" />
            <div className="flex items-center gap-4 px-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-3 px-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl" />)}
            </div>
            <div className="space-y-3 px-4">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-50 rounded-xl" />)}
            </div>
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="st-card p-4 animate-pulse">
            <div className="h-3 bg-slate-200 rounded w-1/3 mb-3" />
            <div className="h-5 bg-slate-100 rounded w-2/3 mb-2" />
            <div className="h-3 bg-slate-50 rounded w-1/2" />
        </div>
    );
}
