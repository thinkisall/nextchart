'use client';

import { useEffect } from 'react';

export function PWAInstaller() {
  useEffect(() => {
    // Service Worker 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // PWA 설치 프롬프트 처리
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // 기본 브라우저 프롬프트 방지
      e.preventDefault();
      // 나중에 사용하기 위해 이벤트 저장
      deferredPrompt = e;
      
      // 사용자 정의 설치 버튼 표시 (선택사항)
      showInstallButton();
    });

    function showInstallButton() {
      // 설치 버튼을 표시하는 로직
      const installButton = document.createElement('button');
      installButton.textContent = '앱 설치하기';
      installButton.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      installButton.onclick = () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('사용자가 PWA 설치를 수락했습니다');
            } else {
              console.log('사용자가 PWA 설치를 거부했습니다');
            }
            deferredPrompt = null;
            installButton.remove();
          });
        }
      };
      
      // 이미 설치된 경우 버튼 표시하지 않음
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        document.body.appendChild(installButton);
        
        // 5초 후 자동으로 숨김
        setTimeout(() => {
          if (document.body.contains(installButton)) {
            installButton.remove();
          }
        }, 10000);
      }
    }

    // PWA가 설치되었을 때
    window.addEventListener('appinstalled', () => {
      console.log('PWA가 설치되었습니다!');
      // 설치 완료 후 처리 로직
    });

    // 온라인/오프라인 상태 처리
    function updateOnlineStatus() {
      if (navigator.onLine) {
        console.log('온라인 상태입니다');
        // 온라인 상태 UI 업데이트
      } else {
        console.log('오프라인 상태입니다');
        // 오프라인 상태 UI 업데이트
        showOfflineMessage();
      }
    }

    function showOfflineMessage() {
      const offlineMsg = document.createElement('div');
      offlineMsg.textContent = '오프라인 상태입니다. 일부 기능이 제한될 수 있습니다.';
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
