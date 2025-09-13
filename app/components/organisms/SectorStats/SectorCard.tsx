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

  return (
    <button
      onClick={() => onSectorClick(sector)}
      className="group relative overflow-hidden bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-gray-700/40 p-5 hover:bg-gradient-to-br hover:from-white/90 hover:to-white/80 dark:hover:from-gray-800/90 dark:hover:to-gray-900/80 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 w-full"
    >
      {/* Animated background gradient effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          isPositive
            ? "from-emerald-500/8 via-green-500/5 to-teal-500/8 dark:from-emerald-400/15 dark:via-green-400/10 dark:to-teal-400/15"
            : "from-red-500/8 via-pink-500/5 to-rose-500/8 dark:from-red-400/15 dark:via-pink-400/10 dark:to-rose-400/15"
        } opacity-0 group-hover:opacity-100 transition-all duration-500`}
      />

      {/* Subtle border glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${
              SECTOR_COLORS[sector] ||
              "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-300"
            } group-hover:scale-105 transition-transform duration-300`}
          >
            {sector.length > 10 ? sector.substring(0, 8) + ".." : sector}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {stats.count}
            </span>
            <div className="w-2 h-2 bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600 rounded-full group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300 group-hover:scale-125" />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-700/30 dark:to-gray-800/30 group-hover:from-blue-50/50 group-hover:to-blue-100/50 dark:group-hover:from-blue-900/20 dark:group-hover:to-blue-800/20 transition-all duration-300">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center space-x-1">
              <span>📈</span>
              <span>평균 변동률</span>
            </span>
            <div
              className={`flex items-center space-x-1 ${
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <span className="text-sm font-bold">
                {isPositive ? "+" : ""}
                {stats.avgChange.toFixed(2)}%
              </span>
              <span className="text-lg">
                {isPositive ? "🚀" : "📉"}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-700/30 dark:to-gray-800/30 group-hover:from-blue-50/50 group-hover:to-blue-100/50 dark:group-hover:from-blue-900/20 dark:group-hover:to-blue-800/20 transition-all duration-300">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center space-x-1">
              <span>🎯</span>
              <span>시장 심리</span>
            </span>
            <span
              className={`text-sm font-bold flex items-center space-x-1 ${
                positiveRate >= 50
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              <span>{positiveRate.toFixed(0)}% 강세</span>
              <span>{positiveRate >= 50 ? "💪" : "😰"}</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center space-x-1">
              <span>💰</span>
              <span>거래량</span>
            </span>
            <span className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center space-x-1">
              <span>{formatNumber(stats.totalVolume)}</span>
              <span className="text-xs opacity-70">₩</span>
            </span>
          </div>
        </div>

        {/* Enhanced Progress indicator */}
        <div className="mt-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="h-full transition-all duration-700 ease-out shadow-lg bg-gradient-to-r from-red-400 via-red-500 to-red-600"
            style={{
              width: `${Math.min(Math.abs(stats.avgChange) * 5, 100)}%`,
            }}
          />
        </div>

        {/* Enhanced Sentiment visualization */}
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-red-500 dark:text-red-400 flex items-center space-x-1">
              <span>😱</span>
              <span>약세</span>
            </span>
            <span className="text-emerald-500 dark:text-emerald-400 flex items-center space-x-1">
              <span>강세</span>
              <span>🚀</span>
            </span>
          </div>
          <div className="bg-gradient-to-r from-red-200 via-yellow-200 to-emerald-200 dark:from-red-800/50 dark:via-yellow-800/50 dark:to-emerald-800/50 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 shadow-sm"
              style={{
                width: `${positiveRate}%`,
                marginLeft: `${100 - positiveRate}%`,
              }}
            />
          </div>
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
