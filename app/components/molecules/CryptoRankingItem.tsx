import { RankBadge } from '../atoms/RankBadge';
import { FavoriteButton } from '../atoms/FavoriteButton';
import { MobilePriceChange } from '../atoms/MobilePriceChange';

interface CryptoRankingItemProps {
  rank: number;
  symbol: string;
  koreanName: string;
  price: number;
  changePercentage: number;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
  onClick?: () => void;
}

export function CryptoRankingItem({
  rank,
  symbol,
  koreanName,
  price,
  changePercentage,
  isFavorite = false,
  onFavoriteClick,
  onClick
}: CryptoRankingItemProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    } else {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    }
  };

  const isPositive = changePercentage > 0;
  return (
    <div 
      className="
        flex items-center justify-between 
        bg-white dark:bg-gray-800 
        hover:bg-gray-50 dark:hover:bg-gray-750
        border-b border-gray-100 dark:border-gray-700
        px-4 py-4
        transition-colors duration-200
        cursor-pointer
        active:bg-gray-100 dark:active:bg-gray-700
      "
      onClick={onClick}
    >
      {/* 왼쪽: 순위 + 코인 정보 */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <RankBadge rank={rank} size="md" />
        
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900 dark:text-white text-base truncate">
            {koreanName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {symbol}
          </div>
        </div>
      </div>

      {/* 오른쪽: 가격 + 변동률 + 즐겨찾기 */}
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="font-bold text-gray-900 dark:text-white text-base">
            {formatPrice(price)}
          </div>
          <MobilePriceChange 
            percentage={changePercentage} 
            isPositive={isPositive}
            size="sm"
          />
        </div>
        
        <FavoriteButton 
          isFavorite={isFavorite}
          onClick={(e?: any) => {
            if (e) e.stopPropagation();
            onFavoriteClick?.();
          }}
          size="md"
        />
      </div>
    </div>
  );
}