'use client';

import { useEffect } from 'react';

export function PWAInstaller() {
  useEffect(() => {
    // Service Worker ?�록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {})
        .catch((registrationError) => {});
    }

    // PWA ?�치 ?�롬?�트 처리
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // 기본 브라?��? ?�롬?�트 방�?
      e.preventDefault();
      // ?�중???�용?�기 ?�해 ?�벤???�??      deferredPrompt = e;
      
      // ?�용???�의 ?�치 버튼 ?�시 (?�택?�항)
      showInstallButton();
    });

    function showInstallButton() {
      // ?�치 버튼???�시?�는 로직
      const installButton = document.createElement('button');
      installButton.textContent = '???�치?�기';
      installButton.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      installButton.onclick = () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {} else {}
            deferredPrompt = null;
            installButton.remove();
          });
        }
      };
      
      // ?��? ?�치??경우 버튼 ?�시?��? ?�음
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        document.body.appendChild(installButton);
        
        // 5�????�동?�로 ?��?
        setTimeout(() => {
          if (document.body.contains(installButton)) {
            installButton.remove();
          }
        }, 10000);
      }
    }

    // PWA가 ?�치?�었????    window.addEventListener('appinstalled', () => {// ?�치 ?�료 ??처리 로직
    });

    // ?�라???�프?�인 ?�태 처리
    function updateOnlineStatus() {
      if (navigator.onLine) {// ?�라???�태 UI ?�데?�트
      } else {// ?�프?�인 ?�태 UI ?�데?�트
        showOfflineMessage();
      }
    }

    function showOfflineMessage() {
      const offlineMsg = document.createElement('div');
      offlineMsg.textContent = '?�프?�인 ?�태?�니?? ?��? 기능???�한?????�습?�다.';
      offlineMsg.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(offlineMsg);
      
      setTimeout(() => {
        if (document.body.contains(offlineMsg)) {
          offlineMsg.remove();
        }
      }, 5000);
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // 초기 ?�태 ?�인
    updateOnlineStatus();

    // ?�리 ?�수
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return null; // UI???�더링하지 ?�음
}
