import { CryptoPrice } from '../../../lib/types';
import { BINANCE_COINS, BINANCE_ALPHA_COINS } from '../../../lib/exchanges/binance-coins';
import { UPBIT_COINS } from '../../../lib/exchanges/upbit-coins';
import { UPBIT_USDT_COINS } from '../../../lib/exchanges/upbit-usdt-coins';
import type { ExchangeStats, ExchangePerformance, ExchangeType } from '../types';

/**
 * 거래소별 성과 분석 서비스
 * 코인 데이터를 거래소별로 분류하고 통계를 계산
 */
export class ExchangePerformanceService {
  
  /**
   * 거래소별 코인 필터링
   */
  static filterCoinsByExchange(coins: CryptoPrice[], exchangeType: ExchangeType): CryptoPrice[] {
    return coins.filter(coin => {
      const symbol = coin.symbol.replace('_KRW', '').replace('_USDT', '');
      
      switch (exchangeType) {
        case 'bithumb':
          return true; // 모든 코인 (빗썸 데이터 기준)
        case 'upbit':
          return UPBIT_COINS.has(symbol);
        case 'upbitUsdt':
          return UPBIT_USDT_COINS.has(symbol);
        case 'binance':
          return BINANCE_COINS.has(symbol);
        case 'binanceAlpha':
          return BINANCE_ALPHA_COINS.has(symbol);
        default:
          return false;
      }
    });
  }

  /**
   * 거래소별 통계 계산
   */
  static calculateExchangeStats(
    coins: CryptoPrice[], 
    exchangeType: ExchangeType
  ): ExchangeStats {
    const exchangeCoins = this.filterCoinsByExchange(coins, exchangeType);
    const totalCoins = exchangeCoins.length;
    
    if (totalCoins === 0) {
      return this.getEmptyStats(exchangeType);
    }

    // 상승/하락 코인 분류
    const positiveCoins = exchangeCoins.filter(coin => coin.change_rate > 0);
    const negativeCoins = exchangeCoins.filter(coin => coin.change_rate < 0);
    
    // 평균 변동률 계산
    const totalChange = exchangeCoins.reduce((sum, coin) => sum + coin.change_rate, 0);
    const averageChange = totalChange / totalCoins;
    
    // 상위/하위 코인들 (최대 3개씩)
    const sortedCoins = [...exchangeCoins].sort((a, b) => b.change_rate - a.change_rate);
    const topGainers = sortedCoins.slice(0, 3);
    const topLosers = sortedCoins.slice(-3).reverse();
    
    const positivePercentage = (positiveCoins.length / totalCoins) * 100;

    return {
      ...this.getExchangeInfo(exchangeType),
      totalCoins,
      positiveCoins: positiveCoins.length,
      negativeCoins: negativeCoins.length,
      averageChange,
      topGainers,
      topLosers,
      positivePercentage
    };
  }

  /**
   * 거래소 정보 반환
   */
  static getExchangeInfo(exchangeType: ExchangeType) {
    const exchanges = {
      bithumb: {
        name: 'bithumb',
        displayName: '빗썸 전체',
        icon: '🏛️',
        color: 'from-blue-500 to-blue-600'
      },
      upbit: {
        name: 'upbit',
        displayName: '업비트 KRW',
        icon: '🏢',
        color: 'from-green-500 to-green-600'
      },
      upbitUsdt: {
        name: 'upbitUsdt',
        displayName: '업비트 USDT',
        icon: '💵',
        color: 'from-emerald-500 to-emerald-600'
      },
      binance: {
        name: 'binance',
        displayName: '바이낸스',
        icon: '📈',
        color: 'from-yellow-500 to-orange-500'
      },
      binanceAlpha: {
        name: 'binanceAlpha',
        displayName: '바이낸스 알파',
        icon: '🔥',
        color: 'from-purple-500 to-pink-500'
      }
    };

    return exchanges[exchangeType];
  }

  /**
   * 빈 통계 객체 반환
   */
  static getEmptyStats(exchangeType: ExchangeType): ExchangeStats {
    return {
      ...this.getExchangeInfo(exchangeType),
      totalCoins: 0,
      positiveCoins: 0,
      negativeCoins: 0,
      averageChange: 0,
      topGainers: [],
      topLosers: [],
      positivePercentage: 0
    };
  }

  /**
   * 전체 거래소 성과 분석
   */
  static analyzeAllExchanges(coins: CryptoPrice[]): ExchangePerformance {
    return {
      bithumb: this.calculateExchangeStats(coins, 'bithumb'),
      upbit: this.calculateExchangeStats(coins, 'upbit'),
      upbitUsdt: this.calculateExchangeStats(coins, 'upbitUsdt'),
      binance: this.calculateExchangeStats(coins, 'binance'),
      binanceAlpha: this.calculateExchangeStats(coins, 'binanceAlpha')
    };
  }

  /**
   * 상승률 기준 거래소 랭킹
   */
  static getRankingByChange(performance: ExchangePerformance): ExchangeStats[] {
    return Object.values(performance)
      .filter(exchange => exchange.totalCoins > 0)
      .sort((a, b) => b.averageChange - a.averageChange);
  }

  /**
   * 상승 코인 비율 기준 거래소 랭킹
   */
  static getRankingByPositivePercentage(performance: ExchangePerformance): ExchangeStats[] {
    return Object.values(performance)
      .filter(exchange => exchange.totalCoins > 0)
      .sort((a, b) => b.positivePercentage - a.positivePercentage);
  }

  /**
   * 성과 요약 텍스트 생성
   */
  static generateSummary(performance: ExchangePerformance): string {
    const ranking = this.getRankingByChange(performance);
    
    if (ranking.length === 0) {
      return "데이터를 불러오는 중입니다...";
    }

    const best = ranking[0];
    const avgChange = best.averageChange > 0 ? '+' : '';
    
    return `오늘 가장 좋은 성과를 보이는 거래소는 ${best.displayName}입니다. ` +
           `평균 ${avgChange}${best.averageChange.toFixed(2)}% 변동률을 기록하고 있습니다.`;
  }

  /**
   * 퍼센트 포맷팅
   */
  static formatPercentage(value: number): string {
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value.toFixed(2)}%`;
  }

  /**
   * 거래소별 색상 테마 반환
   */
  static getExchangeTheme(exchangeType: ExchangeType) {
    const themes = {
      bithumb: {
        bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
        border: 'border-blue-200 dark:border-blue-700',
        text: 'text-blue-700 dark:text-blue-300'
      },
      upbit: {
        bg: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
        border: 'border-green-200 dark:border-green-700',
        text: 'text-green-700 dark:text-green-300'
      },
      upbitUsdt: {
        bg: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20',
        border: 'border-emerald-200 dark:border-emerald-700',
        text: 'text-emerald-700 dark:text-emerald-300'
      },
      binance: {
        bg: 'from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20',
        border: 'border-yellow-200 dark:border-orange-700',
        text: 'text-orange-700 dark:text-orange-300'
      },
      binanceAlpha: {
        bg: 'from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20',
        border: 'border-purple-200 dark:border-pink-700',
        text: 'text-purple-700 dark:text-pink-300'
      }
    };

    return themes[exchangeType];
  }
}
