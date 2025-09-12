'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CryptoPrice } from '../../lib/types';
import { useServerSentEvents } from '../../hooks/useServerSentEvents';
import { ClientOnly } from '../../hooks/useIsClient';
import { CryptoTable } from '../../components/organisms/CryptoTable';
import { RefreshControl } from '../../components/molecules/RefreshControl';
import { CSVExportButton } from '../../components/atoms/CSVExportButton';
import { AdvancedCSVExport } from '../../components/molecules/AdvancedCSVExport';
import { Breadcrumb } from '../../components/atoms/Breadcrumb';
import { useFavorites } from '../../hooks/useFavorites';
import { PerformanceMonitor } from '../../components/molecules/PerformanceMonitor';
import { getConsolidatedSectors } from '../../lib/crypto/consolidation';
import { CRYPTO_SECTORS } from '../../lib/crypto';
import { HeaderAd, FooterAd, SidebarAd } from '../../components/AdSenseV2';

export default function SectorPage() {
  const params = useParams();
  const router = useRouter();
  const sectorName = decodeURIComponent(params.sectorName as string);

  const {
    data: sseData,
    isConnected: sseConnected,
    error: sseError,
    reconnect: sseReconnect
  } = useServerSentEvents();

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const [filteredCryptos, setFilteredCryptos] = useState<CryptoPrice[]>([]);

  const handleSectorChange = (newSector: string) => {
    router.push(`/sector/${encodeURIComponent(newSector)}`);
  };

  // SSE 연결이 안 되어 있으면 수동 연결 시도
  useEffect(() => {
    if (!sseConnected && sseData.length === 0) {
      console.log('SSE 연결 시도 중...');
      const timer = setTimeout(() => {
        sseReconnect();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [sseConnected, sseData.length, sseReconnect]);
  // 섹터별 데이터 필터링
  useEffect(() => {
    console.log('=== 섹터 페이지 디버깅 ===');
    console.log('sectorName:', sectorName);
    console.log('sseData.length:', sseData.length);
    console.log('sseConnected:', sseConnected);
    
    if (sseData.length > 0) {
      // 각 코인의 섹터 정보 확인
      const sectorCounts: { [key: string]: number } = {};
      sseData.forEach(crypto => {
        const originalSector = crypto.sector || '기타';
        const consolidatedSectors = getConsolidatedSectors(originalSector);
        consolidatedSectors.forEach(sector => {
          sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
        });
      });
      
      console.log('사용 가능한 섹터들:', Object.keys(sectorCounts));
      console.log('섹터별 코인 수:', sectorCounts);
      
      // 통합된 섹터 기준으로 필터링 (다중 카테고리 지원)
      const filtered = sseData.filter(crypto => {
        const originalSector = crypto.sector || '기타';
        const consolidatedSectors = getConsolidatedSectors(originalSector);
        return consolidatedSectors.includes(sectorName);
      });
      
      console.log('필터링된 코인 수:', filtered.length);
      console.log('필터링된 코인들:', filtered.map(c => `${c.symbol}(${c.sector})`));
      
      setFilteredCryptos(filtered);
    } else {
      // 데이터가 아직 로드되지 않은 경우
      console.log('SSE 데이터 로딩 중...');
      setFilteredCryptos([]);
    }
  }, [sseData, sectorName]);

  const handleRefresh = () => {
    sseReconnect();
  };

  const handleBackToMain = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* 모바일 최적화된 컨테이너 */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        
        {/* Header Advertisement */}
        <HeaderAd />
        
        {/* 헤더 - 모바일 우선 디자인 */}
        <div className="mb-4 sm:mb-6">
          <div className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between">
            {/* 타이틀 영역 */}
            <div className="flex-1">
              <Breadcrumb 
                items={[
                  { label: '전체 목록', href: '/' },
                  { label: `${sectorName} 섹터` }
                ]}
              />
              {/* 모바일: 더 작은 제목, 태블릿+: 큰 제목 */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2 mt-2 sm:mt-4 leading-tight">
                {sectorName} 섹터
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {sectorName} 섹터의 암호화폐 시세 현황
              </p>
            </div>
            
            {/* 새로고침 버튼 - 모바일에서는 아래로 */}
            <div className="flex justify-end sm:flex-shrink-0 sm:ml-4">
              <div className="w-full sm:w-auto">
                <RefreshControl 
                  onRefresh={handleRefresh}
                  isLoading={false}
                  lastUpdated={new Date()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 성능 모니터 - 모바일에서 축소 */}
        <ClientOnly fallback={
          <div className="mb-3 sm:mb-4 h-12 sm:h-16 lg:h-20 bg-white/60 dark:bg-gray-800/60 rounded-lg animate-pulse backdrop-blur"></div>
        }>
          <div className="mb-3 sm:mb-4">
            <PerformanceMonitor
              updateMode="sse"
              dataLength={filteredCryptos.length}
              isConnected={sseConnected}
            />
          </div>
        </ClientOnly>

        {/* 섹터 선택 및 통계 - 모바일 최적화 */}
        <div className="mb-4 sm:mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
          <div className="p-3 sm:p-4 lg:p-6">
            
            {/* 섹터 선택 드롭다운 - 모바일에서 전체 너비 */}
            <div className="mb-4 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                {sectorName} 섹터 통계
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label htmlFor="sector-select" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
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
            
            {/* 통계 그리드 - 모바일 2열, 태블릿+ 4열 */}
            {sseData.length === 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center p-2 sm:p-3">
                    <div className="animate-pulse">
                      <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {filteredCryptos.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">총 코인 수</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                    {filteredCryptos.filter(c => c.change_rate > 0).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">상승</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 dark:text-red-400">
                    {filteredCryptos.filter(c => c.change_rate < 0).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">하락</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {filteredCryptos.filter(c => c.change_rate === 0).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">보합</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Advertisement - 섹터 통계 다음, 성능 모니터 전 */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          <div className="w-full max-w-lg">
            <SidebarAd />
          </div>
        </div>

        {/* 데이터 내보내기 - 모바일에서 세로 배치 */}
        <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <CSVExportButton 
            cryptos={filteredCryptos}
            filename={`${sectorName}-sector-crypto-prices`}
          />
          <ClientOnly fallback={
            <div className="w-full sm:w-32 h-11 bg-white/60 dark:bg-gray-800/60 rounded-lg animate-pulse"></div>
          }>
            <AdvancedCSVExport cryptos={filteredCryptos} />
          </ClientOnly>
        </div>

        {/* 코인 테이블 - 모바일 최적화 */}
        <ClientOnly fallback={
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl h-80 sm:h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-2 sm:mb-4"></div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">로딩 중...</div>
            </div>
          </div>
        }>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-2xl overflow-hidden">
            {sseData.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                      데이터 로딩 중...
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      실시간 암호화폐 데이터를 불러오고 있습니다.
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      연결 상태: {sseConnected ? '연결됨' : '연결 중...'}
                    </p>
                  </div>
                </div>
              </div>
            ) : filteredCryptos.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2">
                    {sectorName} 섹터에 코인이 없습니다
                  </p>
                  <p className="text-xs sm:text-sm">다른 섹터를 선택해보세요.</p>
                </div>
              </div>
            ) : (
              <CryptoTable
                cryptos={filteredCryptos}
                loading={false}
                error={sseError}
                onCryptoClick={() => {}}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            )}
          </div>
        </ClientOnly>

        {/* 하단 정보 - 모바일 최적화 */}
        <ClientOnly fallback={
          <div className="mt-3 sm:mt-4 h-12 sm:h-16 bg-white/60 dark:bg-gray-800/60 rounded-lg animate-pulse"></div>
        }>
          <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-gradient-to-r from-white/40 to-white/60 dark:from-gray-800/40 dark:to-gray-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 p-3 sm:p-4">
            <div className="space-y-1 sm:space-y-0 sm:space-x-4 sm:flex sm:items-center sm:justify-center">
              <span className="block sm:inline">데이터 제공: 빗썸</span>
              <span className="hidden sm:inline">|</span>
              <span className="block sm:inline">업데이트: 실시간 스트림(1초)</span>
              <span className="hidden sm:inline">|</span>
              <span className="block sm:inline font-medium">
                {sectorName} 섹터: {filteredCryptos.length}개 코인
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              💡 실시간 업데이트: SSE 스트림 모드
            </p>
          </div>
        </ClientOnly>

        {/* Footer Advertisement */}
        <FooterAd />
      </div>
    </div>
  );
}