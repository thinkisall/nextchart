'use client';

import { useState, useEffect } from 'react';
import { CryptoPrice } from '../lib/types';

interface PriceAlert {
  id: string;
  symbol: string;
  type: 'above' | 'below';
  price: number;
  isActive: boolean;
}

export function usePriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // 알림 권한 요청
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    }
    return false;
  };

  // 알림 전송
  const sendNotification = (title: string, message: string, icon?: string) => {
    if (notificationPermission === 'granted') {
      new Notification(title, {
        body: message,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'crypto-alert'
      });
    }
  };

  // 가격 알림 추가
  const addAlert = (symbol: string, type: 'above' | 'below', price: number) => {
    const newAlert: PriceAlert = {
      id: `${symbol}-${type}-${price}-${Date.now()}`,
      symbol,
      type,
      price,
      isActive: true
    };
    
    setAlerts(prev => [...prev, newAlert]);
    return newAlert.id;
  };

  // 알림 제거
  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // 알림 토글
  const toggleAlert = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  // 가격 변동 체크 및 알림 발송
  const checkPriceAlerts = (currentPrices: CryptoPrice[]) => {
    alerts.forEach(alert => {
      if (!alert.isActive) return;

      const currentPrice = currentPrices.find(p => p.symbol === alert.symbol);
      if (!currentPrice) return;

      const shouldAlert = 
        (alert.type === 'above' && currentPrice.current_price >= alert.price) ||
        (alert.type === 'below' && currentPrice.current_price <= alert.price);

      if (shouldAlert) {
        const direction = alert.type === 'above' ? '상승' : '하락';
        const formattedPrice = new Intl.NumberFormat('ko-KR', {
          style: 'currency',
          currency: 'KRW'
        }).format(alert.price);

        sendNotification(
          `${currentPrice.korean_name} 가격 알림`,
          `${direction} 목표가 도달: ${formattedPrice}`
        );

        // 알림 발송 후 비활성화 (중복 방지)
        toggleAlert(alert.id);
      }
    });
  };

  // 초기 권한 상태 확인
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  return {
    alerts,
    notificationPermission,
    requestNotificationPermission,
    addAlert,
    removeAlert,
    toggleAlert,
    checkPriceAlerts
  };
}
