'use client';

import { memo } from 'react';
import { useAltcoinSeason } from '../../hooks/useAltcoinSeason';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';

interface AltcoinSeasonIndexProps {
  className?: string;
}

export const AltcoinSeasonIndex = memo(function AltcoinSeasonIndex({ 
  className = '' 
}: AltcoinSeasonIndexProps) {
  const { data, loading, error, lastUpdated, isFallback, refetch } = useAltcoinSeason();

  const formatLastUpdated = (timestamp: string | null) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return '방금';
    if (diffHours < 24) return `${diffHours}시간 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  const getSeasonStyle = (season: 'altcoin' | 'bitcoin') => {
    return season === 'altcoin' 
      ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700/50'
      : 'bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-700/50';
  };

  if (loading && !data) {
    return (
      <Card className={`shadow-lg ${className}`}>
        <CardContent className="flex items-center justify-center py-4">
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-muted-foreground text-sm">
            알트코인 시즌 지수 로딩 중...
          </span>
        </CardContent>
      </Card>
    );
  }

  if (error && !data) {
    return (
      <Card className={`shadow-lg ${className}`}>
        <CardContent className="p-4">
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

  if (!data) return null;

  return (
    <Card className={`shadow-lg overflow-hidden ${getSeasonStyle(data.season)} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{data.emoji}</span>
            <CardTitle className="text-base">알트코인 시즌 지수</CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse mr-1"></div>
              CMC
            </Badge>
          </div>
          
          <Button variant="ghost" size="sm" onClick={refetch} className="text-xs h-auto p-1">
            새로고침
          </Button>
        </div>
        
        {/* 지수 표시 */}
        <div className="flex items-center space-x-4 mt-3">
          {/* 점수 게이지 */}
          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Bitcoin</span>
              <span className="text-xs text-muted-foreground">Altcoin</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 relative">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  data.season === 'altcoin' 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                    : 'bg-gradient-to-r from-orange-400 to-yellow-500'
                }`}
                style={{ width: `${data.points}%` }}
              ></div>
              <div 
                className="absolute top-0 w-1 h-3 bg-background rounded-full transform -translate-x-0.5"
                style={{ left: '50%' }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">0</span>
              <span className="text-xs text-muted-foreground">50</span>
              <span className="text-xs text-muted-foreground">100</span>
            </div>
          </div>
          
          {/* 점수 표시 */}
          <div className="text-center">
            <div className={`text-2xl font-bold ${data.color}`}>
              {data.points}
            </div>
            <div className="text-xs text-muted-foreground">
              포인트
            </div>
          </div>
        </div>
        
        {/* 설명 */}
        <div className={`text-sm font-medium mt-2 ${data.color}`}>
          {data.description}
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {isFallback ? (
              '⚠️ API 일시 불가 - 기본값 표시'
            ) : (
              `업데이트: ${lastUpdated ? formatLastUpdated(lastUpdated) : '실시간'}`
            )}
          </span>
          <span>
            데이터 제공: CoinMarketCap
          </span>
        </div>
      </CardContent>
    </Card>
  );
});