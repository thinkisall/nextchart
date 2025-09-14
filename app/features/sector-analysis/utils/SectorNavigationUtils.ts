// 섹터 네비게이션 및 매핑 유틸리티
import { SectorAnalysisService } from '../services/SectorAnalysisService';

/**
 * 새로운 모듈화된 섹터 그룹에서 기존 섹터명으로 매핑
 */
export class SectorNavigationUtils {
  // 새로운 섹터 그룹 → 기존 섹터명 매핑
  private static readonly SECTOR_DISPLAY_TO_LEGACY_MAP: { [key: string]: string } = {
    'L1 블록체인': 'L1',
    'L2 & 확장성': 'L2',
    'DeFi 프로토콜': 'DeFi',
    'AI & 에이전트': 'AI',
    '밈코인': '밈코인',
    'GameFi & NFT': 'GameFi',
    '스테이킹 & 스테이블코인': '스테이킹',
    '인프라 & DePIN': '인프라',
    '한국 프로젝트 & 결제': '한국 프로젝트',
    '소셜 & DAO': 'DAO',
    'RWA & 코스모스': 'RWA',
    '기타': '기타'
  };

  /**
   * 새로운 섹터 분석 결과에서 기존 페이지로 갈 수 있는 섹터명 생성
   */
  static getSectorPageUrl(analysis: any): string {
    const legacySectorName = this.SECTOR_DISPLAY_TO_LEGACY_MAP[analysis.displayName];
    if (legacySectorName) {
      return `/sector/${encodeURIComponent(legacySectorName)}`;
    }
    
    // 매핑이 없으면 displayName을 그대로 사용
    return `/sector/${encodeURIComponent(analysis.displayName)}`;
  }
}
