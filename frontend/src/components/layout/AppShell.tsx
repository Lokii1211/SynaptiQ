'use client';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

/**
 * AppShell — Standard layout wrapper for all authenticated pages.
 * Replaces the old SideNav + TopBar + BottomNav pattern.
 * 
 * Usage:
 *   <AppShell>
 *     <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
 *       ... page content ...
 *     </div>
 *   </AppShell>
 */
export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <main className="pb-24 lg:pb-8">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
