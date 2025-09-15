import { BINANCE_COINS, BINANCE_ALPHA_COINS } from '../../../lib/exchanges/binance-coins';
import type { CoinInfo, RouletteResult, CoinCategory } from '../types';

/**
 * 코인 룰렛 서비스 클래스
 * 코인 선택, 랜덤 생성, 히스토리 관리를 담당
 */
export class CoinRouletteService {
  
  /**
   * 바이낸스 코인 배열 생성
   */
  static getBinanceCoins(): CoinInfo[] {
    return Array.from(BINANCE_COINS).map(symbol => ({
      symbol,
      isAlpha: false,
      displayName: symbol
    }));
  }

  /**
   * 바이낸스 알파 코인 배열 생성
   */
  static getBinanceAlphaCoins(): CoinInfo[] {
    return Array.from(BINANCE_ALPHA_COINS).map(symbol => ({
      symbol,
      isAlpha: true,
      displayName: `${symbol} (Alpha)`
    }));
  }

  /**
   * 카테고리에 따른 코인 배열 반환
   */
  static getCoinsByCategory(category: CoinCategory): CoinInfo[] {
    switch (category) {
      case 'binance':
        return this.getBinanceCoins();
      case 'alpha':
        return this.getBinanceAlphaCoins();
      case 'all':
      default:
        return [...this.getBinanceCoins(), ...this.getBinanceAlphaCoins()];
    }
  }

  /**
   * 랜덤 코인 선택
   */
  static getRandomCoin(category: CoinCategory = 'all'): CoinInfo {
    const coins = this.getCoinsByCategory(category);
    
    if (coins.length === 0) {
      throw new Error('선택 가능한 코인이 없습니다.');
    }

    const randomIndex = Math.floor(Math.random() * coins.length);
    return coins[randomIndex];
  }

  /**
   * 룰렛 결과 생성 (애니메이션 시간 포함)
   */
  static generateRouletteResult(category: CoinCategory = 'all'): RouletteResult {
    const coin = this.getRandomCoin(category);
    
    // 2~4초 사이의 랜덤 애니메이션 시간
    const animationDuration = 2000 + Math.random() * 2000;
    
    return {
      coin,
      timestamp: Date.now(),
      animationDuration
    };
  }

  /**
   * 가중치 기반 랜덤 선택 (특별 이벤트용)
   * 알파 코인 가중치를 높일 수 있음
   */
  static getWeightedRandomCoin(alphaWeight: number = 1): CoinInfo {
    const binanceCoins = this.getBinanceCoins();
    const alphaCoins = this.getBinanceAlphaCoins();
    
    // 가중치 적용
    const weightedPool: CoinInfo[] = [
      ...binanceCoins,
      ...Array(Math.floor(alphaWeight)).fill(alphaCoins).flat()
    ];
    
    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    return weightedPool[randomIndex];
  }

  /**
   * 코인 정보 포맷팅
   */
  static formatCoinDisplay(coin: CoinInfo): string {
    const prefix = coin.isAlpha ? '🔥 ' : '📈 ';
    const suffix = coin.isAlpha ? ' (Alpha)' : '';
    return `${prefix}${coin.symbol}${suffix}`;
  }

  /**
   * 룰렛 통계 생성
   */
  static generateStats(results: RouletteResult[]) {
    const totalSpins = results.length;
    const alphaCount = results.filter(r => r.coin.isAlpha).length;
    const binanceCount = totalSpins - alphaCount;
    
    // 가장 많이 뽑힌 코인
    const coinCounts: Record<string, number> = {};
    results.forEach(result => {
      const key = result.coin.symbol;
      coinCounts[key] = (coinCounts[key] || 0) + 1;
    });
    
    const mostPicked = Object.entries(coinCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    return {
      totalSpins,
      alphaCount,
      binanceCount,
      alphaPercentage: totalSpins > 0 ? (alphaCount / totalSpins * 100).toFixed(1) : '0',
      mostPicked
    };
  }
}
