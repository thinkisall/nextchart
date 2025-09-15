/**
 * 거래소 성과 분석 기능 모듈 export
 * 기능 중심 구조에 따른 통합 export
 */

// 메인 컨테이너 (외부에서 사용할 주요 컴포넌트)
export { ExchangePerformanceContainer as ExchangePerformanceAnalysis } from './components/ExchangePerformanceContainer';

// 개별 컴포넌트들 (필요시 독립적으로 사용 가능)
export { ExchangePerformanceContainer } from './components/ExchangePerformanceContainer';
export { ExchangeCard } from './components/ExchangeCard';
export { PerformanceSummary } from './components/PerformanceSummary';

// 훅 (비즈니스 로직)
export { useExchangePerformance } from './hooks/useExchangePerformance';

// 서비스 (데이터 처리)
export { ExchangePerformanceService } from './services/exchangePerformanceService';

// 타입
export type {
  ExchangeStats,
  ExchangePerformance,
  PerformanceFilter,
  ExchangeType
} from './types';
