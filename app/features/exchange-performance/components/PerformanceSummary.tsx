import { memo } from 'react';
import type { ExchangeStats } from '../types';

interface PerformanceSummaryProps {
  summary: string;
  bestPerformer: ExchangeStats | null;
  worstPerformer: ExchangeStats | null;
  totalExchanges: number;
  activeExchanges: number;
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
  activeExchanges
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900 
      rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
      
      {/* 제목 */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl">📊</span>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          거래소별 성과 분석
        </h2>
      </div>

      {/* 요약 텍스트 */}
      <div className="mb-6">
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {summary}
        </p>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {activeExchanges}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            활성 거래소
          </div>
        </div>

        {bestPerformer && (
          <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 text-center">
            <div className="text-lg mb-1">{bestPerformer.icon}</div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              최고 성과
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              {bestPerformer.displayName}
            </div>
          </div>
        )}

        {worstPerformer && (
          <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 text-center">
            <div className="text-lg mb-1">{worstPerformer.icon}</div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              최저 성과
            </div>
            <div className="text-xs text-red-600 dark:text-red-400">
              {worstPerformer.displayName}
            </div>
          </div>
        )}

        <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totalExchanges}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            전체 거래소
          </div>
        </div>
      </div>

      {/* 베스트 vs 워스트 비교 */}
      {bestPerformer && worstPerformer && (
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            📈 성과 차이
          </h3>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-xl">{bestPerformer.icon}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {bestPerformer.displayName}
              </div>
              <div className="text-sm font-bold text-green-600 dark:text-green-400">
                +{bestPerformer.averageChange.toFixed(2)}%
              </div>
            </div>
            
            <div className="flex-1 mx-4">
              <div className="h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 
                dark:from-green-800 dark:via-yellow-800 dark:to-red-800 rounded-full">
              </div>
              <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                성과 차이: {(bestPerformer.averageChange - worstPerformer.averageChange).toFixed(2)}%p
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl">{worstPerformer.icon}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {worstPerformer.displayName}
              </div>
              <div className="text-sm font-bold text-red-600 dark:text-red-400">
                {worstPerformer.averageChange.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

PerformanceSummary.displayName = 'PerformanceSummary';
