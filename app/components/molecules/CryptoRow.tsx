import { CryptoPrice } from '../../lib/types';
import { PriceChange } from '../atoms/PriceChange';
import { BinanceBadge } from '../atoms/BinanceBadge';
import { AlphaIcon } from '../atoms/BinanceAlphaBadge';
import { UpbitBadge } from '../atoms/UpbitBadge';
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
      return `${(volume / 1e8).toFixed(1)}억`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(0)}K`;
    }
    return volume.toFixed(0);
  };

  const getRankDisplay = (index: number) => {
    if (index === 0) return { icon: '👑', text: '1위', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30' };
    if (index === 1) return { icon: '🥈', text: '2위', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/50 dark:to-slate-800/50' };
    if (index === 2) return { icon: '🥉', text: '3위', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30' };
    if (index < 10) return { icon: '🔝', text: `${index + 1}위`, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' };
    return { icon: '#', text: `${index + 1}`, color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-800/30' };
  };

  const getCoinIcon = (symbol: string) => {
    const iconMap: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'XRP': 'ΧΡΡ',
      'ADA': '₳',
      'SOL': '◎',
      'DOGE': '🐕',
      'SHIB': '🐕',
      'PEPE': '🐸',
      'BONK': '🐕',
      'FLOKI': '🐕'
    };
    return iconMap[symbol] || symbol.slice(0, 2);
  };

  const rank = getRankDisplay(index);

  // 모바일 카드 스타일 - 개선된 디자인
  if (variant === 'mobile') {
    return (
      <div 
        className={`group relative overflow-hidden rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation transform hover:scale-[1.02] ${
          index < 3 
            ? 'bg-gradient-to-br from-white via-yellow-50/30 to-amber-50/30 dark:from-gray-800 dark:via-yellow-900/10 dark:to-amber-900/10 border-yellow-200/50 dark:border-yellow-700/30' 
            : 'bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/30'
        } backdrop-blur-xl`}
        onClick={onClick}
      >
        {/* 상위권 특별 효과 */}
        {index < 3 && (
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-bl-2xl"></div>
        )}
        
        {/* 상단 행: 순위와 기본 정보 */}
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center space-x-3">
            {/* 순위 배지 */}
            <div className={`${rank.bg} ${rank.color} px-3 py-2 rounded-xl flex items-center space-x-1 shadow-sm`}>
              <span className="text-lg">{rank.icon}</span>
              <span className="text-xs font-bold">{rank.text}</span>
            </div>
            
            {/* 코인 아이콘과 정보 */}
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                index < 3 
                  ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400' 
                  : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
              }`}>
                <span className="text-sm font-bold text-white">
                  {getCoinIcon(crypto.symbol)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="font-bold text-gray-900 dark:text-gray-100 text-base truncate">
                    {crypto.korean_name}
                  </div>
                  {/* 배지들 */}
                  {crypto.isBinanceAlpha && <AlphaIcon className="ml-1" />}
                  {crypto.isOnBinance && <BinanceBadge size="sm" />}
                  {crypto.isOnUpbit && <UpbitBadge size="sm" />}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {crypto.symbol}
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className="text-2xl hover:scale-110 focus:outline-none transition-all p-2 touch-manipulation rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        </div>
        
        {/* 중간 행: 가격 정보 */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {formatPrice(crypto.current_price)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                현재가
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
        </div>
        
        {/* 하단 행: 거래량과 섹터 */}
        <div className="bg-gray-50/50 dark:bg-gray-900/20 px-4 py-3 rounded-b-2xl">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 dark:text-gray-400">거래량</span>
              <span className="font-bold text-gray-700 dark:text-gray-300">{formatVolume(crypto.volume)}</span>
            </div>
            {crypto.sector && (
              <span className={`px-2 py-1 text-xs font-medium rounded-lg ${SECTOR_COLORS[crypto.sector] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {crypto.sector}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 태블릿 테이블 행 스타일 - 개선된 디자인
  if (variant === 'tablet') {
    return (
      <tr 
        className={`group transition-all duration-200 cursor-pointer ${
          index < 3 
            ? 'bg-gradient-to-r from-yellow-50/30 via-white to-white dark:from-yellow-900/10 dark:via-gray-800 dark:to-gray-800 hover:from-yellow-100/50 dark:hover:from-yellow-900/20' 
            : 'hover:bg-white/80 dark:hover:bg-gray-800/80'
        }`}
        onClick={onClick}
      >
        <td className="px-4 py-5">
          <div className="flex items-center space-x-4">
            {/* 순위 */}
            <div className={`${rank.bg} ${rank.color} px-2 py-1 rounded-lg flex items-center space-x-1 min-w-[60px] justify-center`}>
              <span className="text-sm">{rank.icon}</span>
              <span className="text-xs font-bold">{index < 10 ? rank.text : index + 1}</span>
            </div>
            
            {/* 코인 정보 */}
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                index < 3 
                  ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400' 
                  : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
              }`}>
                <span className="text-sm font-bold text-white">
                  {getCoinIcon(crypto.symbol)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">
                    {crypto.korean_name}
                  </div>
                  {crypto.isBinanceAlpha && <AlphaIcon className="ml-1" />}
                  {crypto.isOnBinance && <BinanceBadge size="sm" />}
                  {crypto.isOnUpbit && <UpbitBadge size="sm" />}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {crypto.symbol}
                </div>
              </div>
            </div>
          </div>
        </td>
        
        <td className="px-4 py-5 text-right">
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums">
            {formatPrice(crypto.current_price)}
          </div>
        </td>
        
        <td className="px-4 py-5 text-right">
          <PriceChange
            value={crypto.change_amount}
            percentage={crypto.change_rate}
            isPositive={crypto.is_positive}
            size="sm"
          />
        </td>
        
        <td className="px-4 py-5 text-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className="text-xl hover:scale-110 focus:outline-none transition-all p-2 touch-manipulation rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        </td>
      </tr>
    );
  }

  // 데스크톱 테이블 행 스타일 - 개선된 디자인
  return (
    <tr 
      className={`group transition-all duration-200 cursor-pointer border-b border-gray-100/50 dark:border-gray-700/30 ${
        index < 3 
          ? 'bg-gradient-to-r from-yellow-50/40 via-white to-white dark:from-yellow-900/10 dark:via-gray-800 dark:to-gray-800 hover:from-yellow-100/60 dark:hover:from-yellow-900/20' 
          : 'hover:bg-white/80 dark:hover:bg-gray-800/80'
      }`}
      onClick={onClick}
    >
      <td className="px-6 py-6">
        <div className="flex items-center space-x-6">
          {/* 순위 */}
          <div className={`${rank.bg} ${rank.color} px-3 py-2 rounded-xl flex items-center space-x-2 min-w-[80px] justify-center shadow-sm`}>
            <span className="text-lg">{rank.icon}</span>
            <span className="text-sm font-bold">{index < 10 ? rank.text : `${index + 1}위`}</span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
            className="text-2xl hover:scale-110 focus:outline-none transition-all opacity-60 group-hover:opacity-100 p-2 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
          
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              index < 3 
                ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400' 
                : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
            }`}>
              <span className="text-lg font-bold text-white">
                {getCoinIcon(crypto.symbol)}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                  {crypto.korean_name}
                </div>
                {crypto.isBinanceAlpha && <AlphaIcon className="ml-1" />}
                {crypto.isOnBinance && <BinanceBadge size="md" />}
                {crypto.isOnUpbit && <UpbitBadge size="md" />}
                {crypto.sector && (
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg ${SECTOR_COLORS[crypto.sector] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
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
      
      <td className="px-6 py-6 text-right">
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
          {formatPrice(crypto.current_price)}
        </div>
      </td>
      
      <td className="px-6 py-6 text-right">
        <PriceChange
          value={crypto.change_amount}
          percentage={crypto.change_rate}
          isPositive={crypto.is_positive}
          size="lg"
        />
      </td>
      
      <td className="px-6 py-6 text-right">
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
          {formatVolume(crypto.volume)}
        </div>
      </td>
      
      <td className="px-6 py-6 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          className="text-2xl hover:scale-110 focus:outline-none transition-all p-3 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 opacity-60 group-hover:opacity-100"
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </td>
    </tr>
  );
}