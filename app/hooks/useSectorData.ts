// 섹터 페이지 전용 훅 - 더 안정적인 데이터 로딩
'use client';

import { useState, useEffect } from 'react';
import { CryptoPrice } from '../lib/types';
import { useCryptoPrices } from './useCryptoPrices';
import { useServerSentEvents } from './useServerSentEvents';
import { getConsolidatedSectors } from '../lib/crypto/consolidation';

export function useSectorData(sectorName: string) {
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoPrice[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // 클라이언트 체크
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 이중 데이터 소스
  const { prices, loading: restLoading, error: restError, refetch } = useCryptoPrices();
  const { 
    data: sseData, 
    isConnected: sseConnected, 
    error: sseError, 
    reconnect: sseReconnect 
  } = useServerSentEvents();
  
  // 데이터 소스 우선순위: SSE > REST API
  const displayData = sseData.length > 0 ? sseData : prices;
  const isLoading = sseData.length === 0 && restLoading;
  const error = sseError || restError;
  
  // 섹터별 필터링
  useEffect(() => {
    if (displayData.length > 0) {
      const filtered = displayData.filter(crypto => {
        const originalSector = crypto.sector || '기타';
        const consolidatedSectors = getConsolidatedSectors(originalSector);
        return consolidatedSectors.includes(sectorName);
      });
      
      setFilteredCryptos(filtered);
      console.log(`[${sectorName}] 필터링 완료: ${filtered.length}/${displayData.length}`);
    } else {
      setFilteredCryptos([]);
    }
  }, [displayData, sectorName]);
  
  // SSE 연결 자동 관리
  useEffect(() => {
    if (isClient && !sseConnected && sseData.length === 0) {
      const timer = setTimeout(() => {
        console.log(`[${sectorName}] SSE 재연결 시도`);
        sseReconnect();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isClient, sseConnected, sseData.length, sseReconnect, sectorName]);
  
  const refresh = () => {
    console.log(`[${sectorName}] 수동 새로고침 실행`);
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
