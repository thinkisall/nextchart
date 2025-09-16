import { useState } from 'react';
import { CryptoPrice } from '../../../lib/types';
import { useExchangePerformance } from '../hooks/useExchangePerformance';
import { ExchangeCard } from './ExchangeCard';
import { PerformanceSummary } from './PerformanceSummary';
import type { PerformanceFilter } from '../types';

interface ExchangePerformanceContainerProps {
  coins: CryptoPrice[];
  className?: string;
}

/**
 * 거래소 성과 분석 메인 컨테이너
 * 모든 거래소별 성과 분석 기능을 통합
 */
export function ExchangePerformanceContainer({ 
  coins, 
  className = '' 
}: ExchangePerformanceContainerProps) {
  const [filter, setFilter] = useState<PerformanceFilter>({
    sortBy: 'averageChange',
    sortOrder: 'desc',
    showOnlyPositive: false
  });

  const {
    performance,
    filteredExchanges,
    bestPerformer,
    worstPerformer,
    summary,
    isLoading,
    totalExchanges,
    activeExchanges,
    lastUpdate
  } = useExchangePerformance(coins, filter);

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-3xl p-8 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-2/3"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* 성과 요약 */}
      <PerformanceSummary
        summary={summary}
        bestPerformer={bestPerformer}
        worstPerformer={worstPerformer}
        totalExchanges={totalExchanges}
        activeExchanges={activeExchanges}
        lastUpdate={lastUpdate}
      />

      {/* 필터 컨트롤 */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 
        border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-4">
            {/* 정렬 기준 */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                정렬:
              </label>
              <select
                value={filter.sortBy}
                onChange={(e) => setFilter(prev => ({ 
                  ...prev, 
                  sortBy: e.target.value as PerformanceFilter['sortBy'] 
                }))}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 
                  rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <option value="averageChange">평균 변동률</option>
                <option value="positivePercentage">상승 비율</option>
                <option value="totalCoins">코인 수</option>
              </select>
            </div>

            {/* 정렬 순서 */}
            <button
              onClick={() => setFilter(prev => ({ 
                ...prev, 
                sortOrder: prev.sortOrder === 'desc' ? 'asc' : 'desc' 
              }))}
              className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 
                rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              {filter.sortOrder === 'desc' ? '↓ 내림차순' : '↑ 오름차순'}
            </button>

            {/* 양수 필터 */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filter.showOnlyPositive}
                onChange={(e) => setFilter(prev => ({ 
                  ...prev, 
                  showOnlyPositive: e.target.checked 
                }))}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                상승만 보기
              </span>
            </label>
          </div>

          {/* 새로고침 버튼 및 업데이트 시간 */}
          <div className="flex items-center space-x-3">
            {lastUpdate && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 거래소 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExchanges.map((exchange, index) => (
          <ExchangeCard
            key={exchange.name}
            exchange={exchange}
            rank={index + 1}
            showTopCoins={true}
          />
        ))}
      </div>

      {/* 데이터 없음 상태 */}
      {filteredExchanges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            조건에 맞는 거래소가 없습니다
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            필터 조건을 변경해보세요
          </div>
        </div>
      )}
    </div>
  );
}
