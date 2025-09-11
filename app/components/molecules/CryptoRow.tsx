import { CryptoPrice } from '../../lib/types';
import { PriceChange } from '../atoms/PriceChange';
import { SECTOR_COLORS } from '../../lib/crypto';

interface CryptoRowProps {
  crypto: CryptoPrice;
  onClick?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  variant?: 'desktop' | 'mobile';
  index?: number;
}

export function CryptoRow({ 
  crypto, 
  onClick, 
  onToggleFavorite, 
  isFavorite = false,
  variant = 'desktop',
  index = 0
}: CryptoRowProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: price < 1000 ? 2 : 0,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`;
    }
    return volume.toFixed(2);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return '🏆';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  // 모바일 카드 스타일
  if (variant === 'mobile') {
    return (
      <div 
        className="group relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 p-5 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl cursor-pointer"
        onClick={onClick}
      >
        {/* Rank indicator */}
        <div className="absolute top-3 left-3 text-xs font-bold text-gray-400 dark:text-gray-500">
          {getRankIcon(index)}
        </div>
        
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          className="absolute top-3 right-3 text-yellow-500 hover:text-yellow-600 focus:outline-none transition-colors p-1"
        >
          {isFavorite ? '⭐' : '☆'}
        </button>

        {/* Main content */}
        <div className="mt-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold text-white">
                {crypto.symbol.slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                {crypto.korean_name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {crypto.symbol}
              </div>
            </div>
          </div>
          
          {/* Price and change */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(crypto.current_price)}
              </div>
            </div>
            <div className="text-right">
              <PriceChange
                value={crypto.change_amount}
                percentage={crypto.change_rate}
                isPositive={crypto.is_positive}
                size="md"
              />
            </div>
          </div>
          
          {/* Bottom info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">거래량</div>
              <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {formatVolume(crypto.volume)}
              </div>
            </div>
            {crypto.sector && (
              <span className={`px-3 py-1.5 text-xs font-bold rounded-xl ${SECTOR_COLORS[crypto.sector] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {crypto.sector}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 데스크톱 테이블 행 스타일
  return (
    <tr 
      className="group hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <td className="px-6 py-5">
        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className="text-sm font-bold text-gray-400 dark:text-gray-500 w-8">
            {getRankIcon(index)}
          </div>
          
          {/* Favorite */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className="text-yellow-500 hover:text-yellow-600 focus:outline-none transition-colors opacity-60 group-hover:opacity-100"
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
          
          {/* Asset info */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-white">
                {crypto.symbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {crypto.korean_name}
                </div>
                {crypto.sector && (
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${SECTOR_COLORS[crypto.sector] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                    {crypto.sector}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {crypto.symbol}
              </div>
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-5 text-right">
        <div className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums">
          {formatPrice(crypto.current_price)}
        </div>
      </td>
      
      <td className="px-6 py-5 text-right">
        <PriceChange
          value={crypto.change_amount}
          percentage={crypto.change_rate}
          isPositive={crypto.is_positive}
          size="md"
        />
      </td>
      
      <td className="px-6 py-5 text-right">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
          {formatVolume(crypto.volume)}
        </div>
      </td>
      
      <td className="px-6 py-5 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          className="text-yellow-500 hover:text-yellow-600 focus:outline-none transition-colors p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 opacity-60 group-hover:opacity-100"
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </td>
    </tr>
  );
}