'use client';

import { useState, useEffect, useCallback } from 'react';

export interface BinanceTopGainer {
  symbol: string;
  baseAsset: string;
  priceChangePercent: number;
  lastPrice: number;
  volume: number;
  quoteVolume: number;
  rank: number;
}

interface BinanceTopGainersResponse {
  data: BinanceTopGainer[];
  timestamp: string;
  source: string;
  success: boolean;
}

export function useBinanceTopGainers() {
  const [data, setData] = useState<BinanceTopGainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchBinanceTopGainers = useCallback(async (isRetry = false) => {
    try {
      console.log('🔥 Fetching Binance top gainers...', isRetry ? `(retry ${retryCount + 1})` : '');
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15초 타임아웃

      const response = await fetch('/api/binance-top-gainers', {
        headers: {
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: BinanceTopGainersResponse = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error('응답 데이터가 올바르지 않습니다');
      }
      
      console.log('✅ Binance top gainers fetched successfully:', result.data.length, 'coins');
      
      setData(result.data);
      setLastUpdated(result.timestamp);
      setRetryCount(0); // 성공 시 재시도 카운터 리셋
      
    } catch (error) {
      console.error('❌ fetchBinanceTopGainers failed:', error);
      
      let errorMessage = '바이낸스 급등주 데이터를 불러올 수 없습니다';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = '요청 시간 초과 - 네트워크를 확인해주세요';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = '서버에 연결할 수 없습니다';
        } else if (error.message.includes('timeout')) {
          errorMessage = '서버 응답 시간 초과';
        } else if (error.message.includes('rate limit')) {
          errorMessage = '요청 한도 초과 - 잠시 후 다시 시도해주세요';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      // 자동 재시도 로직 (최대 3번)
      if (retryCount < 3) {
        const delay = (retryCount + 1) * 5000; // 5초, 10초, 15초 간격
        console.log(`🔄 Auto-retry in ${delay / 1000} seconds...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchBinanceTopGainers(true);
        }, delay);
      }
      
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchBinanceTopGainers();
    
    // 5분마다 업데이트
    const interval = setInterval(() => fetchBinanceTopGainers(), 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchBinanceTopGainers]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    retryCount,
    refetch: () => fetchBinanceTopGainers(false),
  };
}
