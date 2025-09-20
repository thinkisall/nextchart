'use client';

import { useState, useEffect, useCallback } from 'react';

export interface TopGainerCoin {
  id: number;
  name: string;
  symbol: string;
  price: number;
  percent_change_24h: number;
  volume_24h: number;
  market_cap: number;
  rank: number;
}

interface TopGainersResponse {
  data: TopGainerCoin[];
  timestamp: string;
}

export function useTopGainers() {
  const [data, setData] = useState<TopGainerCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchTopGainers = useCallback(async (isRetry = false) => {
    try {
      console.log('🚀 Fetching top gainers...', isRetry ? `(retry ${retryCount + 1})` : '');
      setLoading(true);
      setError(null);

      const response = await fetch('/api/cmc-top-gainers', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: TopGainersResponse = await response.json();
      
      console.log('✅ Top gainers fetched successfully:', result.data.length, 'coins');
      
      setData(result.data);
      setLastUpdated(result.timestamp);
      setRetryCount(0); // 성공 시 재시도 카운터 리셋
      
    } catch (error) {
      console.error('❌ fetchTopGainers failed:', error);
      
      let errorMessage = '해외 급등주 데이터를 불러올 수 없습니다';
      
      if (error instanceof Error) {
        if (error.message.includes('API 키')) {
          errorMessage = 'API 키 설정을 확인해주세요';
        } else if (error.message.includes('네트워크') || error.message.includes('fetch')) {
          errorMessage = '네트워크 연결을 확인해주세요';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      // 자동 재시도 로직 (최대 3번)
      if (retryCount < 3 && !(error instanceof Error && error.message?.includes('API 키'))) {
        console.log(`🔄 Auto-retry in ${(retryCount + 1) * 10} seconds...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchTopGainers(true);
        }, (retryCount + 1) * 10000); // 10초, 20초, 30초 간격
      }
      
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchTopGainers();
    
    // 5분마다 업데이트
    const interval = setInterval(() => fetchTopGainers(), 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchTopGainers]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    retryCount,
    refetch: () => fetchTopGainers(false),
  };
}
