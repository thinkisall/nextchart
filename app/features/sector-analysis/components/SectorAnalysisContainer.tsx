// 섹터 분석 메인 컨테이너
'use client';

import { useState, useMemo } from 'react';
import { CryptoPrice } from '../../../lib/types';
import { useSectorAnalysis } from '../hooks/useSectorAnalysis';
import { SectorAnalysis } from '../services/SectorAnalysisService';
import { MarketOverview } from './MarketOverview';
import { SectorGrid, SectorFilter } from './SectorGrid';
import { SectorCarousel } from './SectorCarousel';

interface SectorAnalysisContainerProps {
  cryptos: CryptoPrice[];
  onSectorClick?: (analysis: SectorAnalysis) => void;
}

export function SectorAnalysisContainer({ 
  cryptos, 
  onSectorClick 
}: SectorAnalysisContainerProps) {
  const [selectedMomentum, setSelectedMomentum] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');
  const [sortBy, setSortBy] = useState<'marketCap' | 'change' | 'volume' | 'count'>('marketCap');

  // 섹터 분석 데이터 가져오기
  const {
    analyses,
    performanceSummary,
    isLoading,
    formatNumber,
    formatPercentage
  } = useSectorAnalysis(cryptos);

  // 필터링 및 정렬된 분석 결과
  const filteredAndSortedAnalyses = useMemo(() => {
    let filtered = analyses;

    // 모멘텀 필터링
    if (selectedMomentum !== 'all') {
      filtered = filtered.filter(analysis => analysis.momentum === selectedMomentum);
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'marketCap':
          return b.totalMarketCap - a.totalMarketCap;
        case 'change':
          return b.avgChange - a.avgChange;
        case 'volume':
          return b.totalVolume - a.totalVolume;
        case 'count':
          return b.count - a.count;
        default:
          return 0;
      }
    });

    return sorted;
  }, [analyses, selectedMomentum, sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              섹터별 분석 진행 중...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {cryptos.length}개 토큰을 분석하고 있습니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* 시장 개요 */}
      <MarketOverview 
        performanceSummary={performanceSummary}
        totalCoins={cryptos.length}
      />

      {/* 섹터 필터 */}
      <SectorFilter
        analyses={analyses}
        selectedMomentum={selectedMomentum}
        onMomentumChange={setSelectedMomentum}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* 결과 요약 */}
      <div className="bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-4 backdrop-blur">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-600 dark:text-blue-400">📋</span>
          <h3 className="font-semibold text-blue-900 dark:text-blue-300">
            분석 결과
          </h3>
        </div>
        <p className="text-sm text-blue-800 dark:text-blue-300">
          총 <strong>{analyses.length}개 섹터</strong> 중{' '}
          {selectedMomentum === 'all' ? (
            <>모든 섹터를 표시하고 있습니다</>
          ) : (
            <>
              <strong className="capitalize">{
                selectedMomentum === 'bullish' ? '상승세' :
                selectedMomentum === 'bearish' ? '하락세' : '중립'
              }</strong> 추세의 <strong>{filteredAndSortedAnalyses.length}개 섹터</strong>를 표시하고 있습니다
            </>
          )}
          . <strong>{sortBy === 'marketCap' ? '시가총액' : 
                   sortBy === 'change' ? '변동률' : 
                   sortBy === 'volume' ? '거래량' : '토큰 수'}</strong> 순으로 정렬됩니다.
        </p>
      </div>

      {/* 섹터 캐러셀 (모바일) & 그리드 (데스크톱) */}
      {filteredAndSortedAnalyses.length > 0 ? (
        <>
          {/* 모바일 캐러셀 */}
          <SectorCarousel
            analyses={filteredAndSortedAnalyses}
            onSectorClick={onSectorClick}
          />
          
          {/* 데스크톱 그리드 */}
          <div className="hidden lg:block">
            <SectorGrid 
              analyses={filteredAndSortedAnalyses}
              onSectorClick={onSectorClick}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            해당하는 섹터가 없습니다
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            필터 조건을 변경해보세요
          </p>
        </div>
      )}

      {/* 통계 정보 */}
      <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>💡 <strong>팁:</strong> 섹터 카드를 클릭하면 해당 섹터의 상세 정보를 볼 수 있습니다</div>
          <div>📈 <strong>모멘텀:</strong> 평균 변동률과 상승 비율을 기반으로 계산됩니다</div>
          <div>📊 <strong>데이터:</strong> 실시간으로 업데이트되는 시장 데이터를 기반으로 합니다</div>
        </div>
      </div>
    </div>
  );
}
