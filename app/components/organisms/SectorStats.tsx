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
    .slice(0, 12); // 주요 12개 섹터 표시

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
  };

  const totalPositive = cryptos.filter(c => c.is_positive).length;
  const totalNegative = cryptos.filter(c => !c.is_positive).length;
  const positivePercentage = ((totalPositive / cryptos.length) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <span>🏢</span>
            <span>섹터별 현황</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">📊 클릭하여 상세 보기</p>
        </div>
      </div>

      {/* 전체 요약 - 상단에 위치 */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{cryptos.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">🪙 전체</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{Object.keys(sectorStats).length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">🏢 섹터</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-red-500 dark:text-red-400">{totalPositive}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">📈 상승</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-blue-500 dark:text-blue-400">{totalNegative}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">📉 하락</div>
          </div>
        </div>
      </div>
      
      {/* 섹터별 카드 */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {sortedSectors.map(([sector, stats]) => {
            const positiveRate = (stats.positiveCount / stats.count) * 100;
            
            return (
              <button
                key={sector}
                onClick={() => handleSectorClick(sector)}
                className="crypto-card p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${SECTOR_COLORS[sector] || 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}`}>
                    {sector}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {stats.count}
                    </span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">평균 변동률</span>
                    <span className={`text-sm font-semibold ${stats.avgChange >= 0 ? 'text-red-500 dark:text-red-400' : 'text-blue-500 dark:text-blue-400'}`}>
                      {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">상승 비율</span>
                    <span className={`text-sm font-semibold ${positiveRate >= 50 ? 'text-red-500 dark:text-red-400' : 'text-blue-500 dark:text-blue-400'}`}>
                      {positiveRate.toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">거래규모</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      ₩{formatNumber(stats.totalMarketCap)}
                    </span>
                  </div>
                </div>

                {/* 진행률 바 */}
                <div className="mt-3 bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300"
                    style={{ width: `${positiveRate}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}