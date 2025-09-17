import { memo } from 'react';
import type { ExchangeStats } from '../types';

interface PerformanceSummaryProps {
  summary: string;
  bestPerformer: ExchangeStats | null;
  worstPerformer: ExchangeStats | null;
  totalExchanges: number;
  activeExchanges: number;
  lastUpdate?: Date;
}

/**
 * 거래소 성과 요약 컴포넌트
 * 전체적인 시장 상황과 최고/최저 성과 거래소 표시
 */
export const PerformanceSummary = memo<PerformanceSummaryProps>(({
  summary,
  bestPerformer,
  worstPerformer,
  totalExchanges,
  activeExchanges,
  lastUpdate
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
      
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 dark:from-slate-800 dark:via-blue-800 dark:to-slate-900 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-white text-xl">📊</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">거래소 성과 분석</h2>
              <p className="text-gray-600 dark:text-blue-100 text-sm">실시간 거래소별 코인 성과 비교</p>
            </div>
          </div>
          
          {/* 실시간 업데이트 표시 */}
          {lastUpdate && (
            <div className="bg-blue-100 dark:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-800 dark:text-white text-sm font-medium">실시간</span>
                <span className="text-gray-600 dark:text-blue-200 text-xs">
                  {lastUpdate.toLocaleTimeString('ko-KR')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-6">
        {/* 요약 텍스트 */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-700/30">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            {summary}
          </p>
        </div>

        {/* 주요 통계 카드들 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-200 dark:border-blue-700/30">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">🏪</span>
              </div>
              <div className="text-blue-600 dark:text-blue-400 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                활성
              </div>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">
              {activeExchanges}
            </div>
            <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">
              Active Exchanges
            </div>
          </div>

          {bestPerformer && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-green-200 dark:border-green-700/30">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-sm sm:text-base md:text-lg">{bestPerformer.icon}</span>
                </div>
                <div className="text-green-600 dark:text-green-400 text-xs font-medium bg-green-100 dark:bg-green-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  최고
                </div>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                +{bestPerformer.averageChange.toFixed(2)}%
              </div>
              <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
                {bestPerformer.displayName}
              </div>
            </div>
          )}

          {worstPerformer && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-red-200 dark:border-red-700/30">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-red-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-sm sm:text-base md:text-lg">{worstPerformer.icon}</span>
                </div>
                <div className="text-red-600 dark:text-red-400 text-xs font-medium bg-red-100 dark:bg-red-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  최저
                </div>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-700 dark:text-red-300 mb-1">
                {worstPerformer.averageChange.toFixed(2)}%
              </div>
              <div className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">
                {worstPerformer.displayName}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-200 dark:border-purple-700/30">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">📈</span>
              </div>
              <div className="text-purple-600 dark:text-purple-400 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                전체
              </div>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">
              {totalExchanges}
            </div>
            <div className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium">
              Total Exchanges
            </div>
          </div>
        </div>

        {/* 베스트 vs 워스트 성과 비교 */}
        {bestPerformer && worstPerformer && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl">⚖️</span>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">성과 차이 분석</h3>
            </div>
            
            <div className="flex items-center justify-between">
              {/* 최고 성과 */}
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-2xl mb-3 mx-auto shadow-lg">
                  {bestPerformer.icon}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {bestPerformer.displayName}
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  +{bestPerformer.averageChange.toFixed(2)}%
                </div>
              </div>
              
              {/* 중앙 화살표와 차이 */}
              <div className="flex-1 mx-6">
                <div className="relative">
                  <div className="h-4 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-full">
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-lg border">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {(bestPerformer.averageChange - worstPerformer.averageChange).toFixed(2)}%p
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                  성과 격차
                </div>
              </div>
              
              {/* 최저 성과 */}
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-2xl mb-3 mx-auto shadow-lg">
                  {worstPerformer.icon}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {worstPerformer.displayName}
                </div>
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  {worstPerformer.averageChange.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

PerformanceSummary.displayName = 'PerformanceSummary';
