'use client';

import { useEffect } from 'react';

export function PWAInstaller() {
  useEffect(() => {
    // Service Worker ?±ë¡
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {})
        .catch((registrationError) => {});
    }

    // PWA ?¤ì¹˜ ?„ë¡¬?„íŠ¸ ì²˜ë¦¬
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // ê¸°ë³¸ ë¸Œë¼?°ì? ?„ë¡¬?„íŠ¸ ë°©ì?
      e.preventDefault();
      // ?˜ì¤‘???¬ìš©?˜ê¸° ?„í•´ ?´ë²¤???€??      deferredPrompt = e;
      
      // ?¬ìš©???•ì˜ ?¤ì¹˜ ë²„íŠ¼ ?œì‹œ (? íƒ?¬í•­)
      showInstallButton();
    });

    function showInstallButton() {
      // ?¤ì¹˜ ë²„íŠ¼???œì‹œ?˜ëŠ” ë¡œì§
      const installButton = document.createElement('button');
      installButton.textContent = '???¤ì¹˜?˜ê¸°';
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
      
      // ?´ë? ?¤ì¹˜??ê²½ìš° ë²„íŠ¼ ?œì‹œ?˜ì? ?ŠìŒ
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        document.body.appendChild(installButton);
        
        // 5ì´????ë™?¼ë¡œ ?¨ê?
        setTimeout(() => {
          if (document.body.contains(installButton)) {
            installButton.remove();
          }
        }, 10000);
      }
    }

    // PWAê°€ ?¤ì¹˜?˜ì—ˆ????    window.addEventListener('appinstalled', () => {// ?¤ì¹˜ ?„ë£Œ ??ì²˜ë¦¬ ë¡œì§
    });

    // ?¨ë¼???¤í”„?¼ì¸ ?íƒœ ì²˜ë¦¬
    function updateOnlineStatus() {
      if (navigator.onLine) {// ?¨ë¼???íƒœ UI ?…ë°?´íŠ¸
      } else {// ?¤í”„?¼ì¸ ?íƒœ UI ?…ë°?´íŠ¸
        showOfflineMessage();
      }
    }

    function showOfflineMessage() {
      const offlineMsg = document.createElement('div');
      offlineMsg.textContent = '?¤í”„?¼ì¸ ?íƒœ?…ë‹ˆ?? ?¼ë? ê¸°ëŠ¥???œí•œ?????ˆìŠµ?ˆë‹¤.';
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

    // ì´ˆê¸° ?íƒœ ?•ì¸
    updateOnlineStatus();

    // ?•ë¦¬ ?¨ìˆ˜
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return null; // UI???Œë”ë§í•˜ì§€ ?ŠìŒ
}
