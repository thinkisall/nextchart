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

      const response = await fetch('/api/binance-top-gainers', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: BinanceTopGainersResponse = await response.json();
      
      console.log('✅ Binance top gainers fetched successfully:', result.data.length, 'coins');
      
      setData(result.data);
      setLastUpdated(result.timestamp);
      setRetryCount(0); // 성공 시 재시도 카운터 리셋
      
    } catch (error) {
      console.error('❌ fetchBinanceTopGainers failed:', error);
      
      let errorMessage = '바이낸스 급등주 데이터를 불러올 수 없습니다';
      
      if (error instanceof Error) {
        if (error.message.includes('바이낸스 API')) {
          errorMessage = '바이낸스 서버 오류가 발생했습니다';
        } else if (error.message.includes('네트워크') || error.message.includes('fetch')) {
          errorMessage = '네트워크 연결을 확인해주세요';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      // 자동 재시도 로직 (최대 3번)
      if (retryCount < 3) {
        console.log(`🔄 Auto-retry in ${(retryCount + 1) * 5} seconds...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchBinanceTopGainers(true);
        }, (retryCount + 1) * 5000); // 5초, 10초, 15초 간격
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
