import { useState } from 'react';
import { RankingHeader } from '../molecules/RankingHeader';
import { CryptoRankingItem } from '../molecules/CryptoRankingItem';
import { CryptoPrice } from '../../lib/types';

interface MobileCryptoRankingProps {
  data: CryptoPrice[];
  title?: string;
  subtitle?: string;
  maxItems?: number;
  onItemClick?: (item: CryptoPrice) => void;
}

export function MobileCryptoRanking({
  data,
  title,
  subtitle,
  maxItems = 20,
  onItemClick
}: MobileCryptoRankingProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // 변동률 기준으로 정렬 (내림차순) - 안전한 정렬
  const sortedData = data && data.length > 0 ? 
    [...data]
      .filter(item => item && typeof item.change_rate === 'number')
      .sort((a, b) => (b.change_rate || 0) - (a.change_rate || 0))
      .slice(0, maxItems) : [];

  const handleFavoriteToggle = (symbol: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(symbol)) {
        newFavorites.delete(symbol);
      } else {
        newFavorites.add(symbol);
      }
      return newFavorites;
    });
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl overflow-hidden shadow-lg">
        <RankingHeader title={title} subtitle={subtitle} isLive={false} />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-gray-400 text-lg mb-2">📊</div>
            <p className="text-gray-500 dark:text-gray-400">
              데이터를 불러오는 중입니다...
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-t-3xl overflow-hidden shadow-xl">
      <RankingHeader 
        title={title} 
        subtitle={subtitle} 
        isLive={true}
        totalCount={sortedData.length}
      />
      
      <div className="max-h-[70vh] overflow-y-auto">
        {sortedData.map((item, index) => (
          <CryptoRankingItem
            key={item.symbol}
            rank={index + 1}
            symbol={item.symbol}
            koreanName={item.korean_name}
            price={item.current_price}
            changePercentage={item.change_rate}
            sector={item.sector}
            isFavorite={favorites.has(item.symbol)}
            onFavoriteClick={() => handleFavoriteToggle(item.symbol)}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
      
      {/* 하단 그라데이션 페이드 효과 */}
      <div className="
        absolute bottom-0 left-0 right-0 
        h-4 bg-gradient-to-t 
        from-white dark:from-gray-800 
        to-transparent 
        pointer-events-none
      " />
    </div>
  );
}