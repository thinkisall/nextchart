// 섹터 분석 커스텀 훅
import { useMemo } from 'react';
import { CryptoPrice } from '../../../lib/types';
import { SectorAnalysisService, SectorAnalysis } from '../services/SectorAnalysisService';

export interface UseSectorAnalysisReturn {
  analyses: SectorAnalysis[];
  performanceSummary: {
    totalSectors: number;
    bullishSectors: number;
    bearishSectors: number;
    neutralSectors: number;
    bestPerformer: SectorAnalysis;
    worstPerformer: SectorAnalysis;
    avgMarketPerformance: number;
  };
  sectorGroups: ReturnType<typeof SectorAnalysisService.getAllSectorGroups>;
  isLoading: boolean;
  getSectorByName: (name: string) => SectorAnalysis | undefined;
  formatNumber: (num: number) => string;
  formatPercentage: (num: number) => string;
}

/**
 * 섹터별 상세 분석을 위한 커스텀 훅
 */
export function useSectorAnalysis(cryptos: CryptoPrice[]): UseSectorAnalysisReturn {
  // 섹터 분석 결과 메모이제이션
  const analyses = useMemo(() => {
    if (!cryptos || cryptos.length === 0) return [];
    return SectorAnalysisService.analyzeSectors(cryptos);
  }, [cryptos]);

  // 성과 요약 메모이제이션
  const performanceSummary = useMemo(() => {
    if (analyses.length === 0) {
      return {
        totalSectors: 0,
        bullishSectors: 0,
        bearishSectors: 0,
        neutralSectors: 0,
        bestPerformer: {} as SectorAnalysis,
        worstPerformer: {} as SectorAnalysis,
        avgMarketPerformance: 0
      };
    }
    return SectorAnalysisService.getSectorPerformanceSummary(analyses);
  }, [analyses]);

  // 섹터 그룹 정보
  const sectorGroups = useMemo(() => {
    return SectorAnalysisService.getAllSectorGroups();
  }, []);

  // 로딩 상태
  const isLoading = useMemo(() => {
    return cryptos.length > 0 && analyses.length === 0;
  }, [cryptos.length, analyses.length]);

  // 유틸리티 함수들
  const getSectorByName = (name: string): SectorAnalysis | undefined => {
    return analyses.find(analysis => analysis.name === name);
  };

  const formatNumber = (num: number): string => {
    if (isNaN(num) || !isFinite(num)) return "0";
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
  };

  const formatPercentage = (num: number): string => {
    if (isNaN(num) || !isFinite(num)) return "0.00%";
    return `${num.toFixed(2)}%`;
  };

  return {
    analyses,
    performanceSummary,
    sectorGroups,
    isLoading,
    getSectorByName,
    formatNumber,
    formatPercentage
  };
}

/**
 * 특정 섹터의 상세 정보를 위한 훅
 */
export function useSectorDetail(sectorName: string, cryptos: CryptoPrice[]) {
  const { getSectorByName, sectorGroups } = useSectorAnalysis(cryptos);
  
  const sectorAnalysis = useMemo(() => {
    return getSectorByName(sectorName);
  }, [getSectorByName, sectorName]);

  const sectorInfo = useMemo(() => {
    return SectorAnalysisService.getSectorGroupInfo(sectorName);
  }, [sectorName]);

  return {
    analysis: sectorAnalysis,
    info: sectorInfo,
    isFound: !!sectorAnalysis && !!sectorInfo
  };
}
