'use client';

import { memo, useState } from 'react';
import { useTopGainers } from '../../hooks/useTopGainers';
import { TopGainerCoinCard } from '../atoms/TopGainerCoinCard';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';

interface GlobalTopGainersProps {
  className?: string;
}

export const GlobalTopGainers = memo(function GlobalTopGainers({ 
  className = '' 
}: GlobalTopGainersProps) {
  const { data, loading, error, lastUpdated, refetch } = useTopGainers();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatLastUpdated = (timestamp: string | null) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return '방금';
    if (diffMins < 60) return `${diffMins}분`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간`;
    
    return '오늘';
  };

  if (loading && !data.length) {
    return (
      <Card className={`shadow-lg ${className}`}>
        <CardContent className="flex items-center justify-center py-4">
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-muted-foreground text-sm">
            해외 급등주 로딩 중...
          </span>
        </CardContent>
      </Card>
    );
  }

  if (error && !data.length) {
    return (
      <Card className={`shadow-lg ${className}`}>
        <CardContent className="p-3">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-destructive">⚠️</span>
              <span className="text-muted-foreground text-sm truncate">{error}</span>
            </div>
            <Button variant="outline" size="sm" onClick={refetch}>
              재시도
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-lg overflow-hidden ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🚀</span>
            <CardTitle className="text-base">해외 급등주</CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse mr-1"></div>
              LIVE
            </Badge>
          </div>
          
          <Button
            variant={isExpanded ? "default" : "outline"}
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1"
          >
            <span className="hidden xs:inline text-xs">
              {isExpanded ? '접기' : 'TOP 10'}
            </span>
            <span className="xs:hidden text-xs">
              {isExpanded ? '접기' : '전체'}
            </span>
            <svg 
              className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>
        
        {/* 상위 3개 미리보기 */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {data.slice(0, 3).map((coin, index) => (
            <TopGainerCoinCard
              key={coin.id}
              rank={index + 1}
              symbol={coin.symbol}
              name={coin.name}
              price={coin.price}
              percentChange={coin.percent_change_24h}
              marketCap={coin.market_cap}
              isCompact={true}
              onClick={() => {
                window.open(`https://coinmarketcap.com/currencies/${coin.name.toLowerCase().replace(/\s+/g, '-')}/`, '_blank');
              }}
            />
          ))}
        </div>
        
        <Separator className="my-2" />
        
        {/* 업데이트 시간 */}
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs">
            업데이트: {lastUpdated ? formatLastUpdated(lastUpdated) : '실시간'}
          </CardDescription>
          <Button variant="ghost" size="sm" onClick={refetch} className="text-xs h-auto p-1">
            새로고침
          </Button>
        </div>
      </CardHeader>

      {/* 확장된 내용 */}
      {isExpanded && (
        <>
          <Separator />
          <CardContent className="pt-3">
            {/* 전체 TOP 10 그리드 */}
            {data.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {data.map((coin, index) => (
                  <TopGainerCoinCard
                    key={coin.id}
                    rank={index + 1}
                    symbol={coin.symbol}
                    name={coin.name}
                    price={coin.price}
                    percentChange={coin.percent_change_24h}
                    marketCap={coin.market_cap}
                    isCompact={false}
                    onClick={() => {
                      window.open(`https://coinmarketcap.com/currencies/${coin.name.toLowerCase().replace(/\s+/g, '-')}/`, '_blank');
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-muted-foreground text-3xl mb-2">📊</div>
                <CardDescription>
                  급등주 데이터를 불러올 수 없습니다
                </CardDescription>
              </div>
            )}

            <Separator className="my-4" />
            
            {/* 푸터 정보 */}
            <div className="space-y-1 text-xs text-muted-foreground text-center">
              <div>💡 최소 거래량: $100K | 최소 시총: $10M</div>
              <div>데이터 제공: CoinMarketCap</div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
});