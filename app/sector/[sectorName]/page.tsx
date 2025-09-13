"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useSectorData } from "../../hooks/useSectorData";
import { ClientOnly } from "../../hooks/useIsClient";
import { CryptoTable } from "../../components/organisms/CryptoTable";
import { CSVExportButton } from "../../components/atoms/CSVExportButton";
import { AdvancedCSVExport } from "../../components/molecules/AdvancedCSVExport";
import { Breadcrumb } from "../../components/atoms/Breadcrumb";
import { useFavorites } from "../../hooks/useFavorites";
import { CRYPTO_SECTORS } from "../../lib/crypto";
import { HeaderAd, FooterAd, SquareAd } from "../../components/AdSenseV2";
import { SelectedCoinInfo } from "../../features/crypto/components/SelectedCoinInfo";
import { CryptoPrice } from "../../lib/types";

export default function SectorPage() {
  const params = useParams();
  const router = useRouter();
  const sectorName = decodeURIComponent(params.sectorName as string);
  
  // 선택된 코인 상태 추가
  const [selectedCoin, setSelectedCoin] = useState<CryptoPrice | null>(null);

  const {
    filteredCryptos,
    isLoading,
    error,
    sseConnected,
    totalDataCount,
    dataSource,
    refresh,
  } = useSectorData(sectorName);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // 코인 클릭 핸들러 추가
  const handleCryptoClick = useCallback((crypto: CryptoPrice) => {
    setSelectedCoin(crypto);
  }, []);

  // 코인 정보 패널 닫기 핸들러 추가
  const handleCloseCoinInfo = useCallback(() => {
    setSelectedCoin(null);
  }, []);

  const handleSectorChange = (newSector: string) => {
    router.push(`/sector/${encodeURIComponent(newSector)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        <div className="mb-4 sm:mb-6">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between">
            <div className="flex-1">
              <Breadcrumb
                items={[
                  { label: "전체 목록", href: "/" },
                  { label: `${sectorName} 섹터` },
                ]}
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2 mt-2 sm:mt-4 leading-tight">
                {sectorName} 섹터
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {sectorName} 섹터의 암호화폐 시세 현황
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 sm:mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="mb-4 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                {sectorName} 섹터 통계
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label
                  htmlFor="sector-select"
                  className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  다른 섹터 보기:
                </label>
                <select
                  id="sector-select"
                  value={sectorName}
                  onChange={(e) => handleSectorChange(e.target.value)}
                  className="w-full sm:w-auto min-h-[44px] px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {Array.from(new Set(Object.values(CRYPTO_SECTORS)))
                    .sort()
                    .map((sector, index) => (
                      <option key={`sector-${index}`} value={sector}>
                        {sector}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredCryptos.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  총 코인 수
                </div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                  {filteredCryptos.filter((c) => c.change_rate > 0).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  상승
                </div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 dark:text-red-400">
                  {filteredCryptos.filter((c) => c.change_rate < 0).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  하락
                </div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {filteredCryptos.filter((c) => c.change_rate === 0).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  보합
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 sm:mb-6 flex justify-center">
          <div className="w-full max-w-xs">
            <SquareAd />
          </div>
        </div>

        <ClientOnly
          fallback={
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl h-80 sm:h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-2 sm:mb-4"></div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  초기화 중...
                </div>
              </div>
            </div>
          }
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden">
            {isLoading && (
              <div className="p-6 sm:p-8 text-center">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                      {sectorName} 섹터 데이터 로딩 중...
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      데이터 연결 상태: {sseConnected ? "연결됨" : "연결 중..."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && error && (
              <div className="p-6 sm:p-8 text-center">
                <div className="text-red-500 dark:text-red-400">
                  <p className="text-base sm:text-lg font-medium mb-2">
                    ❌ 데이터 로딩 실패
                  </p>
                  <p className="text-xs sm:text-sm mb-4 text-gray-600 dark:text-gray-400">
                    {error}
                  </p>
                  <button
                    onClick={refresh}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    🔄 다시 시도
                  </button>
                </div>
              </div>
            )}

            {!isLoading &&
              !error &&
              filteredCryptos.length === 0 &&
              totalDataCount > 0 && (
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <p className="text-base sm:text-lg font-medium mb-2">
                      📭 {sectorName} 섹터에 코인이 없습니다
                    </p>
                    <p className="text-xs sm:text-sm mb-4">
                      현재 {totalDataCount}개의 코인이 로드되었지만,{" "}
                      {sectorName} 섹터에 해당하는 코인은 없습니다.
                    </p>
                    <button
                      onClick={() => router.push("/")}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      🏠 전체 목록 보기
                    </button>
                  </div>
                </div>
              )}

            {!isLoading && !error && totalDataCount === 0 && (
              <div className="p-6 sm:p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <p className="text-base sm:text-lg font-medium mb-2">
                    📡 데이터 연결 중...
                  </p>
                  <p className="text-xs sm:text-sm mb-4">
                    암호화폐 데이터를 불러오는 중입니다. 잠시만 기다려주세요.
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !error && filteredCryptos.length > 0 && (
              <CryptoTable
                cryptos={filteredCryptos}
                loading={isLoading}
                error={error}
                onCryptoClick={handleCryptoClick}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            )}
          </div>
        </ClientOnly>

        <ClientOnly
          fallback={
            <div className="mt-3 sm:mt-4 h-12 sm:h-16 bg-white/60 dark:bg-gray-800/60 rounded-lg animate-pulse"></div>
          }
        >
          <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gradient-to-r from-white/40 to-white/60 dark:from-gray-800/40 dark:to-gray-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 p-3 sm:p-4">
            <div className="space-y-1 sm:space-y-0 sm:space-x-4 sm:flex sm:items-center sm:justify-center">
              <span className="block sm:inline">
                📊 데이터 소스: {dataSource}
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="block sm:inline">
                {sectorName} 섹터: {filteredCryptos.length}개 / 전체:{" "}
                {totalDataCount}개
              </span>
            </div>
          </div>
        </ClientOnly>

        <FooterAd />

        {/* 선택된 코인 정보 패널 */}
        <SelectedCoinInfo 
          selectedCoin={selectedCoin} 
          onClose={handleCloseCoinInfo} 
        />
      </div>
    </div>
  );
}
