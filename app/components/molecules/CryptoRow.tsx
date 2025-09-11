import { CryptoPrice } from '../../lib/types';
import { PriceChange } from '../atoms/PriceChange';
import { SECTOR_COLORS } from '../../lib/crypto';

interface CryptoRowProps {
  crypto: CryptoPrice;
  onClick?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  variant?: 'desktop' | 'mobile';
}

export function CryptoRow({ 
  crypto, 
  onClick, 
  onToggleFavorite, 
  isFavorite = false,
  variant = 'desktop'
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
      return `${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`;
    }
    return volume.toFixed(2);
  };

  // 모바일 카드 스타일
  if (variant === 'mobile') {
    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {crypto.symbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {crypto.korean_name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {crypto.symbol}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className="text-yellow-500 hover:text-yellow-600 focus:outline-none p-1"
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">현재가</div>
            <div className="font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(crypto.current_price)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">변동률</div>
            <PriceChange
              value={crypto.change_amount}
              percentage={crypto.change_rate}
              isPositive={crypto.is_positive}
              size="sm"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">거래량</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatVolume(crypto.volume)}
            </div>
          </div>
          {crypto.sector && (
            <span className={`px-2 py-1 text-xs rounded-full ${SECTOR_COLORS[crypto.sector] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              {crypto.sector}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 데스크톱 테이블 행 스타일
  return (
    <tr 
      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="px-4 py-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className="text-yellow-500 hover:text-yellow-600 focus:outline-none transition-colors"
          >
            {isFavorite ? '★' : '☆'}
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {crypto.symbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {crypto.korean_name}
                </div>
                {crypto.sector && (
                  <span className={`px-2 py-1 text-xs rounded-full ${SECTOR_COLORS[crypto.sector] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                    {crypto.sector}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {crypto.symbol}
              </div>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {formatPrice(crypto.current_price)}
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <PriceChange
          value={crypto.change_amount}
          percentage={crypto.change_rate}
          isPositive={crypto.is_positive}
        />
      </td>
      <td className="px-4 py-4 text-right">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {formatVolume(crypto.volume)}
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          className="text-yellow-500 hover:text-yellow-600 focus:outline-none transition-colors p-1"
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </td>
    </tr>
  );
}