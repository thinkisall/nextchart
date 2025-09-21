'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTrendingData } from '../lib/services/coingecko';
import type { 
  ProcessedTrendingData, 
  CoinGeckoTrendingResponse,
  TrendingCoin,
  TrendingNFT,
  TrendingCategory
} from '../lib/services/coingecko';

interface UseTrendingDataReturn {
  data: ProcessedTrendingData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * CoinGecko 트렌딩 데이터를 관리하는 커스텀 훅
 * 5분마다 자동 새로고침
 */
export function useTrendingData(): UseTrendingDataReturn {
  const [data, setData] = useState<ProcessedTrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 데이터 처리 함수
  const processData = useCallback((rawData: CoinGeckoTrendingResponse): ProcessedTrendingData => {
    return {
      trendingCoins: rawData.coins.map(coin => coin.item).slice(0, 15),
      trendingNFTs: rawData.nfts.slice(0, 7),
      trendingCategories: rawData.categories.slice(0, 6),
      lastUpdated: new Date().toISOString()
    };
  }, []);

  // 데이터 페치 함수
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getTrendingData();
      
      if (result.success && result.data) {
        const processed = processData(result.data);
        setData(processed);
        setLastUpdated(new Date());
      } else {
        setError(result.error || 'Failed to fetch trending data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [processData]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 5분마다 자동 새로고침
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000); // 5분

    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    lastUpdated
  };
}
