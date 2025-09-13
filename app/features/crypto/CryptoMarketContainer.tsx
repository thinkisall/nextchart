'use client';

import { useState, useEffect, useCallback } from 'react';
import { CryptoPrice } from '../../lib/types';
import { useFavorites } from '../../hooks/useFavorites';
import { useCryptoData } from './hooks/useCryptoData';
import { useCryptoFilters } from './hooks/useCryptoFilters';
import { useConnectionManager } from './hooks/useConnectionManager';
import { CryptoMarketView } from './CryptoMarketView';

/**
 * CryptoMarket 컨테이너 컴포넌트
 * 비즈니스 로직과 상태 관리를 담당
 * UI 렌더링은 CryptoMarketView에 위임
 */
export function CryptoMarketContainer() {
  const [isClient, setIsClient] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CryptoPrice | null>(null);

  // 클라이언트 사이드에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 즐겨찾기 관리
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  // 통합 데이터 관리
  const {
    primaryData,
    sseError,
    refetch,
    sseReconnect
  } = useCryptoData();

  // 필터링 관리
  const {
    finalDisplayData,
    shouldUseVirtualScrolling,
    handleFilteredDataChange
  } = useCryptoFilters(primaryData);

  // 연결 상태 관리
  const { handleRefresh } = useConnectionManager({
    sseConnected: true, // 단순화: 연결 상태 표시 안함
    sseDataLength: primaryData.length,
    sseReconnect,
    isClient
  });

  // 이벤트 핸들러들
  const handleCryptoClick = useCallback((crypto: CryptoPrice) => {
    setSelectedCoin(crypto);
  }, []);

  const handleCloseCoinInfo = useCallback(() => {
    setSelectedCoin(null);
  }, []);

  const handleRefreshData = useCallback(() => {
    refetch();
    handleRefresh();
  }, [refetch, handleRefresh]);

  // 디버깅용 로그 제거 - 프로덕션에서는 불필요
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development' && primaryData.length > 0) {
  //     console.log('🔄 CryptoMarket: Primary data updated at', 
  //       new Date().toLocaleTimeString(), 'count:', primaryData.length);
  //   }
  // }, [primaryData]);

  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development' && finalDisplayData.length > 0) {
  //     console.log('📱 CryptoMarket: Final display data updated at', 
  //       new Date().toLocaleTimeString(), 'count:', finalDisplayData.length);
  //   }
  // }, [finalDisplayData]);

  // UI 컴포넌트에 props 전달
  return (
    <CryptoMarketView
      // 데이터
      primaryData={primaryData}
      finalDisplayData={finalDisplayData}
      favorites={favorites}
      
      // 상태
      sseError={sseError}
      shouldUseVirtualScrolling={shouldUseVirtualScrolling}
      selectedCoin={selectedCoin}
      
      // 이벤트 핸들러
      onFilteredDataChange={handleFilteredDataChange}
      onCryptoClick={handleCryptoClick}
      onToggleFavorite={toggleFavorite}
      isFavorite={isFavorite}
      onRefresh={handleRefreshData}
      onCloseCoinInfo={handleCloseCoinInfo}
    />
  );
}