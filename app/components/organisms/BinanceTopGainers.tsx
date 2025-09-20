'use client';

import { memo, useState } from 'react';
import { useBinanceTopGainers } from '../../hooks/useBinanceTopGainers';
import { BinanceCoinCard } from '../atoms/BinanceCoinCard';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

interface BinanceTopGainersProps {
  className?: string;
}

export const BinanceTopGainers = memo(function BinanceTopGainers({ 
  className = '' 
}: BinanceTopGainersProps) {
  const { data, loading, error, lastUpdated, isFallback, refetch } = useBinanceTopGainers();
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
      <section className={`bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl shadow-lg border border-yellow-200 dark:border-yellow-700/50 p-3 ${className}`}>
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-yellow-700 dark:text-yellow-300 text-sm">
            글로벌 급등주 로딩 중...
          </span>
        </div>
      </section>
    );
  }

  if (error && !data.length) {
    return (
      <section className={`bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl shadow-lg border border-yellow-200 dark:border-yellow-700/50 p-3 ${className}`}>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-yellow-700 dark:text-yellow-300 text-sm truncate">{error}</span>
          </div>
          <button 
            onClick={refetch}
            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs transition-colors self-start"
          >
            재시도
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl shadow-lg border border-yellow-200 dark:border-yellow-700/50 overflow-hidden ${className}`}>
      {/* 모바일 최적화된 헤더 */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 제목 + 상위 코인들 */}
          <div className="flex flex-col space-y-2 flex-1 min-w-0">
            {/* 제목 라인 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚡</span>
                <h2 className="text-base font-bold text-yellow-800 dark:text-yellow-200">
                  글로벌 급등주
                </h2>
                <div className="flex items-center space-x-1 bg-yellow-200 dark:bg-yellow-800/50 px-2 py-0.5 rounded-full">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
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
                    ? 'bg-yellow-500 text-white shadow-md' 
                    : 'bg-yellow-200 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-300 dark:hover:bg-yellow-700/50'
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
              {data.slice(0, 3).map((coin) => (
                <BinanceCoinCard
                  key={coin.symbol}
                  rank={coin.rank}
                  symbol={coin.symbol}
                  baseAsset={coin.baseAsset}
                  price={coin.lastPrice}
                  percentChange={coin.priceChangePercent}
                  volume={coin.volume}
                  quoteVolume={coin.quoteVolume}
                  isCompact={true}
                  onClick={() => {
                    window.open(`https://www.binance.com/en/trade/${coin.symbol}`, '_blank');
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* 업데이트 시간 (별도 라인) */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-yellow-200 dark:border-yellow-700/50">
          <div className="text-xs text-yellow-600 dark:text-yellow-400">
            {isFallback ? (
              <span className="flex items-center space-x-1">
                <span>⚠️</span>
                <span>데모 데이터 (API 일시 제한)</span>
              </span>
            ) : (
              <span>업데이트: {lastUpdated ? formatLastUpdated(lastUpdated) : '실시간'}</span>
            )}
          </div>
          <button 
            onClick={refetch}
            className="text-xs text-yellow-700 dark:text-yellow-300 hover:underline"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* 확장된 내용 */}
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-3 pb-3">
          <div className="border-t border-yellow-200 dark:border-yellow-700/50 pt-3">
            {/* 전체 TOP 10 그리드 - 모바일 최적화 */}
            {data.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {data.map((coin) => (
                  <BinanceCoinCard
                    key={coin.symbol}
                    rank={coin.rank}
                    symbol={coin.symbol}
                    baseAsset={coin.baseAsset}
                    price={coin.lastPrice}
                    percentChange={coin.priceChangePercent}
                    volume={coin.volume}
                    quoteVolume={coin.quoteVolume}
                    isCompact={false}
                    onClick={() => {
                      window.open(`https://www.binance.com/en/trade/${coin.symbol}`, '_blank');
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-yellow-400 text-3xl mb-2">⚡</div>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  글로벌 급등주 데이터를 불러올 수 없습니다
                </p>
              </div>
            )}

            {/* 푸터 정보 - 모바일 최적화 */}
            <div className="mt-4 pt-3 border-t border-yellow-200 dark:border-yellow-700/50">
              <div className="flex flex-col space-y-1 text-xs text-yellow-600 dark:text-yellow-400">
                {isFallback ? (
                  <>
                    <div className="text-center">
                      ⚠️ 실시간 API 일시 제한으로 데모 데이터를 표시중입니다
                    </div>
                    <div className="text-center">
                      잠시 후 새로고침을 시도해주세요
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      💡 글로벌 암호화폐 거래소 데이터 기반
                    </div>
                    <div className="text-center">
                      데이터 제공: CoinGecko API
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
