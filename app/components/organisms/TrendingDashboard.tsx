'use client';

import { useTrendingData } from '../../hooks/useTrendingData';
import { TrendingCoins } from './TrendingCoins';
import { TrendingNFTs } from './TrendingNFTs';
import { TrendingCategories } from './TrendingCategories';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { TrendingCoin, TrendingNFT, TrendingCategory } from '../../lib/services/coingecko';

export function TrendingDashboard() {
  const { data, loading, error, refetch, lastUpdated } = useTrendingData();

  const handleCoinClick = (coin: TrendingCoin) => {
    console.log('Opening Binance for coin:', coin.name, coin.symbol);
    // 바이낸스 페이지로 이동하는 로직은 TrendingCoinCard에서 처리
  };

  const handleNFTClick = (nft: TrendingNFT) => {
    console.log('Opening OpenSea for NFT:', nft.name);
    // OpenSea 페이지로 이동하는 로직은 TrendingNFTCard에서 처리
  };

  const handleCategoryClick = (category: TrendingCategory) => {
    console.log('Opening CoinGecko category:', category.name, category.slug);
    // CoinGecko 카테고리 페이지로 이동하는 로직은 TrendingCategoryCard에서 처리
  };

  if (error) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-destructive rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⚠️</span>
              </div>
              <div>
                <CardTitle className="text-lg">트렌딩 데이터 오류</CardTitle>
                <CardDescription>데이터를 불러올 수 없습니다</CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={refetch}>
              다시 시도
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">📈</span>
              </div>
              <div>
                <CardTitle className="text-2xl">CoinGecko 트렌딩</CardTitle>
                <CardDescription className="text-base">
                  최근 24시간 가장 인기 있는 암호화폐, NFT, 카테고리
                  <br />
                  <span className="text-xs text-primary font-medium">
                    💡 카드를 클릭하면 관련 페이지로 이동합니다 (바이낸스/OpenSea/CoinGecko)
                  </span>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {lastUpdated && (
                <Badge variant="outline" className="text-xs">
                  {lastUpdated.toLocaleTimeString('ko-KR')} 업데이트
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
                {loading ? '새로고침 중...' : '새로고침'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 트렌딩 섹션들 */}
      <div className="space-y-8">
        {/* 트렌딩 코인 */}
        <TrendingCoins
          coins={data?.trendingCoins || []}
          loading={loading}
          onCoinClick={handleCoinClick}
          onRefresh={refetch}
        />

        <Separator className="my-8" />

        {/* 트렌딩 NFT & 카테고리 그리드 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <TrendingNFTs
            nfts={data?.trendingNFTs || []}
            loading={loading}
            onNFTClick={handleNFTClick}
            onRefresh={refetch}
          />
          
          <TrendingCategories
            categories={data?.trendingCategories || []}
            loading={loading}
            onCategoryClick={handleCategoryClick}
            onRefresh={refetch}
          />
        </div>
      </div>
    </div>
  );
}
