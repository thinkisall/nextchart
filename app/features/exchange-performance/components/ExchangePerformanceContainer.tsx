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
      <div className={`space-y-8 ${className}`}>
        {/* 로딩 스켈레톤 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 h-24"></div>
          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl h-96 animate-pulse">
              <div className="bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 h-24 rounded-t-3xl"></div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      
      {/* 성과 요약 */}
      <PerformanceSummary
        summary={summary}
        bestPerformer={bestPerformer}
        worstPerformer={worstPerformer}
        totalExchanges={totalExchanges}
        activeExchanges={activeExchanges}
        lastUpdate={lastUpdate}
      />

      {/* 필터 컨트롤 - 새로운 디자인 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* 필터 옵션들 */}
          <div className="flex flex-wrap items-center gap-4">
            {/* 정렬 기준 */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                정렬 기준:
              </label>
              <div className="relative">
                <select
                  value={filter.sortBy}
                  onChange={(e) => setFilter(prev => ({ 
                    ...prev, 
                    sortBy: e.target.value as PerformanceFilter['sortBy'] 
                  }))}
                  className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 pr-10 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="averageChange">평균 변동률</option>
                  <option value="positivePercentage">상승 비율</option>
                  <option value="totalCoins">코인 수</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 정렬 순서 토글 */}
            <button
              onClick={() => setFilter(prev => ({ 
                ...prev, 
                sortOrder: prev.sortOrder === 'desc' ? 'asc' : 'desc' 
              }))}
              className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              <span>{filter.sortOrder === 'desc' ? '↓' : '↑'}</span>
              <span>{filter.sortOrder === 'desc' ? '내림차순' : '오름차순'}</span>
            </button>

            {/* 양수 필터 토글 */}
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filter.showOnlyPositive}
                  onChange={(e) => setFilter(prev => ({ 
                    ...prev, 
                    showOnlyPositive: e.target.checked 
                  }))}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-all duration-200 ${
                  filter.showOnlyPositive 
                    ? 'bg-green-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-200 ${
                    filter.showOnlyPositive ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`}></div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                상승만 보기
              </span>
            </label>
          </div>

          {/* 업데이트 정보 */}
          {lastUpdate && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')}</span>
            </div>
          )}
        </div>
      </div>

      {/* 거래소 카드들 - 모든 화면에서 2열로 표시 */}
      <div className="grid grid-cols-2 gap-3 md:gap-6">
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
        <div className="text-center py-20">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
              📊
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              조건에 맞는 거래소가 없습니다
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              필터 조건을 변경해보세요
            </p>
            <button
              onClick={() => setFilter({
                sortBy: 'averageChange',
                sortOrder: 'desc',
                showOnlyPositive: false
              })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            >
              필터 초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
