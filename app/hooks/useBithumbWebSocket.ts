'use client';

import { useState } from 'react';
import { CryptoPrice } from '../lib/types';

interface WebSocketConfig {
  symbols: string[];
  tickTypes?: string[];
}

export function useBithumbWebSocket(config: WebSocketConfig) {
  const [data] = useState<CryptoPrice[]>([]);
  const [isConnected] = useState(false);
  const [error] = useState<string>('WebSocket 기능은 현재 개발 중입니다. REST API를 사용해주세요.');

  // 비활성화된 함수들
  const reconnect = () => {
    console.log('WebSocket reconnect disabled - using REST API only');
  };

  const disconnect = () => {
    console.log('WebSocket disconnect disabled - using REST API only');
  };

  return {
    data,
    isConnected,
    error,
    reconnect,
    disconnect
  };
}
