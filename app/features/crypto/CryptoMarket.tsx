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
  };

  const handleFilteredDataChange = useCallback((filtered: CryptoPrice[]) => {
    setFilteredData(filtered);
  }, []);

  // 컴포넌트 마운트 시 SSE 연결 확인만 수행
  useEffect(() => {
    if (isClient && !sseConnected && sseData.length === 0) {
      console.log('메인 페이지: SSE 연결 상태 확인');
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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Market Status Panel - Professional Design */}
      <ClientOnly fallback={<div className="h-20 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Connection Status */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-4 h-4 rounded-full ${sseConnected ? 'bg-emerald-500' : 'bg-red-500'}`}>
                      {sseConnected && (
                        <div className="absolute inset-0 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-40"></div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {sseConnected ? 'Live Market Data' : 'Connecting...'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Real-time stream • 1-second intervals
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Stats */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{finalDisplayData.length}</div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {displayData.filter(c => c.is_positive).length}
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Rising</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {displayData.filter(c => !c.is_positive).length}
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Falling</div>
                </div>
              </div>

              {/* Error Display */}
              {sseError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2">
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">{sseError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ClientOnly>

      {/* Performance Monitor - Minimized Professional Style */}
      <ClientOnly fallback={<div className="h-16 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg">
          <PerformanceMonitor
            updateMode="sse"
            dataLength={finalDisplayData.length}
            isConnected={sseConnected}
          />
        </div>
      </ClientOnly>

      {/* Sector Analytics */}
      <ClientOnly fallback={<div className="h-40 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
          <SectorStats cryptos={displayData} />
        </div>
      </ClientOnly>

      {/* Price Alerts */}
      <ClientOnly fallback={<div className="h-24 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg">
          <PriceAlertPanel cryptos={displayData} />
        </div>
      </ClientOnly>

      {/* Advanced Filtering */}
      <ClientOnly fallback={<div className="h-20 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
          <CryptoFilter
            cryptos={displayData}
            onFilteredDataChange={handleFilteredDataChange}
            favorites={favorites}
          />
        </div>
      </ClientOnly>

      {/* Control Panel - Professional Layout */}
      <ClientOnly fallback={<div className="h-16 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex-1">
                <RefreshControl
                  isLoading={isLoading}
                  lastUpdated={sseLastUpdated || lastUpdated}
                  onRefresh={handleRefresh}
                  autoRefresh={false}
                  onToggleAutoRefresh={() => {}}
                />
              </div>
              <div className="flex items-center space-x-3">
                <CSVExportButton 
                  cryptos={finalDisplayData}
                  filename="crypto-market-data"
                />
                <ClientOnly fallback={<div className="w-32 h-10 bg-gray-100/60 dark:bg-gray-700/60 rounded-lg animate-pulse"></div>}>
                  <AdvancedCSVExport cryptos={finalDisplayData} />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>

      {/* Main Trading Table */}
      <ClientOnly fallback={
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <div className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading Market Data...</div>
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
          />
        </div>
      </ClientOnly>

      {/* Professional Footer */}
      <ClientOnly fallback={<div className="h-16 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>}>
        <div className="bg-gradient-to-r from-white/40 to-white/60 dark:from-gray-800/40 dark:to-gray-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30">
          <div className="p-6 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <div className="flex flex-wrap justify-center items-center gap-4">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Data Source: Bithumb Exchange</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Update: Real-time Stream</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Displaying: {finalDisplayData.length} / {displayData.length} assets</span>
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Professional cryptocurrency market analysis platform • Sorted by 24h change
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  );
}