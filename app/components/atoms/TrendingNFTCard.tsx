'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TrendingNFT } from '../../lib/services/coingecko';

interface TrendingNFTCardProps {
  nft: TrendingNFT;
  rank: number;
  onClick?: (nft: TrendingNFT) => void;
}

export function TrendingNFTCard({ nft, rank, onClick }: TrendingNFTCardProps) {
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };

  const formatPrice = (price: number, symbol: string) => {
    if (price < 0.01) {
      return `${price.toFixed(6)} ${symbol}`;
    }
    return `${price.toFixed(4)} ${symbol}`;
  };

  const handleClick = () => {
    // 기존 onClick 콜백 실행
    onClick?.(nft);
    
    // OpenSea에서 NFT 컬렉션 검색 (새창)
    const searchUrl = `https://opensea.io/collection/${nft.id}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-purple-300 hover:border-l-purple-500 hover:scale-[1.02] group"
      onClick={handleClick}
      title={`OpenSea에서 ${nft.name} 컬렉션 보기`}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              #{rank}
            </Badge>
            <Badge 
              variant={nft.floor_price_24h_percentage_change >= 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {nft.floor_price_24h_percentage_change >= 0 ? '+' : ''}
              {nft.floor_price_24h_percentage_change.toFixed(1)}%
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0 group-hover:scale-110 transition-transform">
              <img 
                src={nft.thumb} 
                alt={nft.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/favicon.ico';
                }}
              />
            </div>
            
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate group-hover:text-purple-600 transition-colors">
                {nft.name}
              </p>
              <p className="text-xs text-muted-foreground uppercase">{nft.symbol}</p>
            </div>
          </div>
          
          <div className="text-center pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">Floor Price</p>
            <p className="font-mono text-sm">
              {formatPrice(nft.floor_price_in_native_currency, nft.native_currency_symbol)}
            </p>
            
            {/* OpenSea 힌트 */}
            <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-purple-600 font-medium">
                OpenSea에서 보기 →
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
