"use client";

import { useState, useEffect } from 'react';

interface GlobalData {
  market_cap_percentage: {
    btc: number;
    eth: number;
  };
  active_cryptocurrencies: number;
  total_market_cap: {
    usd: number;
  };
  total_volume: {
    usd: number;
  };
}

interface CoinGeckoResponse {
  data: GlobalData;
}

export function BitcoinDominance() {
  const [data, setData] = useState<GlobalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/coingecko-global');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: CoinGeckoResponse = await response.json();
      setData(result.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch Bitcoin dominance:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // 5분마다 자동 갱신 (CoinGecko rate limit 고려)
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    }
    return `$${(value / 1e6).toFixed(2)}M`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    }
    return `$${(value / 1e6).toFixed(1)}M`;
  };

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700/30 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-lg">⚠️</span>
          </div>
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-300">데이터 로딩 실패</h3>
            <p className="text-sm text-red-600 dark:text-red-400">글로벌 마켓 데이터를 불러올 수 없습니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🌍</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">글로벌 마켓 현황</h2>
              <p className="text-blue-100 text-sm">실시간 암호화폐 시장 지표</p>
            </div>
          </div>
          
          {lastUpdated && (
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-medium">
                  {lastUpdated.toLocaleTimeString('ko-KR')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="p-3 sm:p-4 md:p-6">
        {isLoading && !data ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
                  <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 sm:mb-3"></div>
                  <div className="h-6 sm:h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : data ? (
          <>
            {/* 주요 지표 카드들 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
              {/* 비트코인 도미넌스 */}
              <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-orange-200 dark:border-orange-700/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base md:text-lg">₿</span>
                  </div>
                  <div className="text-orange-600 dark:text-orange-400 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    도미넌스
                  </div>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-700 dark:text-orange-300 mb-1">
                  {data.market_cap_percentage.btc.toFixed(2)}%
                </div>
                <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-medium">
                  Bitcoin Dominance
                </div>
              </div>

              {/* 이더리움 도미넌스 */}
              <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-200 dark:border-blue-700/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base md:text-lg">Ξ</span>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    도미넌스
                  </div>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                  {data.market_cap_percentage.eth.toFixed(2)}%
                </div>
                <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Ethereum Dominance
                </div>
              </div>

              {/* 총 시가총액 */}
              <div className="group relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-green-200 dark:border-green-700/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">💰</span>
                  </div>
                  <div className="text-green-600 dark:text-green-400 text-xs font-medium bg-green-100 dark:bg-green-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    총액
                  </div>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 dark:text-green-300 mb-1">
                  {formatMarketCap(data.total_market_cap.usd)}
                </div>
                <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
                  Total Market Cap
                </div>
              </div>

              {/* 24시간 거래량 */}
              <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-200 dark:border-purple-700/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">📊</span>
                  </div>
                  <div className="text-purple-600 dark:text-purple-400 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    24시간
                  </div>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                  {formatVolume(data.total_volume.usd)}
                </div>
                <div className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium">
                  24h Volume
                </div>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    활성 암호화폐
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {data.active_cryptocurrencies.toLocaleString()}개
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
