'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingCoinCard } from '../atoms/TrendingCoinCard';
import type { TrendingCoin } from '../../lib/services/coingecko';

interface TrendingCoinsProps {
  coins: TrendingCoin[];
  loading?: boolean;
  onCoinClick?: (coin: TrendingCoin) => void;
  onRefresh?: () => void;
}

export function TrendingCoins({ coins, loading, onCoinClick, onRefresh }: TrendingCoinsProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🔥</span>
              </div>
              <div>
                <CardTitle className="text-lg">트렌딩 코인</CardTitle>
                <CardDescription>최근 24시간 가장 인기 있는 코인</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-muted">
              로딩중...
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-4 bg-muted rounded"></div>
                  <div className="w-16 h-3 bg-muted rounded"></div>
                </div>
                <div className="w-12 h-6 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🔥</span>
            </div>
            <div>
              <CardTitle className="text-lg">트렌딩 코인</CardTitle>
              <CardDescription>최근 24시간 가장 인기 있는 코인</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100/80 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
              LIVE
            </Badge>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                새로고침
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-3">
          {coins.slice(0, 15).map((coin, index) => (
            <TrendingCoinCard
              key={coin.id}
              coin={coin}
              rank={index + 1}
              onClick={onCoinClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
