'use client';

import { useRouter } from 'next/navigation';
import { CryptoPrice } from '../../lib/types';
import { SECTOR_COLORS } from '../../lib/crypto';
import { getConsolidatedSectors, SECTOR_PRIORITY } from '../../lib/crypto/consolidation';
import { SidebarAd } from '../AdSenseV2';

interface SectorStatsProps {
  cryptos: CryptoPrice[];
}

export function SectorStats({ cryptos }: SectorStatsProps) {
  const router = useRouter();

  const handleSectorClick = (sectorName: string) => {
    router.push(`/sector/${encodeURIComponent(sectorName)}`);
  };

  // formatNumber 함수를 먼저 정의
  const formatNumber = (num: number) => {
    // NaN이나 유효하지 않은 값 처리
    if (isNaN(num) || !isFinite(num)) return '0';
    
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
  };

  // 섹터별 통계 계산 (다중 카테고리 지원)
  const sectorStats = cryptos.reduce((acc, crypto) => {
    const originalSector = crypto.sector || '기타';
    const sectors = getConsolidatedSectors(originalSector);
    
    // 각 코인이 여러 섹터에 동시에 속할 수 있음 (예: AI/DeFi)
    sectors.forEach(sector => {
      if (!acc[sector]) {
        acc[sector] = {
          count: 0,
          totalVolume: 0,
          avgChange: 0,
          positiveCount: 0,
        };
      }
      
      acc[sector].count += 1;
      acc[sector].totalVolume += Number(crypto.volume) || 0;
      acc[sector].avgChange += crypto.change_rate;
      if (crypto.is_positive) {
        acc[sector].positiveCount += 1;
      }
    });
    
    return acc;
  }, {} as { [sector: string]: { count: number; totalVolume: number; avgChange: number; positiveCount: number } });

  // 평균 변동률 계산
  Object.keys(sectorStats).forEach(sector => {
    sectorStats[sector].avgChange = sectorStats[sector].avgChange / sectorStats[sector].count;
  });

  // 섹터별 정렬
  const sortedSectors = Object.entries(sectorStats)
    .sort(([a], [b]) => {
      const priorityA = SECTOR_PRIORITY[a] || 0;
      const priorityB = SECTOR_PRIORITY[b] || 0;
      if (priorityA !== priorityB) return priorityB - priorityA;
      return sectorStats[b].count - sectorStats[a].count;
    })
    .slice(0, 12);

  const totalPositive = cryptos.filter(c => c.is_positive).length;
  const totalNegative = cryptos.filter(c => !c.is_positive).length;
  const positivePercentage = ((totalPositive / cryptos.length) * 100).toFixed(1);

  return (
    <div className="bg-transparent">
      {/* Professional Header */}
      <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <span>섹터 분석</span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">섹터별 시장 심리 분석</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Object.keys(sectorStats).length}</div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">활성 섹터</div>
          </div>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="p-4 sm:p-6 border-b border-gray-200/20 dark:border-gray-700/30">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{cryptos.length}</div>
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">총 자산</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalPositive}</div>
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">상승</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 rounded-xl border border-red-200/50 dark:border-red-800/30">
            <div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">{totalNegative}</div>
            <div className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide">하락</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl border border-purple-200/50 dark:border-purple-800/30">
            <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{positivePercentage}%</div>
            <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">강세</div>
          </div>
        </div>
      </div>
      
      {/* Sector Performance Grid */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
          {sortedSectors.map(([sector, stats]) => {
            const positiveRate = (stats.positiveCount / stats.count) * 100;
            const isPositive = stats.avgChange >= 0;
            
            return (
              <button
                key={sector}
                onClick={() => handleSectorClick(sector)}
                className="group relative overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/30 p-3 sm:p-5 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                {/* Background gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  isPositive 
                    ? 'from-emerald-500/5 to-green-500/5 dark:from-emerald-400/10 dark:to-green-400/10' 
                    : 'from-red-500/5 to-pink-500/5 dark:from-red-400/10 dark:to-pink-400/10'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-full ${SECTOR_COLORS[sector] || 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}`}>
                      <span className="hidden sm:inline">{sector}</span>
                      <span className="sm:hidden">{sector.length > 8 ? sector.substring(0, 6) + '..' : sector}</span>
                    </span>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                        {stats.count}
                      </span>
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full group-hover:bg-blue-500 transition-colors"></div>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">평균 변동률</span>
                      <div className={`flex items-center space-x-1 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        <span className="text-xs sm:text-sm font-bold">
                          {isPositive ? '+' : ''}{stats.avgChange.toFixed(2)}%
                        </span>
                        <span className="text-xs">
                          {isPositive ? '↗' : '↘'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">시장 심리</span>
                      <span className={`text-xs sm:text-sm font-bold ${positiveRate >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {positiveRate.toFixed(0)}% 강세
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">거래량</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">
                        {formatNumber(stats.totalVolume)}
                      </span>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-3 sm:mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        isPositive 
                          ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                          : 'bg-gradient-to-r from-red-400 to-pink-500'
                      }`}
                      style={{ width: `${Math.min(Math.abs(stats.avgChange) * 5, 100)}%` }}
                    />
                  </div>
                  
                  {/* Sentiment bar */}
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">약세</span>
                    <span className="text-gray-500 dark:text-gray-400">강세</span>
                  </div>
                  <div className="mt-1 bg-gradient-to-r from-red-200 to-emerald-200 dark:from-red-800/50 dark:to-emerald-800/50 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
                      style={{ width: `${positiveRate}%`, marginLeft: `${100 - positiveRate}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Sidebar Advertisement */}
        <div className="hidden lg:block">
          <SidebarAd />
        </div>
      </div>
    </div>
  );
}