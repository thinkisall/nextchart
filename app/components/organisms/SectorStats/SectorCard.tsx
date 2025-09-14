import { memo } from 'react';
import { CryptoPrice } from "../../../lib/types";
import { SECTOR_COLORS } from "../../../lib/crypto";

interface SectorCardProps {
  sector: string;
  stats: {
    count: number;
    totalVolume: number;
    avgChange: number;
    positiveCount: number;
  };
  onSectorClick: (sector: string) => void;
  formatNumber: (num: number) => string;
}

function SectorCardComponent({ sector, stats, onSectorClick, formatNumber }: SectorCardProps) {
  const positiveRate = (stats.positiveCount / stats.count) * 100;
  const isPositive = stats.avgChange >= 0;

  // 섹터별 아이콘 매핑
  const getSectorIcon = (sectorName: string) => {
    const iconMap: { [key: string]: string } = {
      'DeFi': '🏦',
      'AI': '🤖',
      'GameFi': '🎮',
      'NFT': '🎨',
      'Metaverse': '🌐',
      'Layer1': '⛓️',
      'Layer2': '🔗',
      'Exchange': '💱',
      'Privacy': '🔒',
      'Oracle': '🔮',
      'Infrastructure': '🏗️',
      'Storage': '💾',
      'Payment': '💳',
      'Fan Token': '⚽',
      'Meme': '😂',
      'Stablecoin': '💰',
      'PoW': '⚡',
      'PoS': '🏅',
      'DEX': '🔄',
      'Lending': '🏪'
    };
    return iconMap[sectorName] || '📊';
  };

  return (
    <button
      onClick={() => onSectorClick(sector)}
      className="group relative overflow-hidden bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] w-full min-h-[220px]"
    >
      {/* 배경 그라데이션 효과 */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ${
          isPositive
            ? "bg-gradient-to-br from-emerald-50/50 via-green-50/30 to-teal-50/50 dark:from-emerald-900/20 dark:via-green-900/10 dark:to-teal-900/20"
            : "bg-gradient-to-br from-red-50/50 via-pink-50/30 to-rose-50/50 dark:from-red-900/20 dark:via-pink-900/10 dark:to-rose-900/20"
        }`}
      />

      {/* 장식적 원형 요소들 */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-400/10 to-transparent rounded-full transform translate-x-10 -translate-y-10" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full transform -translate-x-8 translate-y-8" />

      <div className="relative z-10 p-4 h-full flex flex-col">
        {/* 헤더 섹션 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* 섹터 아이콘 */}
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <span className="text-lg">{getSectorIcon(sector)}</span>
            </div>
            
            {/* 섹터 이름과 개수 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                {sector.length > 12 ? sector.substring(0, 10) + ".." : sector}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {stats.count}개 코인
              </p>
            </div>
          </div>

          {/* 상태 인디케이터 */}
          <div className={`w-4 h-4 rounded-full transition-all duration-300 group-hover:scale-125 ${
            isPositive ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
          }`}>
            <div className={`absolute inset-0 w-4 h-4 rounded-full animate-ping opacity-30 ${
              isPositive ? 'bg-emerald-400' : 'bg-red-400'
            }`}></div>
          </div>
        </div>

        {/* 메트릭 섹션 */}
        <div className="flex-1 space-y-3">
          {/* 평균 변동률 */}
          <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-3 group-hover:from-indigo-50/80 group-hover:to-purple-50/80 dark:group-hover:from-indigo-900/20 dark:group-hover:to-purple-900/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                <span className="text-base">📈</span>
                <span>평균 변동률</span>
              </span>
              <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                isPositive 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {isPositive ? 'BULL' : 'BEAR'}
              </div>
            </div>
            <div className={`text-2xl font-bold ${
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {isPositive ? "+" : ""}
              {stats.avgChange.toFixed(2)}%
            </div>
          </div>

          {/* 시장 심리 */}
          <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-3 group-hover:from-indigo-50/80 group-hover:to-purple-50/80 dark:group-hover:from-indigo-900/20 dark:group-hover:to-purple-900/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                <span className="text-base">🎯</span>
                <span>강세 비율</span>
              </span>
            </div>
            <div className={`text-2xl font-bold ${
              positiveRate >= 50
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {positiveRate.toFixed(0)}%
            </div>
            
            {/* 프로그레스 바 */}
            <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ease-out ${
                  positiveRate >= 50
                    ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                    : 'bg-gradient-to-r from-red-400 to-pink-500'
                }`}
                style={{ width: `${positiveRate}%` }}
              />
            </div>
          </div>

          {/* 거래량 */}
          <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-3 group-hover:from-indigo-50/80 group-hover:to-purple-50/80 dark:group-hover:from-indigo-900/20 dark:group-hover:to-purple-900/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                <span className="text-base">💰</span>
                <span>거래량</span>
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatNumber(stats.totalVolume)}₩
              </span>
            </div>
          </div>
        </div>

        {/* 하단 액센트 */}
        <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className={`h-1 rounded-full transition-all duration-700 bg-gradient-to-r ${
            isPositive
              ? 'from-emerald-400 via-green-500 to-emerald-600'
              : 'from-red-400 via-pink-500 to-red-600'
          }`} style={{
            width: `${Math.min(Math.abs(stats.avgChange) * 3, 100)}%`
          }} />
        </div>
      </div>
    </button>
  );
}

// React.memo로 최적화
export const SectorCard = memo(SectorCardComponent, (prevProps, nextProps) => {
  // 섹터 데이터가 실제로 변경되었을 때만 리렌더링
  return (
    prevProps.sector === nextProps.sector &&
    prevProps.stats.count === nextProps.stats.count &&
    prevProps.stats.totalVolume === nextProps.stats.totalVolume &&
    prevProps.stats.avgChange === nextProps.stats.avgChange &&
    prevProps.stats.positiveCount === nextProps.stats.positiveCount
  );
});