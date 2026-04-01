'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/api';
import { ROUTES } from '@/lib/constants/routes';

/**
 * Mentixy — Auth Guard Hook
 * Replaces the repeated pattern: if (!auth.isLoggedIn()) window.location.href = '/login'
 * 
 * Usage:
 *   const { isReady, user } = useAuthGuard();
 *   if (!isReady) return <LoadingSkeleton />;
 */
export function useAuthGuard(options?: { redirectTo?: string; requireAdmin?: boolean }) {
    const [isReady, setIsReady] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (!auth.isLoggedIn()) {
            window.location.href = options?.redirectTo || ROUTES.LOGIN;
            return;
        }

        const u = auth.getUser();
        if (options?.requireAdmin && !u?.is_admin) {
            window.location.href = ROUTES.DASHBOARD;
            return;
        }

        setUser(u);
        setIsReady(true);
    }, []);

    return { isReady, user };
}

/**
 * Redirect hook for public pages that should redirect logged-in users
 * Replaces: if (auth.isLoggedIn()) window.location.href = '/dashboard'
 */
export function usePublicGuard(redirectTo: string = ROUTES.DASHBOARD) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (auth.isLoggedIn()) {
            window.location.href = redirectTo;
            return;
        }
        setIsReady(true);
    }, []);

    return { isReady };
}
