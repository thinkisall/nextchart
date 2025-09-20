'use client';

import { memo } from 'react';
import { useAltcoinSeason } from '../../hooks/useAltcoinSeason';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

interface AltcoinSeasonIndexProps {
  className?: string;
}

export const AltcoinSeasonIndex = memo(function AltcoinSeasonIndex({ 
  className = '' 
}: AltcoinSeasonIndexProps) {
  const { data, loading, error, lastUpdated, isFallback, refetch } = useAltcoinSeason();

  const formatLastUpdated = (timestamp: string | null) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return '방금';
    if (diffHours < 24) return `${diffHours}시간 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  const getSeasonGradient = (season: 'altcoin' | 'bitcoin') => {
    return season === 'altcoin' 
      ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
      : 'from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20';
  };

  const getSeasonBorder = (season: 'altcoin' | 'bitcoin') => {
    return season === 'altcoin'
      ? 'border-green-200 dark:border-green-700/50'
      : 'border-orange-200 dark:border-orange-700/50';
  };

  if (loading && !data) {
    return (
      <section className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
            알트코인 시즌 지수 로딩 중...
          </span>
        </div>
      </section>
    );
  }

  if (error && !data) {
    return (
      <section className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-gray-600 dark:text-gray-300 text-sm truncate">{error}</span>
          </div>
          <button 
            onClick={refetch}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors self-start"
          >
            재시도
          </button>
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className={`bg-gradient-to-br ${getSeasonGradient(data.season)} rounded-xl shadow-lg border ${getSeasonBorder(data.season)} overflow-hidden ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 제목 + 지수 정보 */}
          <div className="flex flex-col space-y-3 flex-1">
            {/* 제목 라인 */}
            <div className="flex items-center space-x-2">
              <span className="text-xl">{data.emoji}</span>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                알트코인 시즌 지수
              </h2>
              <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  CMC
                </span>
              </div>
            </div>
            
            {/* 지수 표시 */}
            <div className="flex items-center space-x-4">
              {/* 점수 게이지 */}
              <div className="flex-1 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Bitcoin</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Altcoin</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      data.season === 'altcoin' 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                        : 'bg-gradient-to-r from-orange-400 to-yellow-500'
                    }`}
                    style={{ width: `${data.points}%` }}
                  ></div>
                  <div 
                    className="absolute top-0 w-1 h-3 bg-white dark:bg-gray-800 rounded-full transform -translate-x-0.5"
                    style={{ left: '50%' }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">0</span>
                  <span className="text-xs text-gray-500">50</span>
                  <span className="text-xs text-gray-500">100</span>
                </div>
              </div>
              
              {/* 점수 표시 */}
              <div className="text-center">
                <div className={`text-2xl font-bold ${data.color}`}>
                  {data.points}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  포인트
                </div>
              </div>
            </div>
            
            {/* 설명 */}
            <div className={`text-sm font-medium ${data.color}`}>
              {data.description}
            </div>
          </div>
          
          {/* 오른쪽: 새로고침 버튼 */}
          <div className="flex flex-col items-end space-y-2 ml-4">
            <button 
              onClick={refetch}
              className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
            >
              새로고침
            </button>
          </div>
        </div>
        
        {/* 하단 정보 */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {isFallback ? (
                '⚠️ API 일시 불가 - 기본값 표시'
              ) : (
                `업데이트: ${lastUpdated ? formatLastUpdated(lastUpdated) : '실시간'}`
              )}
            </span>
            <span>
              데이터 제공: CoinMarketCap
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});
