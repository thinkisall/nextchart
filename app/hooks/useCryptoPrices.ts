'use client';

import { useState, useEffect, useCallback } from 'react';
import { CryptoPrice } from '../lib/types';
import { getAllTickers, getTicker } from '../lib/bithumb-api';

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      console.log('🔄 Starting fetchPrices...');
      setLoading(true);
      setError(null);
      const data = await getAllTickers();
      console.log('✅ Prices fetched successfully:', data.length, 'items');
      setPrices(data);
    } catch (error) {
      console.error('❌ fetchPrices failed:', error);
      
      let errorMessage = '암호화폐 시세를 불러올 수 없습니다';
      
      if (error instanceof Error) {
        if (error.message.includes('시간 초과')) {
          errorMessage = '서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.message.includes('네트워크')) {
          errorMessage = '인터넷 연결을 확인해주세요.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      // 네트워크 오류인 경우 기존 데이터 유지
      if (errorMessage.includes('네트워크') || errorMessage.includes('연결')) {
        console.log('📡 Network error detected, keeping existing data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    
    // 30초마다 업데이트 (WebSocket이 없을 때)
    const interval = setInterval(fetchPrices, 30000);
    
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return {
    prices,
    loading,
    error,
    refetch: fetchPrices
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