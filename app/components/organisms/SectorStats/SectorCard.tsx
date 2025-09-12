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

export function SectorCard({ sector, stats, onSectorClick, formatNumber }: SectorCardProps) {
  const positiveRate = (stats.positiveCount / stats.count) * 100;
  const isPositive = stats.avgChange >= 0;

  return (
    <button
      onClick={() => onSectorClick(sector)}
      className="group relative overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/30 p-4 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg w-full"
    >
      {/* Background gradient effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          isPositive
            ? "from-emerald-500/5 to-green-500/5 dark:from-emerald-400/10 dark:to-green-400/10"
            : "from-red-500/5 to-pink-500/5 dark:from-red-400/10 dark:to-pink-400/10"
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-2 py-1 text-xs font-bold rounded-full ${
              SECTOR_COLORS[sector] ||
              "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
            }`}
          >
            {sector.length > 10 ? sector.substring(0, 8) + ".." : sector}
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {stats.count}
            </span>
            <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full group-hover:bg-blue-500 transition-colors" />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              평균 변동률
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
              <span className="text-xs">
                {isPositive ? "↗" : "↘"}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              시장 심리
            </span>
            <span
              className={`text-sm font-bold ${
                positiveRate >= 50
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {positiveRate.toFixed(0)}% 강세
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              거래량
            </span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
              {formatNumber(stats.totalVolume)}
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isPositive
                ? "bg-gradient-to-r from-emerald-400 to-green-500"
                : "bg-gradient-to-r from-red-400 to-pink-500"
            }`}
            style={{
              width: `${Math.min(Math.abs(stats.avgChange) * 5, 100)}%`,
            }}
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
            style={{
              width: `${positiveRate}%`,
              marginLeft: `${100 - positiveRate}%`,
            }}
          />
        </div>
      </div>
    </button>
  );
}
