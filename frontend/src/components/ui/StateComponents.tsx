'use client';

/**
 * Mentixy — Reusable Loading, Error, and Empty State Components
 * Phase 1-03: Every page must handle loading / empty / error states
 */

// ═══════════ LOADING SKELETON ═══════════
interface SkeletonProps {
    variant?: 'card' | 'list' | 'profile' | 'inline';
    count?: number;
}

export function LoadingSkeleton({ variant = 'card', count = 3 }: SkeletonProps) {
    const items = Array.from({ length: count }, (_, i) => i);
    
    if (variant === 'profile') {
        return (
            <div className="animate-pulse space-y-4 p-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                        <div className="h-3 bg-slate-100 rounded w-1/4" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl" />)}
                </div>
            </div>
        );
    }

    if (variant === 'list') {
        return (
            <div className="animate-pulse space-y-2">
                {items.map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl">
                        <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-1.5">
                            <div className="h-3.5 bg-slate-200 rounded w-2/3" />
                            <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                        </div>
                        <div className="w-12 h-6 bg-slate-100 rounded-lg" />
                    </div>
                ))}
            </div>
        );
    }

    if (variant === 'inline') {
        return (
            <div className="animate-pulse flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-200 rounded" />
                <div className="h-3 bg-slate-200 rounded w-20" />
            </div>
        );
    }

    // Default: card
    return (
        <div className="space-y-4">
            {items.map(i => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-1/3" />
                            <div className="h-3 bg-slate-100 rounded w-1/2" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-full" />
                        <div className="h-3 bg-slate-100 rounded w-4/5" />
                        <div className="h-3 bg-slate-100 rounded w-3/5" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ═══════════ ERROR STATE ═══════════
interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">Oops!</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-xs">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}

// ═══════════ EMPTY STATE ═══════════
interface EmptyStateProps {
    icon?: string;
    title: string;
    subtitle?: string;
    cta?: string;
    ctaAction?: () => void;
    ctaHref?: string;
}

export function EmptyState({ icon = '📭', title, subtitle, cta, ctaAction, ctaHref }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500 mb-6 max-w-xs">{subtitle}</p>}
            {cta && ctaAction && (
                <button
                    onClick={ctaAction}
                    className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    {cta}
                </button>
            )}
            {cta && ctaHref && (
                <a
                    href={ctaHref}
                    className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm inline-block"
                >
                    {cta}
                </a>
            )}
        </div>
    );
}
