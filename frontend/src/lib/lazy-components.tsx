/**
 * SkillTen — Dynamic Component Loader
 * Performance optimization via code splitting
 * Heavy components are loaded on demand to reduce initial bundle size
 */
import dynamic from 'next/dynamic';

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
);

// ─── Lazy-loaded heavy components ───

/**
 * ShareableCard — only loaded when user clicks "Share"
 * Saves ~6KB from initial bundle
 */
export const LazyShareableCard = dynamic(
    () => import('@/components/ShareableCard').then(mod => mod.ShareableCard),
    { loading: LoadingFallback, ssr: false }
);
