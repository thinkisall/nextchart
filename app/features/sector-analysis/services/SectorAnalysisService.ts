// 섹터별 상세 분석 서비스
import { CryptoPrice } from '../../../lib/types';
import {
  L1_BLOCKCHAIN_SECTORS,
  L2_SCALING_SECTORS,
  DEFI_SECTORS,
  AI_SECTORS,
  MEME_SECTORS,
  GAMEFI_NFT_SECTORS,
  STAKING_SECTORS,
  STABLECOIN_SECTORS,
  INFRASTRUCTURE_SECTORS,
  KOREAN_PROJECTS_SECTORS,
  PAYMENT_SECTORS,
  SOCIAL_DAO_SECTORS,
  RWA_SECTORS,
  COSMOS_SECTORS,
  MISCELLANEOUS_SECTORS
} from '../../../lib/crypto/sectors/index';

export interface SectorAnalysis {
  name: string;
  displayName: string;
  description: string;
  count: number;
  totalMarketCap: number;
  totalVolume: number;
  avgChange: number;
  positiveCount: number;
  negativeCount: number;
  topPerformers: CryptoPrice[];
  topLosers: CryptoPrice[];
  marketShare: number;
  volatility: number;
  momentum: 'bullish' | 'bearish' | 'neutral';
  coins: CryptoPrice[];
}

export interface ModularSectorGroups {
  [key: string]: {
    sectors: { [key: string]: string };
    displayName: string;
    description: string;
    icon: string;
    color: string;
  };
}

export class SectorAnalysisService {
  // 모듈화된 섹터 그룹 정의
  private static readonly SECTOR_GROUPS: ModularSectorGroups = {
    'l1-blockchain': {
      sectors: L1_BLOCKCHAIN_SECTORS,
      displayName: 'L1 블록체인',
      description: '기본 블록체인 인프라 및 스마트컨트랙트 플랫폼',
      icon: '🌐',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    },
    'l2-scaling': {
      sectors: L2_SCALING_SECTORS,
      displayName: 'L2 & 확장성',
      description: '블록체인 확장성 솔루션 및 레이어2 프로토콜',
      icon: '⚡',
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
    },
    'defi': {
      sectors: DEFI_SECTORS,
      displayName: 'DeFi 프로토콜',
      description: '탈중앙화 금융 서비스 및 DEX 플랫폼',
      icon: '💰',
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
    },
    'ai': {
      sectors: AI_SECTORS,
      displayName: 'AI & 에이전트',
      description: 'AI 에이전트, 머신러닝 및 데이터 분석',
      icon: '🤖',
      color: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300'
    },
    'meme': {
      sectors: MEME_SECTORS,
      displayName: '밈코인',
      description: '커뮤니티 기반 밈 암호화폐',
      icon: '🐶',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    },
    'gamefi-nft': {
      sectors: GAMEFI_NFT_SECTORS,
      displayName: 'GameFi & NFT',
      description: '게임파이, NFT 마켓플레이스 및 메타버스',
      icon: '🎮',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    },
    'staking-stablecoin': {
      sectors: { ...STAKING_SECTORS, ...STABLECOIN_SECTORS },
      displayName: '스테이킹 & 스테이블코인',
      description: 'LST, LRT 및 스테이블코인 프로토콜',
      icon: '💎',
      color: 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300'
    },
    'infrastructure': {
      sectors: INFRASTRUCTURE_SECTORS,
      displayName: '인프라 & DePIN',
      description: '블록체인 인프라, DePIN 및 프라이버시',
      icon: '🏗️',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    },
    'korean-payment': {
      sectors: { ...KOREAN_PROJECTS_SECTORS, ...PAYMENT_SECTORS },
      displayName: '한국 프로젝트 & 결제',
      description: '한국 블록체인 프로젝트 및 결제 솔루션',
      icon: '🇰🇷',
      color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
    },
    'social-dao': {
      sectors: SOCIAL_DAO_SECTORS,
      displayName: '소셜 & DAO',
      description: '소셜 네트워크, DAO 및 콘텐츠 플랫폼',
      icon: '👥',
      color: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300'
    },
    'rwa-cosmos': {
      sectors: { ...RWA_SECTORS, ...COSMOS_SECTORS },
      displayName: 'RWA & 코스모스',
      description: '실물자산 토큰화 및 코스모스 생태계',
      icon: '🏢',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    },
    'miscellaneous': {
      sectors: MISCELLANEOUS_SECTORS,
      displayName: '기타',
      description: '기타 특수 목적 및 테스트 토큰',
      icon: '🔧',
      color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300'
    }
  };

  /**
   * 숫자를 읽기 쉬운 형태로 포맷
   */
  private static formatNumber(num: number): string {
    if (isNaN(num) || !isFinite(num)) return "0";
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
  }

  /**
   * 코인을 해당 섹터 그룹으로 분류
   */
  private static categorizeCoin(coin: CryptoPrice): string {
    const symbol = coin.symbol;
    
    // 각 섹터 그룹을 순회하며 해당 코인이 속하는 그룹 찾기
    for (const [groupKey, group] of Object.entries(this.SECTOR_GROUPS)) {
      if (symbol in group.sectors) {
        return groupKey;
      }
    }
    
    return 'miscellaneous'; // 기본값: 기타
  }

  /**
   * 모멘텀 계산 (상승/하락 추세)
   */
  private static calculateMomentum(avgChange: number, positiveRatio: number): 'bullish' | 'bearish' | 'neutral' {
    if (avgChange > 5 && positiveRatio > 0.6) return 'bullish';
    if (avgChange < -5 && positiveRatio < 0.4) return 'bearish';
    return 'neutral';
  }

  /**
   * 섹터별 상세 분석 수행
   */
  static analyzeSectors(cryptos: CryptoPrice[]): SectorAnalysis[] {
    const totalMarketCap = cryptos.reduce((sum, coin) => sum + (coin.volume || 0), 0);
    
    // 섹터 그룹별로 코인들을 분류
    const sectorGroups: { [key: string]: CryptoPrice[] } = {};
    
    cryptos.forEach(coin => {
      const groupKey = this.categorizeCoin(coin);
      if (!sectorGroups[groupKey]) {
        sectorGroups[groupKey] = [];
      }
      sectorGroups[groupKey].push(coin);
    });

    // 각 섹터 그룹별 분석 수행
    const analyses: SectorAnalysis[] = [];
    
    for (const [groupKey, coins] of Object.entries(sectorGroups)) {
      if (coins.length === 0) continue;
      
      const group = this.SECTOR_GROUPS[groupKey];
      if (!group) continue;

      // 기본 통계 계산
      const count = coins.length;
      const totalSectorMarketCap = coins.reduce((sum, coin) => sum + (coin.volume || 0), 0);
      const totalVolume = coins.reduce((sum, coin) => sum + (coin.volume || 0), 0);
      const totalChange = coins.reduce((sum, coin) => sum + (coin.change_rate || 0), 0);
      const avgChange = totalChange / count;
      const positiveCount = coins.filter(coin => coin.is_positive).length;
      const negativeCount = count - positiveCount;
      const marketShare = totalMarketCap > 0 ? (totalSectorMarketCap / totalMarketCap) * 100 : 0;
      
      // 변동성 계산 (표준편차)
      const changeRates = coins.map(coin => coin.change_rate || 0);
      const variance = changeRates.reduce((sum, rate) => sum + Math.pow(rate - avgChange, 2), 0) / count;
      const volatility = Math.sqrt(variance);
      
      // 상위/하위 성과자 추출
      const sortedCoins = [...coins].sort((a, b) => (b.change_rate || 0) - (a.change_rate || 0));
      const topPerformers = sortedCoins.slice(0, 3);
      const topLosers = sortedCoins.slice(-3).reverse();
      
      // 모멘텀 계산
      const positiveRatio = positiveCount / count;
      const momentum = this.calculateMomentum(avgChange, positiveRatio);

      analyses.push({
        name: groupKey,
        displayName: group.displayName,
        description: group.description,
        count,
        totalMarketCap: totalSectorMarketCap,
        totalVolume,
        avgChange,
        positiveCount,
        negativeCount,
        topPerformers,
        topLosers,
        marketShare,
        volatility,
        momentum,
        coins
      });
    }

    // 시가총액 기준으로 정렬
    return analyses.sort((a, b) => b.totalMarketCap - a.totalMarketCap);
  }

  /**
   * 특정 섹터 그룹의 상세 정보 반환
   */
  static getSectorGroupInfo(groupKey: string) {
    return this.SECTOR_GROUPS[groupKey];
  }

  /**
   * 모든 섹터 그룹 정보 반환
   */
  static getAllSectorGroups() {
    return this.SECTOR_GROUPS;
  }

  /**
   * 섹터 성과 요약 반환
   */
  static getSectorPerformanceSummary(analyses: SectorAnalysis[]) {
    const totalSectors = analyses.length;
    const bullishSectors = analyses.filter(a => a.momentum === 'bullish').length;
    const bearishSectors = analyses.filter(a => a.momentum === 'bearish').length;
    const bestPerformer = analyses.reduce((best, current) => 
      current.avgChange > best.avgChange ? current : best
    );
    const worstPerformer = analyses.reduce((worst, current) => 
      current.avgChange < worst.avgChange ? current : worst
    );

    return {
      totalSectors,
      bullishSectors,
      bearishSectors,
      neutralSectors: totalSectors - bullishSectors - bearishSectors,
      bestPerformer,
      worstPerformer,
      avgMarketPerformance: analyses.reduce((sum, a) => sum + a.avgChange, 0) / totalSectors
    };
  }
}
