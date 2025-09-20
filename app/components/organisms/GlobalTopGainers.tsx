'use client';

import { memo, useState } from 'react';
import { useTopGainers } from '../../hooks/useTopGainers';
import { TopGainerCoinCard } from '../atoms/TopGainerCoinCard';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

interface GlobalTopGainersProps {
  className?: string;
}

export const GlobalTopGainers = memo(function GlobalTopGainers({ 
  className = '' 
}: GlobalTopGainersProps) {
  const { data, loading, error, lastUpdated, refetch } = useTopGainers();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatLastUpdated = (timestamp: string | null) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return '방금';
    if (diffMins < 60) return `${diffMins}분`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간`;
    
    return '오늘';
  };

  if (loading && !data.length) {
    return (
      <section className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 ${className}`}>
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
            해외 급등주 로딩 중...
          </span>
        </div>
      </section>
    );
  }

  if (error && !data.length) {
    return (
      <section className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 ${className}`}>
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

  return (
    <section className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* 모바일 최적화된 헤더 */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 제목 + 상위 코인들 */}
          <div className="flex flex-col space-y-2 flex-1 min-w-0">
            {/* 제목 라인 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🚀</span>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  해외 급등주
                </h2>
                <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                    LIVE
                  </span>
                </div>
              </div>
              
              {/* 확장 버튼 */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                  flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-medium
                  ${isExpanded 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                <span className="hidden xs:inline">
                  {isExpanded ? '접기' : 'TOP 10'}
                </span>
                <span className="xs:hidden">
                  {isExpanded ? '접기' : '전체'}
                </span>
                <svg 
                  className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* 상위 3개 미리보기 (더 컴팩트하게) */}
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {data.slice(0, 3).map((coin, index) => (
                <TopGainerCoinCard
                  key={coin.id}
                  rank={index + 1}
                  symbol={coin.symbol}
                  name={coin.name}
                  price={coin.price}
                  percentChange={coin.percent_change_24h}
                  marketCap={coin.market_cap}
                  isCompact={true}
                  onClick={() => {
                    window.open(`https://coinmarketcap.com/currencies/${coin.name.toLowerCase().replace(/\s+/g, '-')}/`, '_blank');
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* 업데이트 시간 (별도 라인) */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            업데이트: {lastUpdated ? formatLastUpdated(lastUpdated) : '실시간'}
          </div>
          <button 
            onClick={refetch}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* 확장된 내용 */}
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-3 pb-3">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            {/* 전체 TOP 10 그리드 - 모바일 최적화 */}
            {data.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {data.map((coin, index) => (
                  <TopGainerCoinCard
                    key={coin.id}
                    rank={index + 1}
                    symbol={coin.symbol}
                    name={coin.name}
                    price={coin.price}
                    percentChange={coin.percent_change_24h}
                    marketCap={coin.market_cap}
                    isCompact={false}
                    onClick={() => {
                      window.open(`https://coinmarketcap.com/currencies/${coin.name.toLowerCase().replace(/\s+/g, '-')}/`, '_blank');
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-gray-400 text-3xl mb-2">📊</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  급등주 데이터를 불러올 수 없습니다
                </p>
              </div>
            )}

            {/* 푸터 정보 - 모바일 최적화 */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-1 text-xs text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  💡 최소 거래량: $100K | 최소 시총: $10M
                </div>
                <div className="text-center">
                  데이터 제공: CoinMarketCap
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
