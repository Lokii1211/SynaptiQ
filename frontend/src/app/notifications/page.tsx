'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, auth } from '@/lib/api';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { SideNav } from '@/components/layout/SideNav';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.isLoggedIn()) { window.location.href = '/login'; return; }
        api.getNotifications().then(data => {
            setNotifications(data.notifications || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <SideNav />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 pb-24 md:pb-8">
                    <div className="bg-white border-b border-slate-200 px-6 py-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">🔔 Notifications</h1>
                            <p className="text-slate-500 text-sm">{notifications.length} notifications</p>
                        </div>
                        {notifications.length > 0 && (
                            <button onClick={() => api.markAllRead().then(() => setNotifications([]))}
                                className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="px-4 md:px-6 py-6 max-w-3xl mx-auto space-y-2">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="st-card p-4 animate-pulse h-16" />)
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-16">
                                <span className="text-5xl block mb-4">🔔</span>
                                <p className="text-slate-500 text-lg">All caught up!</p>
                                <p className="text-slate-400 text-sm">No new notifications</p>
                            </div>
                        ) : (
                            notifications.map((n: any, i: number) => (
                                <motion.div key={n.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={`st-card p-4 ${!n.read ? 'border-l-4 border-l-indigo-500' : ''}`}
                                >
                                    <p className="text-sm text-slate-900">{n.message || n.title}</p>
                                    <p className="text-xs text-slate-400 mt-1">{n.created_at}</p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </main>
                <BottomNav />
            </div>
        </div>
    );
}
