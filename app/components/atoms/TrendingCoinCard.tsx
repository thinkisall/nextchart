'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { openBinancePage } from '../../lib/binance-utils';
import type { TrendingCoin } from '../../lib/services/coingecko';

interface TrendingCoinCardProps {
  coin: TrendingCoin;
  rank: number;
  onClick?: (coin: TrendingCoin) => void;
}

export function TrendingCoinCard({ coin, rank, onClick }: TrendingCoinCardProps) {
  const getRankBadgeStyle = (rank: number) => {
    if (rank <= 3) {
      return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
    } else if (rank <= 5) {
      return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white';
    }
    return 'bg-muted text-muted-foreground';
  };

  const handleClick = () => {
    // 기존 onClick 콜백 실행
    onClick?.(coin);
    
    // 바이낸스 페이지 새창으로 열기
    openBinancePage(coin.symbol, 'trade');
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary hover:scale-[1.02] group"
      onClick={handleClick}
      title={`바이낸스에서 ${coin.name} (${coin.symbol}) 트레이딩 페이지 열기`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className={`text-xs px-2 py-1 ${getRankBadgeStyle(rank)}`}>
              #{rank}
            </Badge>
            
            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0 group-hover:scale-110 transition-transform">
              <img 
                src={coin.thumb} 
                alt={coin.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/favicon.ico';
                }}
              />
            </div>
            
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {coin.name}
              </p>
              <p className="text-xs text-muted-foreground uppercase font-mono">
                {coin.symbol}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            {coin.market_cap_rank && (
              <Badge variant="outline" className="text-xs mb-1">
                MC #{coin.market_cap_rank}
              </Badge>
            )}
            <p className="text-xs text-muted-foreground">
              Score: {coin.score.toFixed(0)}
            </p>
            
            {/* 바이낸스 아이콘 힌트 */}
            <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-primary font-medium">
                바이낸스로 이동 →
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
