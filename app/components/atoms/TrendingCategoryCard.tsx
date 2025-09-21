'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TrendingCategory } from '../../lib/services/coingecko';

interface TrendingCategoryCardProps {
  category: TrendingCategory;
  rank: number;
  onClick?: (category: TrendingCategory) => void;
}

export function TrendingCategoryCard({ category, rank, onClick }: TrendingCategoryCardProps) {
  const formatMarketCap = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };

  const handleClick = () => {
    // 기존 onClick 콜백 실행
    onClick?.(category);
    
    // CoinGecko 카테고리 페이지로 이동 (새창)
    const categoryUrl = `https://www.coingecko.com/en/categories/${category.slug}`;
    window.open(categoryUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-300 hover:border-l-blue-500 hover:scale-[1.02] group"
      onClick={handleClick}
      title={`CoinGecko에서 ${category.name} 카테고리 보기`}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              #{rank}
            </Badge>
            <Badge 
              variant={category.market_cap_1h_change >= 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {category.market_cap_1h_change >= 0 ? '+' : ''}
              {category.market_cap_1h_change.toFixed(2)}%
            </Badge>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm truncate group-hover:text-blue-600 transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {category.coins_count} coins
            </p>
          </div>
          
          <div className="space-y-1 text-center pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="font-mono text-sm font-semibold">
              {formatMarketCap(category.data.market_cap)}
            </p>
            
            {/* CoinGecko 힌트 */}
            <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-blue-600 font-medium">
                CoinGecko에서 보기 →
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
