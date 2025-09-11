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
    <div className="max-w-7xl mx-auto p-4">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb 
              items={[
                { label: '전체 목록', href: '/' },
                { label: `${sectorName} 섹터` }
              ]}
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">
              {sectorName} 섹터
            </h1>
            <p className="text-gray-600">
              {sectorName} 섹터의 암호화폐 시세 현황
            </p>
          </div>
          <RefreshControl 
            onRefresh={handleRefresh}
            isLoading={false}
            lastUpdated={new Date()}
          />
        </div>
      </div>

      {/* 성능 모니터 */}
      <ClientOnly fallback={<div className="mb-4 h-20 bg-gray-100 rounded animate-pulse"></div>}>
        <PerformanceMonitor
          updateMode="sse"
          dataLength={filteredCryptos.length}
          isConnected={sseConnected}
        />
      </ClientOnly>

      {/* 섹터 선택 및 통계 */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{sectorName} 섹터 통계</h2>
          <div className="flex items-center gap-4">
            <label htmlFor="sector-select" className="text-sm font-medium text-gray-700">
              다른 섹터 보기:
            </label>
            <select
              id="sector-select"
              value={sectorName}
              onChange={(e) => handleSectorChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        
        {sseData.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredCryptos.length}</div>
              <div className="text-sm text-gray-600">총 코인 수</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredCryptos.filter(c => c.change_rate > 0).length}
              </div>
              <div className="text-sm text-gray-600">상승</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredCryptos.filter(c => c.change_rate < 0).length}
              </div>
              <div className="text-sm text-gray-600">하락</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {filteredCryptos.filter(c => c.change_rate === 0).length}
              </div>
              <div className="text-sm text-gray-600">보합</div>
            </div>
          </div>
        )}
      </div>

      {/* 데이터 내보내기 */}
      <div className="mb-4 flex justify-end">
        <div className="flex gap-2">
          <CSVExportButton 
            cryptos={filteredCryptos}
            filename={`${sectorName}-sector-crypto-prices`}
          />
          <ClientOnly fallback={<div className="w-32 h-10 bg-gray-100 rounded animate-pulse"></div>}>
            <AdvancedCSVExport cryptos={filteredCryptos} />
          </ClientOnly>
        </div>
      </div>

      {/* 코인 테이블 */}
      <ClientOnly fallback={
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex items-center justify-center">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      }>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {sseData.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">데이터 로딩 중...</p>
                  <p className="text-sm text-gray-500">
                    실시간 암호화폐 데이터를 불러오고 있습니다.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    연결 상태: {sseConnected ? '연결됨' : '연결 중...'}
                  </p>
                </div>
              </div>
            </div>
          ) : filteredCryptos.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">
                <p className="text-lg font-medium mb-2">{sectorName} 섹터에 코인이 없습니다</p>
                <p className="text-sm">다른 섹터를 선택해보세요.</p>
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

      {/* 하단 정보 */}
      <ClientOnly fallback={<div className="mt-4 h-16 bg-gray-100 rounded animate-pulse"></div>}>
        <div className="mt-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
          <p>
            데이터 제공: 빗썸 | 
            업데이트 방식: 실시간 스트림(1초) |
            {sectorName} 섹터: {filteredCryptos.length}개 코인
          </p>
          <p className="mt-1 text-xs">
            💡 실시간 업데이트: SSE 스트림 모드 (1초 간격)
          </p>
        </div>
      </ClientOnly>
    </div>
  );
}
