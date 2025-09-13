'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CryptoPrice } from '../../lib/types';
import { useCryptoPrices } from '../../hooks/useCryptoPrices';
import { useBithumbWebSocket } from '../../hooks/useBithumbWebSocket';
import { useServerSentEvents } from '../../hooks/useServerSentEvents';
import { useFavorites } from '../../hooks/useFavorites';
// import { usePerformanceMonitor, useUpdateTracker } from '../../hooks/usePerformanceMonitor';
import { CryptoTable } from '../../components/organisms/CryptoTable';
import { CryptoFilter } from '../../components/molecules/CryptoFilter';
import { SectorStats } from '../../components/organisms/SectorStats';
import { ClientOnly } from '../../hooks/useIsClient';
import { SquareAd } from '../../components/AdSenseV2';

export function CryptoMarket() {
  // 성능 모니터링 - 일시적으로 비활성화
  // usePerformanceMonitor('CryptoMarket', []);
  
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

  const handleRefresh = useCallback(() => {
    refetch();
    if (isClient) {
      setLastUpdated(new Date());
    }
  }, [refetch, isClient]);

  const handleCryptoClick = useCallback((crypto: CryptoPrice) => {
    // 클릭 이벤트 처리 로직을 여기에 추가할 수 있습니다
  }, []);

  const handleFilteredDataChange = useCallback((filtered: CryptoPrice[]) => {
    setFilteredData(filtered);
  }, []);

  // 메모이제이션된 데이터 계산
  const displayData = useMemo(() => {
    return sseData.length > 0 ? sseData : prices;
  }, [sseData, prices]);

  const finalDisplayData = useMemo(() => {
    return filteredData.length > 0 ? filteredData : displayData;
  }, [filteredData, displayData]);

  // 메모이제이션된 통계 계산 - 단순화
  const marketStats = useMemo(() => {
    if (displayData.length === 0) {
      return { totalAssets: 0, positiveCount: 0, negativeCount: 0 };
    }
    
    const positiveCount = displayData.filter(c => c.is_positive).length;
    return { 
      totalAssets: finalDisplayData.length, 
      positiveCount, 
      negativeCount: displayData.length - positiveCount 
    };
  }, [displayData.length, finalDisplayData.length]);

  // 컴포넌트 마운트 시 SSE 연결 확인만 수행
  useEffect(() => {
    if (isClient && !sseConnected && sseData.length === 0) {
      const timer = setTimeout(() => {
        if (!sseConnected) {
          sseReconnect();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isClient, sseConnected, sseData.length, sseReconnect]);

  // Virtual Scrolling 사용 여부 결정 - 일시적으로 비활성화
  const shouldUseVirtualScrolling = useMemo(() => {
    return false; // 성능 테스트를 위해 비활성화
    // return finalDisplayData.length >= 100 && typeof window !== 'undefined' && window.innerWidth >= 768;
  }, []);

  // SSE 데이터 변경 감지
  useEffect(() => {
    if (sseData.length > 0) {
      console.log('🔄 CryptoMarket: SSE data updated at', new Date().toLocaleTimeString(), 'count:', sseData.length);
    }
  }, [sseData]);

  // 최종 디스플레이 데이터 변경 감지
  useEffect(() => {
    if (finalDisplayData.length > 0) {
      console.log('📱 CryptoMarket: Final display data updated at', new Date().toLocaleTimeString(), 'count:', finalDisplayData.length);
    }
  }, [finalDisplayData]);

  const isLoading = false; // SSE는 로딩 상태가 없음

  // 초기 필터 데이터 설정
  useEffect(() => {
    if (displayData.length > 0 && filteredData.length === 0) {
      setFilteredData(displayData);
    }
  }, [displayData, filteredData.length]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Market Status Panel - 모바일 최적화 */}
      <ClientOnly fallback={<div className="h-16 sm:h-20 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
              {/* Connection Status - 모바일 최적화 */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="relative">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${sseConnected ? 'bg-emerald-500' : 'bg-red-500'}`}>
                      {sseConnected && (
                        <div className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full animate-ping opacity-40"></div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                      {sseConnected ? '실시간 시세 연결됨' : '연결 중...'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      실시간 스트림 • 3초 간격 업데이트
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Stats - 모바일에서 2열, 태블릿+에서 3열 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:flex lg:items-center lg:space-x-6">
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">{marketStats.totalAssets}</div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">총 자산</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {marketStats.positiveCount}
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">상승</div>
                </div>
                <div className="text-center col-span-2 sm:col-span-1">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 dark:text-red-400">
                    {marketStats.negativeCount}
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">하락</div>
                </div>
              </div>

              {/* Error Display */}
              {sseError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 sm:px-4 py-2 mt-2 lg:mt-0">
                  <span className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">{sseError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ClientOnly>

      {/* Sector Analytics - 모바일 최적화 */}
      <ClientOnly fallback={<div className="h-32 sm:h-40 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
          <SectorStats cryptos={displayData} />
        </div>
      </ClientOnly>

      {/* Square Ad - 섹터 분석 아래 */}
      <ClientOnly fallback={<div className="h-80 w-80 mx-auto bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="flex justify-center">
          <SquareAd />
        </div>
      </ClientOnly>

      {/* Advanced Filtering - 모바일 최적화 */}
      <ClientOnly fallback={<div className="h-16 sm:h-20 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
          <CryptoFilter
            cryptos={displayData}
            onFilteredDataChange={handleFilteredDataChange}
            favorites={favorites}
          />
        </div>
      </ClientOnly>

      {/* Control Panel - 모바일 최적화 */}
      <ClientOnly fallback={<div className="h-14 sm:h-16 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="hidden">
          {/* CSV 다운로드 컨트롤이 제거됨 - 추후 다른 컨트롤 추가 가능 */}
        </div>
      </ClientOnly>

      {/* Main Trading Table - 모바일 최적화 */}
      <ClientOnly fallback={
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl h-80 sm:h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-2 sm:mb-4"></div>
            <div className="text-sm sm:text-lg font-medium text-gray-600 dark:text-gray-300">시세 데이터 로딩 중...</div>
          </div>
        </div>
      }>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden">
          <CryptoTable
            cryptos={finalDisplayData}
            loading={isLoading}
            error={sseError}
            onCryptoClick={handleCryptoClick}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            useVirtualScrolling={shouldUseVirtualScrolling}
          />
        </div>
      </ClientOnly>

      {/* Professional Footer - 모바일 최적화 */}
      <ClientOnly fallback={<div className="h-14 sm:h-16 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="bg-gradient-to-r from-white/40 to-white/60 dark:from-gray-800/40 dark:to-gray-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30">
          <div className="p-4 sm:p-6 text-center">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>데이터 소스: 빗썸 거래소</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>업데이트: 실시간 스트림</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>표시 중: {finalDisplayData.length} / {displayData.length} 자산</span>
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                전문 암호화폐 시장 분석 플랫폼 • 24시간 변동률 기준 정렬
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  );
}