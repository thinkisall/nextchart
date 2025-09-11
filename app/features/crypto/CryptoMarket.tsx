"use client";

import { useState, useEffect, useCallback } from "react";
import { CryptoPrice } from "../../lib/types";
import { useCryptoPrices } from "../../hooks/useCryptoPrices";
import { useBithumbWebSocket } from "../../hooks/useBithumbWebSocket";
import { useServerSentEvents } from "../../hooks/useServerSentEvents";
import { usePriceAlerts } from "../../hooks/usePriceAlerts";
import { useFavorites } from "../../hooks/useFavorites";
import { CryptoTable } from "../../components/organisms/CryptoTable";
import { RefreshControl } from "../../components/molecules/RefreshControl";
import { PriceAlertPanel } from "../../components/organisms/PriceAlertPanel";
import { PerformanceMonitor } from "../../components/molecules/PerformanceMonitor";
import { CryptoFilter } from "../../components/molecules/CryptoFilter";
import { CSVExportButton } from "../../components/atoms/CSVExportButton";
import { AdvancedCSVExport } from "../../components/molecules/AdvancedCSVExport";
import { SectorStats } from "../../components/organisms/SectorStats";
import { ClientOnly } from "../../hooks/useIsClient";

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
  const majorCoins = ["BTC_KRW", "ETH_KRW", "XRP_KRW", "ADA_KRW", "SOL_KRW"];
  const {
    data: wsData,
    isConnected,
    error: wsError,
    reconnect,
  } = useBithumbWebSocket({
    symbols: majorCoins,
    tickTypes: ["24H"],
  });

  // Server-Sent Events 훅
  const {
    data: sseData,
    isConnected: sseConnected,
    error: sseError,
    lastUpdated: sseLastUpdated,
    reconnect: sseReconnect,
    disconnect: sseDisconnect,
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
    console.log("Selected crypto:", crypto);
    // 여기에 상세 페이지 이동 또는 모달 표시 로직 추가
  };

  const handleFilteredDataChange = useCallback((filtered: CryptoPrice[]) => {
    setFilteredData(filtered);
  }, []);

  // 컴포넌트 마운트 시 SSE 연결 확인만 수행
  useEffect(() => {
    if (isClient && !sseConnected && sseData.length === 0) {
      console.log("메인 페이지: SSE 연결 상태 확인");
      // 연결이 안 되어 있으면 재연결 시도
      const timer = setTimeout(() => {
        if (!sseConnected) {
          console.log("메인 페이지: SSE 재연결 시도");
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
    console.log("=== 메인 페이지 데이터 상태 ===");
    console.log("sseData.length:", sseData.length);
    console.log("prices.length:", prices.length);
    console.log("displayData.length:", displayData.length);
    console.log("finalDisplayData.length:", finalDisplayData.length);
    console.log("sseConnected:", sseConnected);
    console.log("filteredData.length:", filteredData.length);
  }, [
    sseData.length,
    prices.length,
    displayData.length,
    finalDisplayData.length,
    sseConnected,
    filteredData.length,
  ]);

  // 개발 모드에서 섹터 매핑 상태 디버그
  useEffect(() => {
    if (displayData.length > 0 && process.env.NODE_ENV === "development") {
      import("../../lib/crypto/debug").then(({ logMappingStatus }) => {
        const symbols = displayData.map((crypto) => crypto.symbol);
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
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* 헤더 - 모바일 최적화 */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          🚀 실시간 섹터 탐지
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          빗썸 API 기반 실시간 가격 정보
        </p>
      </div>

      {/* 실시간 업데이트 상태 - 모바일 컴팩트 */}
      <ClientOnly
        fallback={
          <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        }
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                    sseConnected ? "bg-green-500 animate-pulse" : "bg-red-400"
                  }`}
                />
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                  {sseConnected ? "✅ 실시간 연결됨" : "⏳ 연결 시도 중..."}
                </span>
                <span className="hidden sm:inline text-xs text-gray-500">
                  (1초 간격)
                </span>
              </div>

              {sseError && (
                <span className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
                  {sseError}
                </span>
              )}
            </div>
          </div>
        </div>
      </ClientOnly>

      {/* 성능 모니터링 - 모바일에서 간소화 */}
      <ClientOnly
        fallback={
          <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        }
      >
        <PerformanceMonitor
          updateMode="sse"
          dataLength={finalDisplayData.length}
          isConnected={sseConnected}
        />
      </ClientOnly>

      {/* 섹터별 통계 */}
      <ClientOnly
        fallback={
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        }
      >
        <SectorStats cryptos={displayData} />
      </ClientOnly>

      {/* 가격 알림 패널 */}
      <ClientOnly
        fallback={
          <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        }
      >
        <PriceAlertPanel cryptos={displayData} />
      </ClientOnly>

      {/* 필터 및 검색 */}
      <ClientOnly
        fallback={
          <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        }
      >
        <CryptoFilter
          cryptos={displayData}
          onFilteredDataChange={handleFilteredDataChange}
          favorites={favorites}
        />
      </ClientOnly>

      {/* 컨트롤 패널 - 모바일 스택 레이아웃 */}
      <ClientOnly
        fallback={
          <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        }
      >
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <RefreshControl
              isLoading={isLoading}
              lastUpdated={sseLastUpdated || lastUpdated}
              onRefresh={handleRefresh}
              autoRefresh={false}
              onToggleAutoRefresh={() => {}}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <CSVExportButton
              cryptos={finalDisplayData}
              filename="bithumb-crypto-prices"
            />
            <ClientOnly
              fallback={
                <div className="w-full sm:w-32 h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
              }
            >
              <AdvancedCSVExport cryptos={finalDisplayData} />
            </ClientOnly>
          </div>
        </div>
      </ClientOnly>

      {/* 시세 테이블 */}
      <ClientOnly
        fallback={
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-96 flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400">로딩 중...</div>
          </div>
        }
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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

      {/* 하단 정보 - 모바일 최적화 */}
      <ClientOnly
        fallback={
          <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
        }
      >
        <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-1 py-4">
          <p>
            📊 데이터: 빗썸 | ⚡ 업데이트: 실시간 (1초) | 📈 표시:{" "}
            {finalDisplayData.length}개 / 전체 {displayData.length}개
          </p>
          <p className="text-xs">
            💡 기본 정렬: 상승률 높은 순 | 🔄 실시간 스트림 모드
          </p>
        </div>
      </ClientOnly>
    </div>
  );
}
