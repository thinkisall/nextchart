'use client';

import { useState, useEffect, useCallback } from 'react';

interface ConnectionManagerProps {
  sseConnected: boolean;
  sseDataLength: number;
  sseReconnect: () => void;
  isClient: boolean;
}

/**
 * 연결 상태 관리 훅
 * SSE, WebSocket 연결 상태를 모니터링하고 자동 재연결 처리
 */
export function useConnectionManager({
  sseConnected,
  sseDataLength,
  sseReconnect,
  isClient
}: ConnectionManagerProps) {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 새로고침 핸들러
  const handleRefresh = useCallback(() => {
    if (isClient) {
      setLastUpdated(new Date());
    }
  }, [isClient]);

  // SSE 연결 관리 - 연결이 끊어졌을 때 자동 재연결 시도
  useEffect(() => {
    if (isClient && !sseConnected && sseDataLength === 0) {
      const timer = setTimeout(() => {
        if (!sseConnected) {
          sseReconnect();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isClient, sseConnected, sseDataLength, sseReconnect]);

  // 클라이언트 초기화
  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  return {
    lastUpdated,
    handleRefresh
  };
}