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
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <div className="flex items-center space-x-2">
          <div className="text-red-500">⚠️</div>
          <div className="text-sm text-red-700 dark:text-red-300">
            글로벌 데이터를 불러올 수 없습니다
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            📊 글로벌 시장 현황
          </h2>
          {lastUpdated && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {lastUpdated.toLocaleTimeString('ko-KR')} 업데이트
            </div>
          )}
        </div>

        {isLoading && !data ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : data ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 비트코인 도미넌스 */}
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {data.market_cap_percentage.btc.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
                BTC 도미넌스
              </div>
            </div>

            {/* 이더리움 도미넌스 */}
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data.market_cap_percentage.eth.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
                ETH 도미넌스
              </div>
            </div>

            {/* 총 시가총액 */}
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatMarketCap(data.total_market_cap.usd)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
                총 시가총액
              </div>
            </div>

            {/* 24시간 거래량 */}
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatVolume(data.total_volume.usd)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">
                24시간 거래량
              </div>
            </div>
          </div>
        ) : null}

        {data && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                활성 암호화폐: <span className="font-medium">{data.active_cryptocurrencies.toLocaleString()}개</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
