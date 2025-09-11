import { CryptoPrice } from '../../lib/types';
import { PriceChange } from '../atoms/PriceChange';
import { SECTOR_COLORS } from '../../lib/crypto';

interface CryptoRowProps {
  crypto: CryptoPrice;
  onClick?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  variant?: 'desktop' | 'tablet' | 'mobile';
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
    if (volume >= 1e12) {
      return `${(volume / 1e12).toFixed(1)}조`;
    } else if (volume >= 1e8) {
      const eok = (volume / 1e8).toFixed(0);
      return `${eok}억`;
    } else if (volume >= 1e4) {
      return `${(volume / 1e4).toFixed(0)}만`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(0)}천`;
    }
    return volume.toFixed(0);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return '🏆';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  // 모바일 카드 스타일 - 가장 컴팩트하고 터치 친화적
  if (variant === 'mobile') {
    return (
      <div 
        className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/30 dark:border-gray-700/30 p-3 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all duration-200 hover:shadow-lg cursor-pointer touch-manipulation"
        onClick={onClick}
      >
        {/* 상단 행: 순위, 이름, 즐겨찾기 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 min-w-[24px]">
              {getRankIcon(index)}
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-white">
                {crypto.symbol.slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                {crypto.korean_name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {crypto.symbol}
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className="text-yellow-500 hover:text-yellow-600 focus:outline-none transition-colors p-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        </div>
        
        {/* 중간 행: 가격과 변동률 */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {formatPrice(crypto.current_price)}
          </div>
          <div className="text-right">
            <PriceChange
              value={crypto.change_amount}
              percentage={crypto.change_rate}
              isPositive={crypto.is_positive}
              size="sm"
            />
          </div>
        </div>
        
        {/* 하단 행: 거래량과 섹터 */}
        <div className="flex items-center justify-between text-xs">
          <div className="text-gray-500 dark:text-gray-400">
            거래량: <span className="font-semibold text-gray-700 dark:text-gray-300">{formatVolume(crypto.volume)}원</span>
          </div>
          {crypto.sector && (
            <span className={`px-2 py-1 text-xs font-medium rounded-lg ${SECTOR_COLORS[crypto.sector] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              {crypto.sector}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 태블릿 테이블 행 스타일 - 간소화된 컬럼
  if (variant === 'tablet') {
    return (
      <tr 
        className="group hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer"
        onClick={onClick}
      >
        <td className="px-3 py-4">
          <div className="flex items-center space-x-3">
            <div className="text-sm font-bold text-gray-400 dark:text-gray-500 w-6">
              {index < 3 ? getRankIcon(index) : `${index + 1}`}
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-white">
                {crypto.symbol.slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                {crypto.korean_name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {crypto.symbol}
              </div>
            </div>
          </div>
        </td>
        
        <td className="px-3 py-4 text-right">
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">
            {formatPrice(crypto.current_price)}
          </div>
        </td>
        
        <td className="px-3 py-4 text-right">
          <PriceChange
            value={crypto.change_amount}
            percentage={crypto.change_rate}
            isPositive={crypto.is_positive}
            size="sm"
          />
        </td>
        
        <td className="px-3 py-4 text-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className="text-yellow-500 hover:text-yellow-600 focus:outline-none transition-colors p-1 rounded touch-manipulation"
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        </td>
      </tr>
    );
  }

  // 데스크톱 테이블 행 스타일 - 전체 정보 표시
  return (
    <tr 
      className="group hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <td className="px-4 xl:px-6 py-4 xl:py-5">
        <div className="flex items-center space-x-3 xl:space-x-4">
          <div className="text-sm font-bold text-gray-400 dark:text-gray-500 w-8">
            {getRankIcon(index)}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className="text-yellow-500 hover:text-yellow-600 focus:outline-none transition-colors opacity-60 group-hover:opacity-100"
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
          
          <div className="flex items-center space-x-3 xl:space-x-4">
            <div className="w-9 h-9 xl:w-10 xl:h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-white">
                {crypto.symbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2 xl:space-x-3">
                <div className="font-bold text-gray-900 dark:text-gray-100 text-sm xl:text-base">
                  {crypto.korean_name}
                </div>
                {crypto.sector && (
                  <span className={`px-2 xl:px-2.5 py-1 text-xs font-bold rounded-lg ${SECTOR_COLORS[crypto.sector] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                    {crypto.sector}
                  </span>
                )}
              </div>
              <div className="text-xs xl:text-sm text-gray-500 dark:text-gray-400 font-mono">
                {crypto.symbol}
              </div>
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-4 xl:px-6 py-4 xl:py-5 text-right">
        <div className="text-base xl:text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums">
          {formatPrice(crypto.current_price)}
        </div>
      </td>
      
      <td className="px-4 xl:px-6 py-4 xl:py-5 text-right">
        <PriceChange
          value={crypto.change_amount}
          percentage={crypto.change_rate}
          isPositive={crypto.is_positive}
          size="md"
        />
      </td>
      
      <td className="px-4 xl:px-6 py-4 xl:py-5 text-right">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
          {formatVolume(crypto.volume)}원
        </div>
      </td>
      
      <td className="px-4 xl:px-6 py-4 xl:py-5 text-center">
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