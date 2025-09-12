'use client';

import { useEffect } from 'react';

export function PWAInstaller() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Service worker 등록 성공
        })
        .catch((registrationError) => {
          // Service worker 등록 실패
        });
    }

    // PWA 설치 프롬프트 처리
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // 기본 브라우저 프롬프트 방지
      e.preventDefault();
      deferredPrompt = e;
      
      // 커스텀 설치 버튼 생성
      const installButton = document.createElement('button');
      installButton.textContent = 'PWA 설치';
      installButton.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      
      installButton.onclick = async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const choiceResult = await deferredPrompt.userChoice;
          
          if (choiceResult.outcome === 'accepted') {
            // 사용자가 PWA 설치를 승인했습니다
          } else {
            // 사용자가 PWA 설치를 거부했습니다
          }
          
          deferredPrompt = null;
          installButton.remove();
        }
      };
      
      // 아직 설치되지 않은 경우 버튼 표시
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        document.body.appendChild(installButton);
      }
    });

    // PWA가 설치된 후 처리
    window.addEventListener('appinstalled', () => {
      // PWA가 설치되었습니다!
    });

    // 온라인/오프라인 상태 감지
    function updateOnlineStatus() {
      if (navigator.onLine) {
        // 온라인 상태
      } else {
        // 오프라인 상태
        showOfflineMessage();
      }
    }

    function showOfflineMessage() {
      const offlineMsg = document.createElement('div');
      offlineMsg.textContent = '오프라인 상태입니다. 일부 기능이 제한될 수 있습니다.';
      offlineMsg.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(offlineMsg);
      
      setTimeout(() => {
        if (offlineMsg.parentNode) {
          offlineMsg.parentNode.removeChild(offlineMsg);
        }
      }, 5000);
    }

    // 이벤트 리스너 등록
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // 초기 상태 확인
    updateOnlineStatus();

    // 정리 함수
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return null; // UI는 렌더링하지 않음
}
