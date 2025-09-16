import { useMemo, useEffect, useState } from 'react';
import { CryptoPrice } from '../../../lib/types';
import { ExchangePerformanceService } from '../services/exchangePerformanceService';
import type { ExchangePerformance, PerformanceFilter } from '../types';

/**
 * 거래소 성과 분석 훅
 * 코인 데이터를 기반으로 거래소별 성과 통계를 계산
 * 실시간 데이터 업데이트 지원
 */
export function useExchangePerformance(
  coins: CryptoPrice[],
  filter: PerformanceFilter = {
    sortBy: 'averageChange',
    sortOrder: 'desc',
    showOnlyPositive: false
  }
) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 데이터 변경 시 타임스탬프 업데이트
  useEffect(() => {
    if (coins && coins.length > 0) {
      setLastUpdate(new Date());
    }
  }, [coins]);
  // 거래소별 성과 분석
  const performance = useMemo((): ExchangePerformance => {
    if (!coins || coins.length === 0) {
      return {
        bithumb: ExchangePerformanceService.getEmptyStats('bithumb'),
        upbit: ExchangePerformanceService.getEmptyStats('upbit'),
        upbitUsdt: ExchangePerformanceService.getEmptyStats('upbitUsdt'),
        binance: ExchangePerformanceService.getEmptyStats('binance'),
        binanceAlpha: ExchangePerformanceService.getEmptyStats('binanceAlpha')
      };
    }

    return ExchangePerformanceService.analyzeAllExchanges(coins);
  }, [coins]);

  // 필터링된 거래소 목록
  const filteredExchanges = useMemo(() => {
    let exchanges = Object.values(performance);

    // 양수 필터
    if (filter.showOnlyPositive) {
      exchanges = exchanges.filter(exchange => exchange.averageChange > 0);
    }

    // 정렬
    exchanges.sort((a, b) => {
      const aValue = a[filter.sortBy] as number;
      const bValue = b[filter.sortBy] as number;
      
      return filter.sortOrder === 'desc' 
        ? bValue - aValue 
        : aValue - bValue;
    });

    return exchanges;
  }, [performance, filter]);

  // 성과 요약
  const summary = useMemo(() => {
    return ExchangePerformanceService.generateSummary(performance);
  }, [performance]);

  // 최고/최저 성과 거래소
  const bestPerformer = useMemo(() => {
    const ranking = ExchangePerformanceService.getRankingByChange(performance);
    return ranking.length > 0 ? ranking[0] : null;
  }, [performance]);

  const worstPerformer = useMemo(() => {
    const ranking = ExchangePerformanceService.getRankingByChange(performance);
    return ranking.length > 0 ? ranking[ranking.length - 1] : null;
  }, [performance]);

  // 로딩 상태
  const isLoading = !coins || coins.length === 0;

  return {
    // 데이터
    performance,
    filteredExchanges,
    bestPerformer,
    worstPerformer,
    summary,
    
    // 상태
    isLoading,
    lastUpdate,
    
    // 통계
    totalExchanges: Object.keys(performance).length,
    activeExchanges: filteredExchanges.filter(e => e.totalCoins > 0).length
  };
}
