// 섹터 페이지 전용 훅 - 더 안정적인 데이터 로딩
'use client';

import { useState, useEffect } from 'react';
import { CryptoPrice } from '../lib/types';
import { useCryptoPrices } from './useCryptoPrices';
import { useServerSentEvents } from './useServerSentEvents';
import { getConsolidatedSector } from '../lib/crypto/consolidation';

export function useSectorData(sectorName: string) {
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoPrice[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // REST API 훅
  const { prices, loading: isLoading, error, refetch } = useCryptoPrices();
  
  // SSE 훅
  const { 
    data: sseData, 
    isConnected: sseConnected, 
    reconnect: sseReconnect 
  } = useServerSentEvents();
  
  // 클라이언트 사이드에서만 실행
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 우선순위: SSE > REST API
  const displayData = sseData.length > 0 ? sseData : prices;
  
  // 섹터별 필터링
  useEffect(() => {
    if (displayData.length > 0) {
      const filtered = displayData.filter(crypto => {
        const consolidatedSector = getConsolidatedSector(crypto.sector || '기타');
        return consolidatedSector === sectorName || crypto.sector === sectorName;
      });
      setFilteredCryptos(filtered);
    } else {
      setFilteredCryptos([]);
    }
  }, [displayData, sectorName]);
  
  // SSE 연결 자동 관리
  useEffect(() => {
    if (isClient && !sseConnected && sseData.length === 0) {
      const timer = setTimeout(() => {
        sseReconnect();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isClient, sseConnected, sseData.length, sseReconnect, sectorName]);
  
  const refresh = () => {
    sseReconnect();
    refetch();
  };
  
  return {
    // 필터링된 데이터
    filteredCryptos,
    
    // 상태
    isLoading,
    error,
    sseConnected,
    
    // 전체 데이터 정보
    totalDataCount: displayData.length,
    dataSource: sseData.length > 0 ? 'SSE' : 'REST',
    
    // 액션
    refresh,
    
    // 디버그 정보
    debug: {
      sseDataLength: sseData.length,
      restDataLength: prices.length,
      isClient,
      sectorName
    }
  };
}
