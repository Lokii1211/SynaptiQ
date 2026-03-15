/**
 * Mentixy — India-specific helpers
 */

/** Format salary in LPA (Lakhs Per Annum) */
export function formatLPA(lpa: number): string {
    if (lpa >= 100) return `₹${(lpa / 100).toFixed(1)} Cr`;
    return `₹${lpa} LPA`;
}

/** Format salary range */
export function formatSalaryRange(min?: number, max?: number): string {
    if (!min && !max) return 'Not disclosed';
    if (min && max) return `${formatLPA(min)} - ${formatLPA(max)}`;
    if (min) return `${formatLPA(min)}+`;
    return `Up to ${formatLPA(max!)}`;
}

/** Format in-hand monthly salary from annual CTC */
export function formatMonthly(lpa: number): string {
    const monthly = Math.round((lpa * 100000) / 12);
    if (monthly >= 100000) return `₹${(monthly / 100000).toFixed(1)}L/mo`;
    return `₹${(monthly / 1000).toFixed(0)}K/mo`;
}

/** College tier label */
export function tierLabel(tier: number): string {
    switch (tier) {
        case 1: return 'Tier 1 (IIT/NIT/BITS)';
        case 2: return 'Tier 2';
        case 3: return 'Tier 3';
        default: return `Tier ${tier}`;
    }
}

/** Format large numbers Indian style (1,00,000 format) */
export function formatIndianNumber(num: number): string {
    const str = num.toString();
    let result = '';
    let count = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
            result = ',' + result;
        }
        result = str[i] + result;
        count++;
    }
    return result;
}

/** Time ago (e.g., "2 days ago") */
export function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Difficulty color classes */
export function difficultyColor(difficulty: string): string {
    switch (difficulty?.toLowerCase()) {
        case 'easy': return 'bg-green-50 text-green-700 border-green-200';
        case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case 'hard': return 'bg-red-50 text-red-700 border-red-200';
        default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
}

/** Match score color */
export function matchColor(score: number): string {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-indigo-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-500';
}
