import { CryptoPrice } from "../../../lib/types";
import { getConsolidatedSectors } from "../../../lib/crypto/consolidation";
import { SectorAnalysisService } from "../../../features/sector-analysis/services/SectorAnalysisService";

export function useSectorStats(cryptos: CryptoPrice[]) {
  // formatNumber 함수
  const formatNumber = (num: number) => {
    if (isNaN(num) || !isFinite(num)) return "0";
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
  };

  // 토큰의 실제 섹터를 찾는 함수
  const getTokenSector = (symbol: string): string => {
    const sectorGroups = SectorAnalysisService.getAllSectorGroups();
    
    // 각 섹터 그룹을 순회하며 토큰이 속하는 그룹 찾기
    for (const [groupKey, group] of Object.entries(sectorGroups)) {
      if (symbol in group.sectors) {
        // 세부 섹터명 반환 (예: "L1/이더리움오리지널(PoW)")
        return group.sectors[symbol];
      }
    }
    
    return "기타"; // 어떤 섹터에도 정의되지 않은 경우
  };

  // 섹터별 통계 계산
  const sectorStats = cryptos.reduce((acc, crypto) => {
    // crypto.sector 대신 실제 섹터 매핑을 사용
    const actualSector = getTokenSector(crypto.symbol);
    const sectors = getConsolidatedSectors(actualSector);

    sectors.forEach((sector) => {
      if (!acc[sector]) {
        acc[sector] = {
          count: 0,
          totalVolume: 0,
          avgChange: 0,
          positiveCount: 0,
        };
      }

      acc[sector].count += 1;
      acc[sector].totalVolume += crypto.volume || 0;
      acc[sector].avgChange += crypto.change_rate || 0;
      if (crypto.is_positive) {
        acc[sector].positiveCount += 1;
      }
    });

    return acc;
  }, {} as Record<string, { count: number; totalVolume: number; avgChange: number; positiveCount: number }>);

  // 평균 계산 및 정렬 - 평균 변동률 기준으로 정렬
  const sortedSectors = Object.entries(sectorStats)
    .map(([sector, stats]) => {
      return [
        sector,
        {
          ...stats,
          avgChange: stats.avgChange / stats.count,
        },
      ] as [string, { count: number; totalVolume: number; avgChange: number; positiveCount: number }];
    })
    .filter(([_, stats]) => stats.count >= 2) // 최소 2개 이상의 코인이 있는 섹터만 포함
    .sort(([_, statsA], [__, statsB]) => {
      // 평균 변동률 기준 내림차순 정렬 (높은 변동률이 먼저)
      return statsB.avgChange - statsA.avgChange;
    })
    .slice(0, 12); // 상위 12개 섹터만 표시

  const totalPositive = cryptos.filter((c) => c.is_positive).length;
  const totalNegative = cryptos.filter((c) => !c.is_positive).length;
  const positivePercentage = (totalPositive / cryptos.length) * 100;

  return {
    sortedSectors,
    sectorStats,
    totalPositive,
    totalNegative,
    positivePercentage,
    formatNumber,
  };
}
