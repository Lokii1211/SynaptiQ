/**
 * SkillTen — WebSocket Notification Client
 * Real-time connection to backend WebSocket hub
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

class SkillTenWebSocket {
    private ws: WebSocket | null = null;
    private userId: string = '';
    private listeners: Map<string, Set<MessageHandler>> = new Map();
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 10;
    private reconnectDelay: number = 1000;
    private pingInterval: ReturnType<typeof setInterval> | null = null;
    private isConnecting: boolean = false;

    /**
     * Connect to the WebSocket server
     */
    connect(userId: string): void {
        if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) return;

        this.userId = userId;
        this.isConnecting = true;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const backendHost = isLocal ? 'localhost:8000' : 'skillten.vercel.app';
        const wsUrl = `${protocol}//${backendHost}/api/ws/${userId}`;

        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('[WS] Connected to SkillTen notifications');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.startPing();
            };

            this.ws.onmessage = (event: MessageEvent) => {
                try {
                    const message: WSMessage = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (e) {
                    console.warn('[WS] Failed to parse message:', e);
                }
            };

            this.ws.onclose = () => {
                this.isConnecting = false;
                this.stopPing();
                this.reconnect();
            };

            this.ws.onerror = () => {
                this.isConnecting = false;
                console.warn('[WS] Connection error');
            };
        } catch (e) {
            this.isConnecting = false;
            console.warn('[WS] Failed to connect:', e);
        }
    }

    /**
     * Disconnect from WebSocket
     */
    disconnect(): void {
        this.stopPing();
        this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    /**
     * Subscribe to a specific message type
     */
    on(type: string, handler: MessageHandler): () => void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type)!.add(handler);

        // Return unsubscribe function
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
     * Send a message to the server
     */
    send(data: Record<string, unknown>): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    /**
     * Send typing indicator
     */
    sendTyping(targetUserId: string): void {
        this.send({ type: 'typing', target_user_id: targetUserId });
    }

    /**
     * Mark notification as read via WS
     */
    markRead(notificationId: string): void {
        this.send({ type: 'read_receipt', notification_id: notificationId });
    }

    /**
     * Get online user count
     */
    getOnlineCount(): void {
        this.send({ type: 'get_online' });
    }

    // ─── Private ───

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
            const notification = new Notification(message.title || 'SkillTen', {
                body: message.message || '',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
                tag: message.notification_type || 'skillten',
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

    private reconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

        this.reconnectAttempts++;
        const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);
        console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

        setTimeout(() => {
            if (this.userId) {
                this.connect(this.userId);
            }
        }, delay);
    }

    private startPing(): void {
        this.stopPing();
        this.pingInterval = setInterval(() => {
            this.send({ type: 'ping' });
        }, 30000);
    }

    private stopPing(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }
}

// Singleton instance
export const wsClient = new SkillTenWebSocket();
