// ?�터 ?�이지 ?�용 ??- ???�정?�인 ?�이??로딩
'use client';

import { useState, useEffect } from 'react';
import { CryptoPrice } from '../lib/types';
import { useCryptoPrices } from './useCryptoPrices';
import { useServerSentEvents } from './useServerSentEvents';
import { getConsolidatedSectors } from '../lib/crypto/consolidation';

export function useSectorData(sectorName: string) {
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoPrice[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // ?�라?�언??체크
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // ?�중 ?�이???�스
  const { prices, loading: restLoading, error: restError, refetch } = useCryptoPrices();
  const { 
    data: sseData, 
    isConnected: sseConnected, 
    error: sseError, 
    reconnect: sseReconnect 
  } = useServerSentEvents();
  
  // ?�이???�스 ?�선?�위: SSE > REST API
  const displayData = sseData.length > 0 ? sseData : prices;
  const isLoading = sseData.length === 0 && restLoading;
  const error = sseError || restError;
  
  // ?�터�??�터�?  useEffect(() => {
    if (displayData.length > 0) {
      const filtered = displayData.filter(crypto => {
        const originalSector = crypto.sector || '기�?';
        const consolidatedSectors = getConsolidatedSectors(originalSector);
        return consolidatedSectors.includes(sectorName);
      });
      
      setFilteredCryptos(filtered);} else {
      setFilteredCryptos([]);
    }
  }, [displayData, sectorName]);
  
  // SSE ?�결 ?�동 관�?  useEffect(() => {
    if (isClient && !sseConnected && sseData.length === 0) {
      const timer = setTimeout(() => {sseReconnect();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isClient, sseConnected, sseData.length, sseReconnect, sectorName]);
  
  const refresh = () => {sseReconnect();
    refetch();
  };
  
  return {
    // ?�터링된 ?�이??    filteredCryptos,
    
    // ?�태
    isLoading,
    error,
    sseConnected,
    
    // ?�체 ?�이???�보
    totalDataCount: displayData.length,
    dataSource: sseData.length > 0 ? 'SSE' : 'REST',
    
    // ?�션
    refresh,
    
    // ?�버�??�보
    debug: {
      sseDataLength: sseData.length,
      restDataLength: prices.length,
      isClient,
      sectorName
    }
  };
}
