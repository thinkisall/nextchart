'use client';

import { useState, useEffect, useCallback } from 'react';
import { CryptoPrice } from '../../lib/types';
import { useCryptoPrices } from '../../hooks/useCryptoPrices';
import { useBithumbWebSocket } from '../../hooks/useBithumbWebSocket';
import { useServerSentEvents } from '../../hooks/useServerSentEvents';
import { usePriceAlerts } from '../../hooks/usePriceAlerts';
import { useFavorites } from '../../hooks/useFavorites';
import { CryptoTable } from '../../components/organisms/CryptoTable';
import { RefreshControl } from '../../components/molecules/RefreshControl';
import { PriceAlertPanel } from '../../components/organisms/PriceAlertPanel';
import { PerformanceMonitor } from '../../components/molecules/PerformanceMonitor';
import { CryptoFilter } from '../../components/molecules/CryptoFilter';
import { CSVExportButton } from '../../components/atoms/CSVExportButton';
import { AdvancedCSVExport } from '../../components/molecules/AdvancedCSVExport';
import { SectorStats } from '../../components/organisms/SectorStats';
import { ClientOnly } from '../../hooks/useIsClient';

export function CryptoMarket() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filteredData, setFilteredData] = useState<CryptoPrice[]>([]);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
    setLastUpdated(new Date());
  }, []);

  // 즐겨찾기 훅
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  // REST API 훅
  const { prices, loading, error, refetch } = useCryptoPrices();
  
  // WebSocket 훅 (주요 코인들만)
  const majorCoins = ['BTC_KRW', 'ETH_KRW', 'XRP_KRW', 'ADA_KRW', 'SOL_KRW'];
  const { 
    data: wsData, 
    isConnected, 
    error: wsError,
    reconnect 
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

  // 업비트 WebSocket 훅 (실제 작동)
  // 가격 알림 훅
  const { checkPriceAlerts } = usePriceAlerts();

  const handleRefresh = () => {
    refetch();
    if (isClient) {
      setLastUpdated(new Date());
    }
  };

  const handleCryptoClick = (crypto: CryptoPrice) => {
    console.log('Selected crypto:', crypto);
    // 여기에 상세 페이지 이동 또는 모달 표시 로직 추가
  };

  const handleFilteredDataChange = useCallback((filtered: CryptoPrice[]) => {
    setFilteredData(filtered);
  }, []);

  // 컴포넌트 마운트 시 SSE 연결 확인만 수행
  useEffect(() => {
    if (isClient && !sseConnected && sseData.length === 0) {
      console.log('메인 페이지: SSE 연결 상태 확인');
      // 연결이 안 되어 있으면 재연결 시도
      const timer = setTimeout(() => {
        if (!sseConnected) {
          console.log('메인 페이지: SSE 재연결 시도');
          sseReconnect();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isClient, sseConnected, sseData.length, sseReconnect]);

  // 데이터 소스는 SSE로 고정
  const displayData = sseData.length > 0 ? sseData : prices;
  const finalDisplayData = filteredData.length > 0 ? filteredData : displayData;
  const isLoading = false; // SSE는 로딩 상태가 없음

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log('=== 메인 페이지 데이터 상태 ===');
    console.log('sseData.length:', sseData.length);
    console.log('prices.length:', prices.length);
    console.log('displayData.length:', displayData.length);
    console.log('finalDisplayData.length:', finalDisplayData.length);
    console.log('sseConnected:', sseConnected);
    console.log('filteredData.length:', filteredData.length);
  }, [sseData.length, prices.length, displayData.length, finalDisplayData.length, sseConnected, filteredData.length]);

  // 개발 모드에서 섹터 매핑 상태 디버그
  useEffect(() => {
    if (displayData.length > 0 && process.env.NODE_ENV === 'development') {
      import('../../lib/crypto/debug').then(({ logMappingStatus }) => {
        const symbols = displayData.map(crypto => crypto.symbol);
        logMappingStatus(symbols);
      });
    }
  }, [displayData]);

  // 가격 알림 체크
  useEffect(() => {
    if (displayData.length > 0) {
      checkPriceAlerts(displayData);
    }
  }, [displayData, checkPriceAlerts]);

  // 초기 필터 데이터 설정
  useEffect(() => {
    if (displayData.length > 0 && filteredData.length === 0) {
      setFilteredData(displayData);
    }
  }, [displayData, filteredData.length]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          빗썸 암호화폐 시세
        </h1>
        <p className="text-gray-600">
          실시간 암호화폐 가격 정보를 확인하세요
        </p>
      </div>

      {/* 실시간 업데이트 상태 표시만 */}
      <ClientOnly fallback={<div className="mb-4 h-16 bg-gray-100 rounded animate-pulse"></div>}>
        <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${sseConnected ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-sm font-medium text-gray-700">
                  🚀 실시간 스트림 (1초) {sseConnected ? '연결됨' : '연결 시도 중...'}
                </span>
              </div>
            </div>
            
            {sseError && (
              <span className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded">
                {sseError}
              </span>
            )}
          </div>
        </div>
      </ClientOnly>

      {/* 성능 모니터링 */}
      <ClientOnly fallback={<div className="mb-4 h-20 bg-gray-100 rounded animate-pulse"></div>}>
        <PerformanceMonitor
          updateMode="sse"
          dataLength={finalDisplayData.length}
          isConnected={sseConnected}
        />
      </ClientOnly>

      {/* 섹터별 통계 */}
      <ClientOnly fallback={<div className="mb-4 h-32 bg-gray-100 rounded animate-pulse"></div>}>
        <SectorStats cryptos={displayData} />
      </ClientOnly>

      {/* 가격 알림 패널 */}
      <ClientOnly fallback={<div className="mb-4 h-24 bg-gray-100 rounded animate-pulse"></div>}>
        <PriceAlertPanel cryptos={displayData} />
      </ClientOnly>

      {/* 필터 및 검색 */}
      <ClientOnly fallback={<div className="mb-4 h-16 bg-gray-100 rounded animate-pulse"></div>}>
        <CryptoFilter
          cryptos={displayData}
          onFilteredDataChange={handleFilteredDataChange}
          favorites={favorites}
        />
      </ClientOnly>

      {/* 컨트롤 패널 및 액션 버튼들 */}
      <ClientOnly fallback={<div className="mb-6 h-16 bg-gray-100 rounded animate-pulse"></div>}>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <RefreshControl
              isLoading={isLoading}
              lastUpdated={sseLastUpdated || lastUpdated}
              onRefresh={handleRefresh}
              autoRefresh={false}
              onToggleAutoRefresh={() => {}} // 더미 함수
            />
          </div>
          <div className="flex gap-2">
            <CSVExportButton 
              cryptos={finalDisplayData}
              filename="bithumb-crypto-prices"
            />
            <ClientOnly fallback={<div className="w-32 h-10 bg-gray-100 rounded animate-pulse"></div>}>
              <AdvancedCSVExport cryptos={finalDisplayData} />
            </ClientOnly>
          </div>
        </div>
      </ClientOnly>

      {/* 시세 테이블 */}
      <ClientOnly fallback={<div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex items-center justify-center"><div className="text-gray-500">로딩 중...</div></div>}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <CryptoTable
            cryptos={finalDisplayData}
            loading={isLoading}
            error={sseError}
            onCryptoClick={handleCryptoClick}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        </div>
      </ClientOnly>

      {/* 하단 정보 */}
      <ClientOnly fallback={<div className="mt-6 h-12 bg-gray-100 rounded animate-pulse"></div>}>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            데이터 제공: 빗썸 | 
            업데이트 방식: 실시간 스트림 (1초) |
            표시 개수: {finalDisplayData.length}개 / 전체 {displayData.length}개
          </p>
          <p className="mt-1 text-xs">
            💡 기본 정렬: 상승률 높은 순 | 실시간 업데이트: SSE 스트림 모드 (1초 간격)
          </p>
        </div>
      </ClientOnly>
    </div>
  );
}
