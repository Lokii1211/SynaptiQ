/**
 * Mentixy — Notification Client
 * Hybrid approach: tries WebSocket first, falls back to HTTP polling
 * Vercel serverless doesn't support persistent WebSocket connections,
 * so polling is the production-grade solution.
 */

type NotificationType = 'notification' | 'achievement' | 'streak_risk' | 'campus_wars' |
    'recruiter_view' | 'system' | 'typing' | 'connected' | 'pong' | 'online_count' | 'read_confirmed';

interface WSMessage {
    type: NotificationType;
    title?: string;
    message?: string;
    icon?: string;
    action_url?: string;
    notification_type?: string;
    timestamp?: string;
    online_users?: number;
    count?: number;
    from_user_id?: string;
    notification_id?: string;
}

type MessageHandler = (message: WSMessage) => void;

const BACKEND_URL = typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
    ? 'https://mentixy-api.vercel.app'
    : 'http://localhost:8000';

const IS_LOCAL = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

class MentixyNotificationClient {
    private ws: WebSocket | null = null;
    private userId: string = '';
    private listeners: Map<string, Set<MessageHandler>> = new Map();
    private pollInterval: ReturnType<typeof setInterval> | null = null;
    private pollDelay: number = 30000; // 30 seconds
    private lastPollTimestamp: string = '';
    private isConnected: boolean = false;
    private mode: 'ws' | 'poll' | 'none' = 'none';

    /**
     * Connect — tries WebSocket on localhost, uses polling on production
     */
    connect(userId: string): void {
        if (this.isConnected) return;
        this.userId = userId;

        if (IS_LOCAL) {
            this.connectWebSocket();
        } else {
            // Production (Vercel) — use HTTP polling directly
            this.startPolling();
        }
    }

    /**
     * Disconnect and clean up
     */
    disconnect(): void {
        this.isConnected = false;
        this.mode = 'none';

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        this.stopPolling();
    }

    /**
     * Subscribe to a specific message type
     */
    on(type: string, handler: MessageHandler): () => void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type)!.add(handler);

        return () => {
            this.listeners.get(type)?.delete(handler);
        };
    }

    /**
     * Subscribe to ALL messages
     */
    onAny(handler: MessageHandler): () => void {
        return this.on('*', handler);
    }

    /**
     * Send a message (WS only, no-op on polling)
     */
    send(data: Record<string, unknown>): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    /**
     * Mark notification as read
     */
    markRead(notificationId: string): void {
        if (this.mode === 'ws') {
            this.send({ type: 'read_receipt', notification_id: notificationId });
        } else {
            // HTTP fallback
            const token = typeof window !== 'undefined' ? localStorage.getItem('mentixy_token') : null;
            if (token) {
                fetch(`${BACKEND_URL}/api/notifications/${notificationId}/read`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${token}` },
                }).catch(() => { /* silent */ });
            }
        }
    }

    sendTyping(targetUserId: string): void {
        this.send({ type: 'typing', target_user_id: targetUserId });
    }

    getOnlineCount(): void {
        this.send({ type: 'get_online' });
    }

    // ─── WebSocket (localhost only) ───

    private connectWebSocket(): void {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//localhost:8000/api/ws/${this.userId}`;

        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('[Notif] WebSocket connected (local dev)');
                this.isConnected = true;
                this.mode = 'ws';
            };

            this.ws.onmessage = (event: MessageEvent) => {
                try {
                    const message: WSMessage = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (e) {
                    console.warn('[Notif] Failed to parse WS message:', e);
                }
            };

            this.ws.onclose = () => {
                this.isConnected = false;
                // Don't reconnect WS — fall back to polling
                console.log('[Notif] WebSocket closed, falling back to polling');
                this.startPolling();
            };

            this.ws.onerror = () => {
                console.log('[Notif] WebSocket unavailable, using HTTP polling');
                this.ws = null;
                this.startPolling();
            };
        } catch {
            this.startPolling();
        }
    }

    // ─── HTTP Polling (production) ───

    private startPolling(): void {
        if (this.pollInterval) return; // already polling

        this.isConnected = true;
        this.mode = 'poll';
        this.lastPollTimestamp = new Date().toISOString();

        console.log('[Notif] Using HTTP polling (30s interval)');

        // Initial poll immediately
        this.pollNotifications();

        // Then every 30 seconds
        this.pollInterval = setInterval(() => {
            this.pollNotifications();
        }, this.pollDelay);
    }

    private stopPolling(): void {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    private async pollNotifications(): Promise<void> {
        const token = typeof window !== 'undefined' ? localStorage.getItem('mentixy_token') : null;
        if (!token) return;

        try {
            const res = await fetch(`${BACKEND_URL}/api/notifications/?unread_only=true&limit=10`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!res.ok) return;

            const data = await res.json();
            const notifications = Array.isArray(data) ? data : (data.notifications || []);

            // Process new notifications
            for (const notif of notifications) {
                const message: WSMessage = {
                    type: 'notification',
                    title: notif.title || 'Mentixy',
                    message: notif.message || notif.content || '',
                    icon: notif.icon || '🔔',
                    action_url: notif.action_url || notif.link || '',
                    notification_type: notif.notification_type || notif.type || 'general',
                    notification_id: notif.id,
                    timestamp: notif.created_at || notif.timestamp,
                };
                this.handleMessage(message);
            }
        } catch {
            // Silent fail — will retry on next interval
        }
    }

    // ─── Message Handling ───

    private handleMessage(message: WSMessage): void {
        // Trigger type-specific listeners
        const typeListeners = this.listeners.get(message.type);
        if (typeListeners) {
            typeListeners.forEach(handler => handler(message));
        }

        // Trigger wildcard listeners
        const anyListeners = this.listeners.get('*');
        if (anyListeners) {
            anyListeners.forEach(handler => handler(message));
        }

        // Show browser notification for important types
        if (['notification', 'achievement', 'streak_risk', 'recruiter_view'].includes(message.type)) {
            this.showBrowserNotification(message);
        }
    }

    private showBrowserNotification(message: WSMessage): void {
        if (typeof window === 'undefined' || !('Notification' in window)) return;

        if (Notification.permission === 'granted') {
            const notification = new Notification(message.title || 'Mentixy', {
                body: message.message || '',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
                tag: message.notification_type || 'mentixy',
            });

            notification.onclick = () => {
                window.focus();
                if (message.action_url) {
                    window.location.href = message.action_url;
                }
                notification.close();
            };
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }
}

// Singleton instance
export const wsClient = new MentixyNotificationClient();
