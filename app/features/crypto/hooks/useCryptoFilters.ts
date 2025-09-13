'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { CryptoPrice } from '../../../lib/types';
import { CryptoDataService } from '../services/cryptoDataService';

/**
 * 암호화폐 필터링 관리 훅
 * 필터링 상태와 로직을 분리하여 관리
 */
export function useCryptoFilters(primaryData: CryptoPrice[]) {
  const [filteredData, setFilteredData] = useState<CryptoPrice[]>([]);

  // 필터링 데이터 변경 핸들러
  const handleFilteredDataChange = useCallback((filtered: CryptoPrice[]) => {
    setFilteredData(filtered);
  }, []);

  // 최종 표시 데이터 계산
  const finalDisplayData = useMemo(() => {
    return CryptoDataService.selectDisplayData(filteredData, primaryData);
  }, [filteredData, primaryData]);

  // 시장 통계 계산
  const marketStats = useMemo(() => {
    return CryptoDataService.calculateMarketStats(primaryData, finalDisplayData);
  }, [primaryData, finalDisplayData]);

  // Virtual Scrolling 사용 여부
  const shouldUseVirtualScrolling = useMemo(() => {
    return CryptoDataService.shouldUseVirtualScrolling(finalDisplayData.length);
  }, [finalDisplayData.length]);

  // 초기 필터 데이터 설정
  useEffect(() => {
    if (primaryData.length > 0 && filteredData.length === 0) {
      setFilteredData(primaryData);
    }
  }, [primaryData, filteredData.length]);

  return {
    filteredData,
    finalDisplayData,
    marketStats,
    shouldUseVirtualScrolling,
    handleFilteredDataChange
  };
}