// 개별 섹터 카드 컴포넌트
import { SectorAnalysis } from '../services/SectorAnalysisService';
import { CryptoPrice } from '../../../lib/types';

interface SectorCardProps {
  analysis: SectorAnalysis;
  onClick?: () => void;
  className?: string;
}

export function SectorCard({ analysis, onClick, className = '' }: SectorCardProps) {
  const {
    displayName,
    description,
    count,
    totalMarketCap,
    totalVolume,
    avgChange,
    positiveCount,
    negativeCount,
    marketShare,
    momentum,
    topPerformers
  } = analysis;

  // 숫자 포맷팅
  const formatNumber = (num: number): string => {
    if (isNaN(num) || !isFinite(num)) return "0";
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
  };

  // 모멘텀 색상 결정
  const getMomentumColor = () => {
    switch (momentum) {
      case 'bullish': return 'text-green-600 dark:text-green-400';
      case 'bearish': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  // 평균 변동률 색상
  const getChangeColor = () => {
    if (avgChange > 0) return 'text-green-600 dark:text-green-400';
    if (avgChange < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  // 모멘텀 이모지
  const getMomentumEmoji = () => {
    switch (momentum) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '⏸️';
    }
  };

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700
        hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]
        ${className}
      `}
      onClick={onClick}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
            {displayName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {description}
          </p>
        </div>
        <div className="flex flex-col items-end ml-2">
          <span className={`text-lg sm:text-2xl ${getMomentumColor()}`}>
            {getMomentumEmoji()}
          </span>
          <span className={`text-xs font-medium ${getMomentumColor()} capitalize mt-1`}>
            {momentum}
          </span>
        </div>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">토큰 수</div>
          <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {count}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">시가총액</div>
          <div className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
            ${formatNumber(totalMarketCap)}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">평균 변동률</div>
          <div className={`text-sm sm:text-lg font-bold ${getChangeColor()}`}>
            {avgChange > 0 ? '+' : ''}{avgChange.toFixed(2)}%
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">시장 점유율</div>
          <div className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
            {marketShare.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 상승/하락 비율 */}
      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>상승/하락 비율</span>
          <span>{positiveCount}/{negativeCount}</span>
        </div>
        <div className="flex h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div 
            className="bg-green-500" 
            style={{ width: `${(positiveCount / count) * 100}%` }}
          />
          <div 
            className="bg-red-500" 
            style={{ width: `${(negativeCount / count) * 100}%` }}
          />
        </div>
      </div>

      {/* 상위 성과자 - 모바일에서는 개수 줄임 */}
      {topPerformers.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">상위 성과자</div>
          <div className="flex flex-wrap gap-1">
            {topPerformers.slice(0, 3).map((coin, index) => (
              <span
                key={coin.symbol}
                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                         bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300
                         ${index >= 2 ? 'hidden sm:inline-flex' : ''}`}
              >
                {coin.symbol}
                <span className={`ml-1 ${coin.change_rate && coin.change_rate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {coin.change_rate ? `${coin.change_rate > 0 ? '+' : ''}${coin.change_rate.toFixed(1)}%` : '0%'}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
