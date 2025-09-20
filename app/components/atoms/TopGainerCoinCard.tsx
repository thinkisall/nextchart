import { memo } from 'react';

interface TopGainerCoinCardProps {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  percentChange: number;
  marketCap: number;
  onClick?: () => void;
  isCompact?: boolean;
}

export const TopGainerCoinCard = memo(function TopGainerCoinCard({
  rank,
  symbol,
  name,
  price,
  percentChange,
  marketCap,
  onClick,
  isCompact = false
}: TopGainerCoinCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) {
      return `${(marketCap / 1e9).toFixed(1)}B`;
    } else if (marketCap >= 1e6) {
      return `${(marketCap / 1e6).toFixed(0)}M`;
    } else {
      return `${(marketCap / 1e3).toFixed(0)}K`;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  if (isCompact) {
    return (
      <div 
        className={`
          flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-2 py-2 
          border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600
          transition-all duration-200 cursor-pointer hover:shadow-md
          min-w-[100px] flex-shrink-0
        `}
        onClick={onClick}
      >
        {/* 순위 + 심볼 */}
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {rank}
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[30px]">
            {symbol}
          </span>
        </div>
        
        {/* 변동률 */}
        <div className={`flex items-center space-x-1 ${getChangeColor(percentChange)} flex-shrink-0`}>
          <span className="text-xs">{getChangeIcon(percentChange)}</span>
          <span className="font-bold text-xs">
            +{percentChange.toFixed(0)}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        relative bg-white dark:bg-gray-800 rounded-xl p-4 
        border border-gray-200 dark:border-gray-700
        hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600
        transition-all duration-200 cursor-pointer
        ${onClick ? 'hover:scale-[1.02]' : ''}
      `}
      onClick={onClick}
    >
      {/* 순위 배지 */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
        {rank}
      </div>

      {/* 메인 정보 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
              {symbol.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white text-sm">
              {symbol}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[80px]">
              {name}
            </div>
          </div>
        </div>
        
        {/* 변동률 */}
        <div className={`flex items-center space-x-1 ${getChangeColor(percentChange)}`}>
          <span className="text-lg">{getChangeIcon(percentChange)}</span>
          <span className="font-bold text-sm">
            +{percentChange.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 dark:text-gray-400">Price</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatPrice(price)}
          </span>
        </div>
        <div className="text-center">
          <div className={`${getChangeColor(percentChange)} text-xs`}>
            Market Cap: {formatMarketCap(marketCap)}
          </div>
        </div>
      </div>

      {/* 글로우 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
    </div>
  );
});
