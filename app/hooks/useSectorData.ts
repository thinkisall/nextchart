// ?¹í„° ?˜ì´ì§€ ?„ìš© ??- ???ˆì •?ì¸ ?°ì´??ë¡œë”©
'use client';

import { useState, useEffect } from 'react';
import { CryptoPrice } from '../lib/types';
import { useCryptoPrices } from './useCryptoPrices';
import { useServerSentEvents } from './useServerSentEvents';
import { getConsolidatedSectors } from '../lib/crypto/consolidation';

export function useSectorData(sectorName: string) {
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoPrice[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // ?´ë¼?´ì–¸??ì²´í¬
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // ?´ì¤‘ ?°ì´???ŒìŠ¤
  const { prices, loading: restLoading, error: restError, refetch } = useCryptoPrices();
  const { 
    data: sseData, 
    isConnected: sseConnected, 
    error: sseError, 
    reconnect: sseReconnect 
  } = useServerSentEvents();
  
  // ?°ì´???ŒìŠ¤ ?°ì„ ?œìœ„: SSE > REST API
  const displayData = sseData.length > 0 ? sseData : prices;
  const isLoading = sseData.length === 0 && restLoading;
  const error = sseError || restError;
  
  // ?¹í„°ë³??„í„°ë§?  useEffect(() => {
    if (displayData.length > 0) {
      const filtered = displayData.filter(crypto => {
        const originalSector = crypto.sector || 'ê¸°í?';
        const consolidatedSectors = getConsolidatedSectors(originalSector);
        return consolidatedSectors.includes(sectorName);
      });
      
      setFilteredCryptos(filtered);} else {
      setFilteredCryptos([]);
    }
  }, [displayData, sectorName]);
  
  // SSE ?°ê²° ?ë™ ê´€ë¦?  useEffect(() => {
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
    // ?„í„°ë§ëœ ?°ì´??    filteredCryptos,
    
    // ?íƒœ
    isLoading,
    error,
    sseConnected,
    
    // ?„ì²´ ?°ì´???•ë³´
    totalDataCount: displayData.length,
    dataSource: sseData.length > 0 ? 'SSE' : 'REST',
    
    // ?¡ì…˜
    refresh,
    
    // ?”ë²„ê·??•ë³´
    debug: {
      sseDataLength: sseData.length,
      restDataLength: prices.length,
      isClient,
      sectorName
    }
  };
}
