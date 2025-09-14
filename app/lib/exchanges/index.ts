/**
 * 거래소 정보 통합 관리
 * 모든 거래소의 코인 정보를 한 곳에서 관리
 */

import { isBinanceCoin, isBinanceAlphaCoin, getBinanceSymbol } from './binance-coins';
import { isUpbitCoin, getUpbitSymbol } from './upbit-coins';
import { isUpbitUsdtCoin, getUpbitUsdtSymbol, hasUpbitUsdtPair } from './upbit-usdt-coins';

export interface ExchangeInfo {
  // 바이낸스 정보
  isOnBinance: boolean;
  binanceSymbol?: string;
  isBinanceAlpha: boolean;
  
  // 업비트 정보
  isOnUpbit: boolean;
  upbitSymbol?: string;
  hasUpbitUsdt: boolean;
  upbitUsdtSymbol?: string;
}

/**
 * 코인의 모든 거래소 정보를 통합해서 반환
 */
export function getExchangeInfo(symbol: string): ExchangeInfo {
  const symbolForBinance = symbol.replace('_KRW', '');
  const symbolForUpbit = symbol.replace('_KRW', '');
  const bithumbSymbol = symbol.includes('_KRW') ? symbol : `${symbol}_KRW`;

  return {
    // 바이낸스 정보
    isOnBinance: isBinanceCoin(symbolForBinance),
    binanceSymbol: getBinanceSymbol(symbolForBinance) || undefined,
    isBinanceAlpha: isBinanceAlphaCoin(symbolForBinance),
    
    // 업비트 정보
    isOnUpbit: isUpbitCoin(symbolForUpbit),
    upbitSymbol: getUpbitSymbol(symbolForUpbit) || undefined,
    hasUpbitUsdt: isUpbitUsdtCoin(bithumbSymbol),
    upbitUsdtSymbol: getUpbitUsdtSymbol(bithumbSymbol) || undefined,
  };
}

// 편의를 위한 개별 함수들 re-export
export {
  // 바이낸스
  isBinanceCoin,
  isBinanceAlphaCoin,
  getBinanceSymbol,
  // 업비트 KRW
  isUpbitCoin,
  getUpbitSymbol,
  // 업비트 USDT
  isUpbitUsdtCoin,
  getUpbitUsdtSymbol,
  hasUpbitUsdtPair,
};
