/**
 * SkillTen — Performance Monitoring
 * Tracks Core Web Vitals and custom metrics
 */

interface PerformanceMetric {
    name: string;
    value: number;
    delta: number;
    id: string;
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: PerformanceMetric) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        const colorMap: Record<string, string> = {
            LCP: '#2563EB',      // Largest Contentful Paint
            FID: '#059669',      // First Input Delay
            CLS: '#D97706',      // Cumulative Layout Shift
            FCP: '#7C3AED',      // First Contentful Paint
            TTFB: '#DC2626',     // Time to First Byte
            INP: '#0891B2',      // Interaction to Next Paint
        };

        console.log(
            `%c[Web Vital] ${metric.name}: ${Math.round(metric.value)}`,
            `color: ${colorMap[metric.name] || '#6B7280'}; font-weight: bold;`
        );
    }

    // Send to analytics endpoint (when backend supports it)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        try {
            const body = JSON.stringify({
                name: metric.name,
                value: Math.round(metric.value),
                delta: Math.round(metric.delta),
                id: metric.id,
                page: window.location.pathname,
                timestamp: Date.now(),
            });

            // Use sendBeacon for reliable delivery
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/analytics/vitals', body);
            }
        } catch {
            // Silent fail — never crash the app for analytics
        }
    }
}

/**
 * Track page load time
 */
export function trackPageLoad() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
        const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (timing) {
            const loadTime = Math.round(timing.loadEventEnd - timing.startTime);
            console.log(`%c[Perf] Page load: ${loadTime}ms`, 'color: #2563EB; font-weight: bold;');
        }
    });
}

/**
 * Track component render time
 */
export function measureRender(componentName: string) {
    const start = performance.now();
    return () => {
        const duration = Math.round(performance.now() - start);
        if (duration > 100) {
            console.warn(`[Perf] Slow render: ${componentName} took ${duration}ms`);
        }
    };
}
