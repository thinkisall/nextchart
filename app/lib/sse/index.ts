/**
 * SSE 모듈 통합 관리
 */

export { SSEConnectionManager } from './connection-manager';
export { GlobalFetchManager } from './global-fetch-manager';

// 전역 SSE 인스턴스들
import { SSEConnectionManager } from './connection-manager';
import { GlobalFetchManager } from './global-fetch-manager';

// 전역 인스턴스 생성
export const sseManager = new SSEConnectionManager();
export const globalFetchManager = GlobalFetchManager.getInstance(sseManager);

/**
 * SSE 시스템 시작
 */
export function startSSESystem(): void {
  globalFetchManager.startFetching();
}

/**
 * SSE 시스템 중지
 */
export function stopSSESystem(): void {
  globalFetchManager.stopFetching();
  sseManager.cleanup();
}

/**
 * 편의 함수들
 */
export function getConnectionCount(): number {
  return sseManager.getConnectionCount();
}

export function isSSEActive(): boolean {
  return globalFetchManager.isFetching();
}
