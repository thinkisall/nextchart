'use client';

import { CryptoPrice } from '../../../lib/types';

/**
 * 암호화폐 데이터 통합 서비스
 * 여러 데이터 소스(REST API, WebSocket, SSE)를 하나로 통합
 */
export class CryptoDataService {
  /**
   * 우선순위에 따라 데이터 소스 선택
   * 1. SSE 데이터 (가장 최신)
   * 2. REST API 데이터 (백업)
   */
  static selectPrimaryDataSource(
    sseData: CryptoPrice[], 
    restData: CryptoPrice[]
  ): CryptoPrice[] {
    return sseData.length > 0 ? sseData : restData;
  }

  /**
   * 필터링된 데이터 또는 원본 데이터 반환
   */
  static selectDisplayData(
    filteredData: CryptoPrice[], 
    primaryData: CryptoPrice[]
  ): CryptoPrice[] {
    return filteredData.length > 0 ? filteredData : primaryData;
  }

  /**
   * 시장 통계 계산
   */
  static calculateMarketStats(
    displayData: CryptoPrice[], 
    finalData: CryptoPrice[]
  ) {
    if (displayData.length === 0) {
      return { totalAssets: 0, positiveCount: 0, negativeCount: 0 };
    }
    
    const positiveCount = displayData.filter(c => c.is_positive).length;
    return { 
      totalAssets: finalData.length, 
      positiveCount, 
      negativeCount: displayData.length - positiveCount 
    };
  }

  /**
   * Virtual Scrolling 사용 여부 결정
   */
  static shouldUseVirtualScrolling(dataLength: number): boolean {
    return false; // 성능 테스트를 위해 비활성화
    // return dataLength >= 100 && typeof window !== 'undefined' && window.innerWidth >= 768;
  }
}