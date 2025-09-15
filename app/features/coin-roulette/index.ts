/**
 * 코인 룰렛 기능 모듈 export
 * 기능 중심 구조에 따른 통합 export
 */

// 메인 컨테이너 (외부에서 사용할 주요 컴포넌트)
export { CoinRouletteContainer as CoinRoulette } from './components/CoinRouletteContainer';

// 개별 컴포넌트들 (필요시 독립적으로 사용 가능)
export { CoinRouletteContainer } from './components/CoinRouletteContainer';
export { RouletteWheel } from './components/RouletteWheel';
export { SpinButton } from './components/SpinButton';
export { RouletteResultDisplay } from './components/RouletteResultDisplay';
export { CategorySelector } from './components/CategorySelector';
export { RouletteStats } from './components/RouletteStats';

// 훅 (비즈니스 로직)
export { useCoinRoulette } from './hooks/useCoinRoulette';

// 서비스 (데이터 처리)
export { CoinRouletteService } from './services/coinRouletteService';

// 타입
export type {
  CoinInfo,
  RouletteResult,
  RouletteHistory,
  RouletteAnimation,
  CoinCategory
} from './types';
