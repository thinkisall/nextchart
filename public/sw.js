// Service Worker for 다모아봄 PWA
const CACHE_NAME = 'damoabom-v1.0.0';
const urlsToCache = [
  '/',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // 정적 자산들은 자동으로 Next.js에서 처리됨
];

// Install event - 캐시 설정
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // 새 서비스 워커 즉시 활성화
        return self.skipWaiting();
      })
  );
});

// Activate event - 이전 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // 모든 클라이언트에서 새 서비스 워커 제어
        return self.clients.claim();
      })
  );
});

// Fetch event - 네트워크 우선, 캐시 대체 전략
self.addEventListener('fetch', (event) => {
  // API 요청은 항상 네트워크 우선
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('sse') ||
      event.request.url.includes('bithumb')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // API 실패 시 오프라인 메시지 반환
          return new Response(
            JSON.stringify({
              error: '네트워크 연결을 확인해주세요.',
              offline: true
            }),
            {
              headers: { 'Content-Type': 'application/json' },
              status: 503
            }
          );
        })
    );
    return;
  }

  // 정적 자산들에 대한 캐시 우선 전략
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 캐시 반환, 없으면 네트워크 요청
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then((response) => {
            // 유효한 응답이 아니면 그대로 반환
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답 복사 (응답은 스트림이므로 한 번만 사용 가능)
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // 네트워크 실패 시 기본 오프라인 페이지
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for data updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'crypto-data-sync') {
    event.waitUntil(
      // 백그라운드에서 데이터 동기화 수행
      syncCryptoData()
    );
  }
});

async function syncCryptoData() {
  try {
    // 암호화폐 데이터 동기화 로직
    // 동기화 로직 구현 예정
  } catch (error) {
    // 에러 처리
  }
}

// Push notifications (향후 확장 가능)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || '1'
      },
      actions: [
        {
          action: 'explore',
          title: '확인하기',
          icon: '/icons/check.png'
        },
        {
          action: 'close', 
          title: '닫기',
          icon: '/icons/close.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
