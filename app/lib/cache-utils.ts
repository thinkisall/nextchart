/**
 * 개발 환경에서 브라우저 캐시 무력화 유틸리티
 */

export function clearAllCaches() {
  // localStorage 클리어
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
    
    // Service Worker 캐시 클리어
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    console.log('🧹 All caches cleared');
  }
}

export function addTimestamp(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}`;
}

export function forceReload() {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}
