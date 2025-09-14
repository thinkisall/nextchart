/**
 * 리팩토링된 빗썸 API
 * 기존 기능을 유지하면서 모듈화된 구조 사용
 */

import { BithumbTickerResponse, CryptoPrice } from "./types";
import { BithumbApiService } from './services/bithumb-api';
import { sseManager, startSSESystem, stopSSESystem } from './sse';

/**
 * 직접 빗썸 API 호출 함수 (기존 호환성을 위해 유지)
 * @deprecated - BithumbApiService.fetchProcessedData() 사용 권장
 */
export async function fetchBithumbData(): Promise<CryptoPrice[]> {
  return BithumbApiService.fetchProcessedData();
}

// SSE 관리자 re-export (기존 코드 호환성)
export { sseManager };

/**
 * 전역 페칭 시작 (기존 API 호환)
 */
export function startGlobalFetching(): void {
  startSSESystem();
}

/**
 * 전역 페칭 중지 (기존 API 호환)
 */
export function stopGlobalFetching(): void {
  stopSSESystem();
}
