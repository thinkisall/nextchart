'use client';

import { useState, useMemo } from 'react';
import { CryptoPrice } from '../lib/types';
import { hasUpbitUsdtPair } from '../lib/exchanges';
import type { ExchangeType } from '../features/exchange-performance/types';

/**
 * 거래소별 필터링 로직을 관리하는 커스텀 훅
 */
export function useExchangeFilter(data: CryptoPrice[]) {
  const [selectedExchange, setSelectedExchange] = useState<ExchangeType | 'all'>('all');

  // 거래소별 코인 수 계산
  const exchangeCounts = useMemo(() => {
    const counts = {
      all: data.length,
      bithumb: data.length, // 기본적으로 모든 데이터가 빗썸 기준
      upbit: data.filter(coin => coin.isOnUpbit).length,
      upbitUsdt: data.filter(coin => hasUpbitUsdtPair(coin.symbol)).length,
      binance: data.filter(coin => coin.isOnBinance).length,
      binanceAlpha: data.filter(coin => coin.isBinanceAlpha).length,
    };
    return counts;
  }, [data]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    if (selectedExchange === 'all') {
      return data;
    }

    switch (selectedExchange) {
      case 'bithumb':
        return data; // 기본 데이터가 빗썸 기준
      case 'upbit':
        return data.filter(coin => coin.isOnUpbit);
      case 'upbitUsdt':
        return data.filter(coin => hasUpbitUsdtPair(coin.symbol));
      case 'binance':
        return data.filter(coin => coin.isOnBinance);
      case 'binanceAlpha':
        return data.filter(coin => coin.isBinanceAlpha);
      default:
        return data;
    }
  }, [data, selectedExchange]);

  return {
    selectedExchange,
    setSelectedExchange,
    filteredData,
    exchangeCounts,
  };
}