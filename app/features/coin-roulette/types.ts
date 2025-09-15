/**
 * 코인 룰렛 기능 타입 정의
 */

export interface CoinInfo {
  symbol: string;
  isAlpha: boolean;
  displayName?: string;
}

export interface RouletteResult {
  coin: CoinInfo;
  timestamp: number;
  animationDuration: number;
}

export interface RouletteHistory {
  results: RouletteResult[];
  totalSpins: number;
  favoriteCoins: Record<string, number>; // 뽑힌 횟수
}

export interface RouletteAnimation {
  isSpinning: boolean;
  currentPhase: 'idle' | 'spinning' | 'slowing' | 'stopped';
  duration: number;
}

export type CoinCategory = 'all' | 'binance' | 'alpha';
