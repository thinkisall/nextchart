'use client';

import { useMemo } from 'react';
import { CryptoPrice } from '../../../lib/types';
import { useCryptoPrices } from '../../../hooks/useCryptoPrices';
import { useBithumbWebSocket } from '../../../hooks/useBithumbWebSocket';
import { useServerSentEvents } from '../../../hooks/useServerSentEvents';
import { CryptoDataService } from '../services/cryptoDataService';

/**
 * 암호화폐 데이터 통합 관리 훅
 * 여러 데이터 소스를 통합하여 일관된 인터페이스 제공
 */
export function useCryptoData() {
  // REST API 훅
  const { prices, loading, error, refetch } = useCryptoPrices();
  
  // WebSocket 훅 (주요 코인들만)
  const majorCoins = ['BTC_KRW', 'ETH_KRW', 'XRP_KRW', 'ADA_KRW', 'SOL_KRW'];
  const { 
    data: wsData, 
    isConnected: wsConnected, 
    error: wsError,
    reconnect: wsReconnect 
  } = useBithumbWebSocket({ 
    symbols: majorCoins,
    tickTypes: ['24H'] 
  });

  // Server-Sent Events 훅
  const {
    data: sseData,
    isConnected: sseConnected,
    error: sseError,
    lastUpdated: sseLastUpdated,
    reconnect: sseReconnect,
    disconnect: sseDisconnect
  } = useServerSentEvents();

  // 메모이제이션된 데이터 계산
  const primaryData = useMemo(() => {
    return CryptoDataService.selectPrimaryDataSource(sseData, prices);
  }, [sseData, prices]);

  return {
    // 데이터
    primaryData,
    wsData,
    
    // 연결 상태
    sseConnected,
    wsConnected,
    
    // 에러 상태
    sseError,
    wsError,
    restError: error,
    
    // 로딩 상태
    restLoading: loading,
    
    // 액션
    refetch,
    sseReconnect,
    wsReconnect,
    sseDisconnect,
    
    // 메타데이터
    sseLastUpdated
  };
}