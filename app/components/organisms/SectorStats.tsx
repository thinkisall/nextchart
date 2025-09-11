'use client';

import { useRouter } from 'next/navigation';
import { CryptoPrice } from '../../lib/types';
import { SECTOR_COLORS } from '../../lib/crypto';
import { getConsolidatedSector, SECTOR_PRIORITY } from '../../lib/crypto/consolidation';

interface SectorStatsProps {
  cryptos: CryptoPrice[];
}

export function SectorStats({ cryptos }: SectorStatsProps) {
  const router = useRouter();

  // 섹터 페이지로 이동하는 함수
  const handleSectorClick = (sectorName: string) => {
    router.push(`/sector/${encodeURIComponent(sectorName)}`);
  };
  // 섹터별 통계 계산 (통합된 섹터 사용)
  const sectorStats = cryptos.reduce((acc, crypto) => {
    const originalSector = crypto.sector || '기타';
    const sector = getConsolidatedSector(originalSector);
    
    if (!acc[sector]) {
      acc[sector] = {
        count: 0,
        totalMarketCap: 0,
        avgChange: 0,
        positiveCount: 0,
      };
    }
    
    acc[sector].count += 1;
    acc[sector].totalMarketCap += crypto.current_price * crypto.volume;
    acc[sector].avgChange += crypto.change_rate;
    if (crypto.is_positive) {
      acc[sector].positiveCount += 1;
    }
    
    return acc;
  }, {} as { [sector: string]: { count: number; totalMarketCap: number; avgChange: number; positiveCount: number } });

  // 평균 변동률 계산
  Object.keys(sectorStats).forEach(sector => {
    sectorStats[sector].avgChange = sectorStats[sector].avgChange / sectorStats[sector].count;
  });

  // 섹터별 정렬 (우선순위 기준, 그 다음 코인 개수 기준)
  const sortedSectors = Object.entries(sectorStats)
    .sort(([a], [b]) => {
      const priorityA = SECTOR_PRIORITY[a] || 0;
      const priorityB = SECTOR_PRIORITY[b] || 0;
      if (priorityA !== priorityB) return priorityB - priorityA;
      return sectorStats[b].count - sectorStats[a].count;
    })
    .slice(0, 12); // 상위 12개 섹터 표시

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">섹터별 현황</h3>
        <p className="text-sm text-gray-500">클릭하여 섹터별 상세 보기</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSectors.map(([sector, stats]) => {
          const positiveRate = (stats.positiveCount / stats.count) * 100;
          
          return (
            <button
              key={sector}
              onClick={() => handleSectorClick(sector)}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer transform hover:scale-105 w-full text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 text-xs rounded-full ${SECTOR_COLORS[sector] || 'bg-gray-100 text-gray-600'}`}>
                  {sector}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {stats.count}개
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>평균 변동률:</span>
                  <span className={stats.avgChange >= 0 ? 'text-red-600' : 'text-blue-600'}>
                    {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>상승 비율:</span>
                  <span className={positiveRate >= 50 ? 'text-red-600' : 'text-blue-600'}>
                    {positiveRate.toFixed(0)}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>시가총액:</span>
                  <span>₩{formatNumber(stats.totalMarketCap)}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* 전체 요약 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{cryptos.length}</div>
            <div className="text-sm text-gray-600">전체 코인</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{Object.keys(sectorStats).length}</div>
            <div className="text-sm text-gray-600">총 섹터</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {cryptos.filter(c => c.is_positive).length}
            </div>
            <div className="text-sm text-gray-600">상승 코인</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {cryptos.filter(c => !c.is_positive).length}
            </div>
            <div className="text-sm text-gray-600">하락 코인</div>
          </div>
        </div>
      </div>
    </div>
  );
}
