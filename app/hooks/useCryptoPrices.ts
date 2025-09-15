'use client';

import { useState, useEffect, useCallback } from 'react';
import { CryptoPrice } from '../lib/types';
import { getAllTickers, getTicker } from '../lib/bithumb-api';

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchPrices = useCallback(async (isRetry = false) => {
    try {
      console.log('🔄 Starting fetchPrices...', isRetry ? `(retry ${retryCount + 1})` : '');
      setLoading(true);
      setError(null);
      
      const data = await getAllTickers();
      console.log('✅ Prices fetched successfully:', data.length, 'items');
      
      setPrices(data);
      setRetryCount(0); // 성공 시 재시도 카운터 리셋
    } catch (error) {
      console.error('❌ fetchPrices failed:', error);
      
      let errorMessage = '암호화폐 시세를 불러올 수 없습니다';
      
      if (error instanceof Error) {
        if (error.message.includes('시간 초과') || error.message.includes('timeout')) {
          errorMessage = '서버 응답이 지연되고 있습니다. 잠시 후 자동으로 재시도됩니다.';
        } else if (error.message.includes('네트워크') || error.message.includes('연결')) {
          errorMessage = '네트워크 연결을 확인해주세요. 자동으로 재시도됩니다.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = '서버에 연결할 수 없습니다. 자동으로 재시도됩니다.';
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
          fetchPrices(true);
        }, (retryCount + 1) * 5000); // 5초, 10초, 15초 간격
      }
      
      // 네트워크 오류인 경우 기존 데이터 유지
      if (errorMessage.includes('네트워크') || errorMessage.includes('연결')) {
        console.log('📡 Network error detected, keeping existing data');
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchPrices();
    
    // 60초마다 업데이트 (더 긴 간격으로 서버 부하 감소)
    const interval = setInterval(() => fetchPrices(), 60000);
    
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return {
    prices,
    loading,
    error,
    retryCount,
    refetch: () => fetchPrices()
  };
}

export function useCryptoPrice(symbol: string) {
  const [price, setPrice] = useState<CryptoPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    try {
      console.log('🔄 Fetching price for:', symbol);
      setLoading(true);
      setError(null);
      const data = await getTicker(symbol);
      console.log('✅ Price fetched for', symbol, ':', data?.current_price);
      setPrice(data);
    } catch (error) {
      console.error('❌ fetchPrice failed for', symbol, ':', error);
      const errorMessage = error instanceof Error ? error.message : `Failed to fetch price for ${symbol}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    if (symbol) {
      fetchPrice();
      
      // 10초마다 업데이트
      const interval = setInterval(fetchPrice, 10000);
      
      return () => clearInterval(interval);
    }
  }, [fetchPrice, symbol]);

  return {
    price,
    loading,
    error,
    refetch: fetchPrice
  };
}
