'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingNFTCard } from '../atoms/TrendingNFTCard';
import type { TrendingNFT } from '../../lib/services/coingecko';

interface TrendingNFTsProps {
  nfts: TrendingNFT[];
  loading?: boolean;
  onNFTClick?: (nft: TrendingNFT) => void;
  onRefresh?: () => void;
}

export function TrendingNFTs({ nfts, loading, onNFTClick, onRefresh }: TrendingNFTsProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🎨</span>
              </div>
              <div>
                <CardTitle className="text-lg">트렌딩 NFT</CardTitle>
                <CardDescription>플로어 프라이스 변화율 상위</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-muted">
              로딩중...
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/20 animate-pulse">
                <div className="w-full h-32 bg-muted rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="w-3/4 h-4 bg-muted rounded"></div>
                  <div className="w-1/2 h-3 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🎨</span>
            </div>
            <div>
              <CardTitle className="text-lg">트렌딩 NFT</CardTitle>
              <CardDescription>플로어 프라이스 변화율 상위 7개</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-purple-100/80 text-purple-700 border-purple-200">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-1"></div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {nfts.slice(0, 7).map((nft, index) => (
            <TrendingNFTCard
              key={nft.id}
              nft={nft}
              rank={index + 1}
              onClick={onNFTClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
