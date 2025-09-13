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
      setLoading(true);
      setError(null);
      const data = await getAllTickers();
      setPrices(data);
    } catch (error) {
      setError('Failed to fetch crypto prices');
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
      setLoading(true);
      setError(null);
      const data = await getTicker(symbol);
      setPrice(data);
    } catch (error) {
      setError(`Failed to fetch price for ${symbol}`);
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