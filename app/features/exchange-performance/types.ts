import { CryptoPrice } from '../../lib/types';

/**
 * 거래소 성과 분석 타입 정의
 */

export interface ExchangeStats {
  name: string;
  displayName: string;
  totalCoins: number;
  positiveCoins: number;
  negativeCoins: number;
  averageChange: number;
  topGainers: CryptoPrice[];
  topLosers: CryptoPrice[];
  positivePercentage: number;
  icon: string;
  color: string;
}

export interface ExchangePerformance {
  bithumb: ExchangeStats;
  upbit: ExchangeStats;
  upbitUsdt: ExchangeStats;
  binance: ExchangeStats;
  binanceAlpha: ExchangeStats;
}

export interface PerformanceFilter {
  sortBy: 'averageChange' | 'positivePercentage' | 'totalCoins';
  sortOrder: 'desc' | 'asc';
  showOnlyPositive: boolean;
}

export type ExchangeType = 'bithumb' | 'upbit' | 'upbitUsdt' | 'binance' | 'binanceAlpha';
