/**
 * Mentixy — Service Worker
 * Handles offline caching, background sync, and push notifications
 */

const CACHE_NAME = 'mentixy-v1';
const OFFLINE_URL = '/offline';

// Static assets to pre-cache
const PRECACHE_URLS = [
    '/',
    '/dashboard',
    '/login',
    '/signup',
    '/manifest.json',
    '/offline',
];

// Install — pre-cache critical assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
    );
    self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip API calls (let them fail naturally)
    if (event.request.url.includes('/api/')) return;

    // Skip browser extension requests
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Return cached version if available
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;

                    // For navigation requests, show offline page
                    if (event.request.mode === 'navigate') {
                        return caches.match(OFFLINE_URL);
                    }

                    return new Response('Offline', {
                        status: 503,
                        statusText: 'Service Unavailable',
                    });
                });
            })
    );
});

// Push notification handler
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Mentixy';
    const options = {
        body: data.message || 'You have a new notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: data.tag || 'mentixy-notification',
        data: { url: data.action_url || '/dashboard' },
        actions: [
            { action: 'open', title: 'Open' },
            { action: 'dismiss', title: 'Dismiss' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'dismiss') return;

    const url = event.notification.data?.url || '/dashboard';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
            // Focus existing window or open new one
            for (const client of clients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            return self.clients.openWindow(url);
        })
    );
});
