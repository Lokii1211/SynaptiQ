'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wsClient } from '@/lib/ws-client';
import { auth } from '@/lib/api';

interface Toast {
    id: string;
    title: string;
    message: string;
    icon: string;
    type: string;
    action_url?: string;
}

/**
 * Real-time Notification Toast System
 * Shows toast notifications from WebSocket and auto-dismisses after 5s
 * Mount this ONCE in the root layout
 */
export function NotificationToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    const addToast = useCallback((toast: Toast) => {
        setToasts(prev => [...prev.slice(-3), toast]); // Keep max 4 toasts
        // Auto-remove after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    useEffect(() => {
        // Connect WebSocket when user is logged in
        const user = auth.getUser();
        if (!user?.id) return;

        wsClient.connect(user.id);

        const unsub1 = wsClient.on('connected', () => setIsConnected(true));

        const unsub2 = wsClient.on('notification', (msg) => {
            addToast({
                id: `toast-${Date.now()}`,
                title: msg.title || 'Notification',
                message: msg.message || '',
                icon: msg.icon || '🔔',
                type: msg.notification_type || 'info',
                action_url: msg.action_url,
            });
        });

        const unsub3 = wsClient.on('achievement', (msg) => {
            addToast({
                id: `ach-${Date.now()}`,
                title: msg.title || '🏅 Achievement!',
                message: msg.message || '',
                icon: '🏅',
                type: 'achievement',
                action_url: '/achievements',
            });
        });

        const unsub4 = wsClient.on('streak_risk', (msg) => {
            addToast({
                id: `streak-${Date.now()}`,
                title: msg.title || '🔥 Streak at Risk!',
                message: msg.message || '',
                icon: '🔥',
                type: 'streak',
                action_url: '/daily',
            });
        });

        const unsub5 = wsClient.on('system', (msg) => {
            addToast({
                id: `sys-${Date.now()}`,
                title: msg.title || 'Mentixy',
                message: msg.message || '',
                icon: msg.icon || '📢',
                type: 'system',
            });
        });

        return () => {
            unsub1();
            unsub2();
            unsub3();
            unsub4();
            unsub5();
            wsClient.disconnect();
        };
    }, [addToast]);

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 380 }}>
            <AnimatePresence>
                {toasts.map(toast => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 100, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="pointer-events-auto bg-white rounded-xl shadow-xl border border-slate-100 p-4 flex gap-3 cursor-pointer hover:shadow-2xl transition-shadow"
                        onClick={() => {
                            if (toast.action_url) window.location.href = toast.action_url;
                            removeToast(toast.id);
                        }}
                    >
                        <span className="text-2xl flex-shrink-0 mt-0.5">{toast.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{toast.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{toast.message}</p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
                            className="flex-shrink-0 text-slate-300 hover:text-slate-500 transition-colors"
                        >
                            ✕
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
