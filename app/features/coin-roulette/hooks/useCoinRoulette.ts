import { useState, useCallback, useEffect } from 'react';
import { CoinRouletteService } from '../services/coinRouletteService';
import type { 
  RouletteResult, 
  RouletteAnimation, 
  RouletteHistory, 
  CoinCategory 
} from '../types';

/**
 * 코인 룰렛 상태 관리 훅
 * 룰렛 애니메이션, 결과, 히스토리를 통합 관리
 */
export function useCoinRoulette() {
  const [animation, setAnimation] = useState<RouletteAnimation>({
    isSpinning: false,
    currentPhase: 'idle',
    duration: 0
  });

  const [currentResult, setCurrentResult] = useState<RouletteResult | null>(null);
  const [category, setCategory] = useState<CoinCategory>('all');
  const [history, setHistory] = useState<RouletteHistory>({
    results: [],
    totalSpins: 0,
    favoriteCoins: {}
  });

  // 로컬 스토리지에서 히스토리 로드
  useEffect(() => {
    const savedHistory = localStorage.getItem('coin-roulette-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.warn('룰렛 히스토리 로드 실패:', error);
      }
    }
  }, []);

  // 히스토리 저장
  const saveHistory = useCallback((newHistory: RouletteHistory) => {
    setHistory(newHistory);
    localStorage.setItem('coin-roulette-history', JSON.stringify(newHistory));
  }, []);

  // 룰렛 스핀 실행
  const spin = useCallback(async () => {
    if (animation.isSpinning) return;

    try {
      // 결과 생성
      const result = CoinRouletteService.generateRouletteResult(category);
      
      // 애니메이션 시작
      setAnimation({
        isSpinning: true,
        currentPhase: 'spinning',
        duration: result.animationDuration
      });

      // 스핀 중 단계별 상태 변경
      setTimeout(() => {
        setAnimation(prev => ({
          ...prev,
          currentPhase: 'slowing'
        }));
      }, result.animationDuration * 0.7);

      // 애니메이션 완료 후 결과 표시
      setTimeout(() => {
        setCurrentResult(result);
        setAnimation({
          isSpinning: false,
          currentPhase: 'stopped',
          duration: 0
        });

        // 히스토리 업데이트
        const newHistory: RouletteHistory = {
          results: [result, ...history.results].slice(0, 50), // 최근 50개만 저장
          totalSpins: history.totalSpins + 1,
          favoriteCoins: {
            ...history.favoriteCoins,
            [result.coin.symbol]: (history.favoriteCoins[result.coin.symbol] || 0) + 1
          }
        };
        
        saveHistory(newHistory);
      }, result.animationDuration);

    } catch (error) {
      console.error('룰렛 스핀 실패:', error);
      setAnimation({
        isSpinning: false,
        currentPhase: 'idle',
        duration: 0
      });
    }
  }, [animation.isSpinning, category, history, saveHistory]);

  // 히스토리 초기화
  const clearHistory = useCallback(() => {
    const emptyHistory: RouletteHistory = {
      results: [],
      totalSpins: 0,
      favoriteCoins: {}
    };
    saveHistory(emptyHistory);
  }, [saveHistory]);

  // 통계 계산
  const stats = CoinRouletteService.generateStats(history.results);

  return {
    // 상태
    animation,
    currentResult,
    category,
    history,
    stats,
    
    // 액션
    spin,
    setCategory,
    clearHistory,
    
    // 계산된 값들
    canSpin: !animation.isSpinning,
    hasResults: history.results.length > 0
  };
}
