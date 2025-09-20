import { memo } from 'react';

interface BinanceCoinCardProps {
  rank: number;
  symbol: string;
  baseAsset: string;
  price: number;
  percentChange: number;
  volume: number;
  quoteVolume: number;
  onClick?: () => void;
  isCompact?: boolean;
}

export const BinanceCoinCard = memo(function BinanceCoinCard({
  rank,
  symbol,
  baseAsset,
  price,
  percentChange,
  volume,
  quoteVolume,
  onClick,
  isCompact = false
}: BinanceCoinCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 4 
      })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(0)}K`;
    } else {
      return `$${volume.toFixed(0)}`;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 20) return 'text-red-500 dark:text-red-400'; // 극상승
    if (change > 10) return 'text-orange-500 dark:text-orange-400'; // 강상승
    if (change > 0) return 'text-green-600 dark:text-green-400'; // 상승
    return 'text-gray-600 dark:text-gray-400'; // 변동없음
  };

  const getChangeIcon = (change: number) => {
    if (change > 20) return '🚀'; // 극상승
    if (change > 10) return '📈'; // 강상승
    return '↗'; // 일반상승
  };

  if (isCompact) {
    return (
      <div 
        className={`
          flex items-center justify-between bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 
          rounded-lg px-2 py-2 border border-yellow-200 dark:border-yellow-700/50
          hover:border-yellow-300 dark:hover:border-yellow-600 hover:shadow-md
          transition-all duration-200 cursor-pointer min-w-[100px] flex-shrink-0
        `}
        onClick={onClick}
      >
        {/* 순위 + 심볼 */}
        <div className="flex items-center space-x-1.5">
          <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {rank}
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[30px]">
            {baseAsset}
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
        relative bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 
        rounded-xl p-4 border border-yellow-200 dark:border-yellow-700/50
        hover:shadow-lg hover:border-yellow-300 dark:hover:border-yellow-600
        transition-all duration-200 cursor-pointer
        ${onClick ? 'hover:scale-[1.02]' : ''}
      `}
      onClick={onClick}
    >
      {/* 바이낸스 로고 배지 */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
        {rank}
      </div>

      {/* 바이낸스 브랜드 표시 */}
      <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold shadow-sm">
        BN
      </div>

      {/* 메인 정보 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {baseAsset.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white text-sm">
              {baseAsset}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              /USDT
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
            Volume: {formatVolume(quoteVolume)}
          </div>
        </div>
      </div>

      {/* 바이낸스 글로우 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-amber-500/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
    </div>
  );
});
