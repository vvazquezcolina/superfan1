// MAKÉ Repostería - Service Worker for Offline Performance
// Version 1.0

const CACHE_NAME = 'make-v1.0';
const STATIC_CACHE = 'make-static-v1.0';
const IMAGE_CACHE = 'make-images-v1.0';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/menu',
  '/manifest.json'
];

// Critical images to cache (homepage products)
const CRITICAL_IMAGES = [
  '/images-optimized/brownies/brownie-nutella-20x20-1.jpg',
  '/images-optimized/cheesecakes/cheesecake-lotus-1.jpg',
  '/images-optimized/pasteles/red-velvet-1.jpg',
  '/images-optimized/pasteles/aleman-1.jpg'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('🔧 SW: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical pages
      caches.open(STATIC_CACHE).then(cache => 
        cache.addAll(CRITICAL_RESOURCES)
      ),
      // Cache critical images
      caches.open(IMAGE_CACHE).then(cache => 
        cache.addAll(CRITICAL_IMAGES)
      )
    ]).then(() => {
      console.log('✅ SW: Critical resources cached');
      self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 SW: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('🗑️ SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ SW: Cache cleanup complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (except images)
  if (url.origin !== location.origin && !url.pathname.includes('/images')) {
    return;
  }

  // Strategy for different resource types
  if (url.pathname.includes('/images-optimized/')) {
    // Images: Cache First with fallback
    event.respondWith(cacheFirstImages(request));
  } else if (url.pathname.includes('/api/')) {
    // API: Network First
    event.respondWith(networkFirst(request));
  } else {
    // Pages: Network First with cache fallback
    event.respondWith(networkFirstPages(request));
  }
});

// Cache First strategy for images
async function cacheFirstImages(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    // Cache successful image responses
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🔍 SW: Image fetch failed:', request.url);
    // Return a fallback image or placeholder
    return new Response('', { status: 404 });
  }
}

// Network First strategy for pages
async function networkFirstPages(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful page responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🔍 SW: Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page if available
    return caches.match('/offline.html') || new Response('Offline', { status: 503 });
  }
}

// Network First strategy for API calls
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('🔍 SW: API call failed:', request.url);
    return new Response(JSON.stringify({ error: 'Network unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  console.log('🔄 SW: Background sync:', event.tag);
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncOfflineCart());
  }
});

// Sync offline cart data when back online
async function syncOfflineCart() {
  try {
    // Implementation for syncing offline cart data
    console.log('📦 SW: Syncing offline cart data...');
  } catch (error) {
    console.error('❌ SW: Cart sync failed:', error);
  }
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  console.log('📢 SW: Push received:', event);
  
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png'
      })
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_STATUS') {
    caches.keys().then(cacheNames => {
      const status = {
        caches: cacheNames,
        timestamp: Date.now()
      };
      event.ports[0].postMessage(status);
    });
  }
}); 