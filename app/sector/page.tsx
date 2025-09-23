'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useCryptoData } from '../features/crypto/hooks/useCryptoData';
import { CRYPTO_SECTORS } from '../lib/crypto/sectors';
import { CRYPTO_KOREAN_NAMES } from '../lib/crypto/korean-names';
import { GlobalNavigation } from '../components/organisms/GlobalNavigation';
import { MobileCard, MobileCardHeader, MobileCardTitle, MobileCardContent } from '../../components/mobile';
import { Badge } from '../../components/ui/badge';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon, BarChart3Icon } from 'lucide-react';

// 실제 섹터 분류 (CRYPTO_SECTORS에서 추출)
const SECTOR_CATEGORIES = [
  'L1 블록체인',
  'L2 & 확장성', 
  'DeFi',
  'DEX/AMM',
  'AI',
  '밈코인',
  'GameFi',
  'NFT',
  '메타버스',
  'RWA',
  '스테이킹',
  '스테이블코인',
  '인프라',
  'DePIN',
  '프라이버시',
  '한국 프로젝트',
  '결제',
  '소셜',
  'DAO',
  '콘텐츠',
  '코스모스',
  '기타'
];

// 섹터 그룹 매핑 (비슷한 섹터들을 그룹화)
const SECTOR_GROUPS: { [key: string]: string[] } = {
  'Layer 1': ['L1 블록체인'],
  'Layer 2': ['L2 & 확장성'],
  'DeFi': ['DeFi', 'DEX/AMM', '스테이킹', '스테이블코인'],
  'AI': ['AI'],
  'Gaming': ['GameFi', 'NFT', '메타버스'],
  'Meme': ['밈코인'],
  'Infrastructure': ['인프라', 'DePIN', '프라이버시'],
  'Social & DAO': ['소셜', 'DAO', '콘텐츠'],
  'RWA': ['RWA'],
  'Payment': ['결제', '한국 프로젝트'],
  'Cosmos': ['코스모스'],
  'Others': ['기타']
};

// 섹터 색상 매핑 (그룹별)
const SECTOR_COLORS: { [key: string]: string } = {
  'Layer 1': 'from-purple-500 to-purple-600',
  'Layer 2': 'from-indigo-500 to-indigo-600',
  'DeFi': 'from-blue-500 to-blue-600',
  'AI': 'from-red-500 to-red-600',
  'Gaming': 'from-green-500 to-green-600', 
  'Meme': 'from-yellow-500 to-yellow-600',
  'Infrastructure': 'from-cyan-500 to-cyan-600',
  'Social & DAO': 'from-rose-500 to-rose-600',
  'RWA': 'from-stone-500 to-stone-600',
  'Payment': 'from-emerald-500 to-emerald-600',
  'Cosmos': 'from-violet-500 to-violet-600',
  'Others': 'from-gray-400 to-gray-500'
};

interface SectorGroupData {
  groupName: string;
  colorClass: string;
  coinCount: number;
  avgChangeRate: number;
  maxChangeRate: number;
  minChangeRate: number;
  topCoin: {
    symbol: string;
    korean_name: string;
    change_rate: number;
    current_price: number;
  } | null;
  positiveCount: number;
  negativeCount: number;
  totalVolume: number;
  sectors: string[]; // 포함된 섹터들
}

export default function SectorAnalysisPage() {
  const { primaryData } = useCryptoData();

  // 섹터 그룹별 데이터 분석
  const sectorAnalysis = useMemo(() => {
    if (!primaryData || primaryData.length === 0) return [];

    // 그룹별로 코인들을 모음
    const groupMap: { [key: string]: any[] } = {};
    
    // 각 그룹 초기화
    Object.keys(SECTOR_GROUPS).forEach(group => {
      groupMap[group] = [];
    });

    // 코인들을 해당 그룹에 분류
    primaryData.forEach(coin => {
      const sectorName = CRYPTO_SECTORS[coin.symbol];
      if (!sectorName) {
        groupMap['Others'].push(coin);
        return;
      }

      // 섹터가 어느 그룹에 속하는지 찾기
      let assigned = false;
      Object.entries(SECTOR_GROUPS).forEach(([groupName, sectors]) => {
        sectors.forEach(sectorPattern => {
          if (sectorName.includes(sectorPattern) || sectorName.startsWith(sectorPattern)) {
            groupMap[groupName].push(coin);
            assigned = true;
          }
        });
      });

      if (!assigned) {
        groupMap['Others'].push(coin);
      }
    });

    // 그룹 데이터 계산
    const groupData: SectorGroupData[] = Object.entries(groupMap).map(([groupName, coins]) => {
      const validCoins = coins.filter(coin => 
        coin.change_rate !== undefined && 
        coin.change_rate !== null &&
        !isNaN(coin.change_rate)
      );

      if (validCoins.length === 0) {
        return null;
      }

      const avgChangeRate = validCoins.reduce((sum, coin) => sum + coin.change_rate, 0) / validCoins.length;
      const changeRates = validCoins.map(coin => coin.change_rate);
      const maxChangeRate = Math.max(...changeRates);
      const minChangeRate = Math.min(...changeRates);
      const positiveCount = validCoins.filter(coin => coin.change_rate > 0).length;
      const negativeCount = validCoins.filter(coin => coin.change_rate < 0).length;
      const totalVolume = validCoins.reduce((sum, coin) => sum + (coin.volume || 0), 0);
      
      // 최고 성과 코인 찾기
      const topCoin = validCoins.reduce((max, coin) => 
        coin.change_rate > (max?.change_rate || -Infinity) ? coin : max
      , null);

      return {
        groupName,
        colorClass: SECTOR_COLORS[groupName] || SECTOR_COLORS['Others'],
        coinCount: validCoins.length,
        avgChangeRate,
        maxChangeRate,
        minChangeRate,
        topCoin: topCoin ? {
          symbol: topCoin.symbol,
          korean_name: topCoin.korean_name || CRYPTO_KOREAN_NAMES[topCoin.symbol] || topCoin.symbol,
          change_rate: topCoin.change_rate,
          current_price: topCoin.current_price
        } : null,
        positiveCount,
        negativeCount,
        totalVolume,
        sectors: SECTOR_GROUPS[groupName] || []
      };
    }).filter(Boolean) as SectorGroupData[];

    // 평균 변동률 기준으로 정렬 (내림차순)
    return groupData.sort((a, b) => b.avgChangeRate - a.avgChangeRate);
  }, [primaryData]);

  // 상위/하위 섹터 계산
  const topSectors = sectorAnalysis.slice(0, 3);
  const bottomSectors = sectorAnalysis.slice(-3).reverse();

  if (!primaryData || primaryData.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <GlobalNavigation />
        <div className="container mx-auto px-4 py-8">
          <MobileCard>
            <MobileCardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-muted-foreground">데이터 로딩 중...</p>
              </div>
            </MobileCardContent>
          </MobileCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <GlobalNavigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <BarChart3Icon className="inline-block mr-3 h-8 w-8 text-primary" />
            섹터별 성장률 분석
          </h1>
          <p className="text-muted-foreground text-lg">
            암호화폐 섹터별 실시간 성장률과 동향을 분석해보세요
          </p>
        </div>

        {/* 전체 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MobileCard variant="outline">
            <MobileCardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">
                {sectorAnalysis.length}
              </div>
              <div className="text-sm text-muted-foreground">
                활성 섹터
              </div>
            </MobileCardContent>
          </MobileCard>
          
          <MobileCard variant="outline">
            <MobileCardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {sectorAnalysis.filter(s => s.avgChangeRate > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">
                상승 섹터
              </div>
            </MobileCardContent>
          </MobileCard>
          
          <MobileCard variant="outline">
            <MobileCardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">
                {sectorAnalysis.filter(s => s.avgChangeRate < 0).length}
              </div>
              <div className="text-sm text-muted-foreground">
                하락 섹터
              </div>
            </MobileCardContent>
          </MobileCard>
          
          <MobileCard variant="outline">
            <MobileCardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">
                {primaryData.length}
              </div>
              <div className="text-sm text-muted-foreground">
                총 코인
              </div>
            </MobileCardContent>
          </MobileCard>
        </div>

        {/* 최고/최저 성과 섹터 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 상위 섹터 */}
          <MobileCard>
            <MobileCardHeader>
              <MobileCardTitle className="flex items-center text-green-600">
                <TrendingUpIcon className="mr-2 h-5 w-5" />
                최고 성과 섹터 TOP 3
              </MobileCardTitle>
            </MobileCardHeader>
            <MobileCardContent>
              <div className="space-y-4">
                {topSectors.map((group, index) => (
                  <Link 
                    key={group.groupName} 
                    href={`/sector/${group.groupName}`}
                    className="block hover:bg-muted/50 rounded-lg p-4 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${group.colorClass} flex items-center justify-center text-white font-bold text-sm`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold">{group.groupName}</div>
                          <div className="text-sm text-muted-foreground">
                            {group.coinCount}개 코인
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600 flex items-center">
                          <ArrowUpIcon className="h-4 w-4 mr-1" />
                          +{group.avgChangeRate.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          상승: {group.positiveCount}개
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </MobileCardContent>
          </MobileCard>

          {/* 하위 섹터 */}
          <MobileCard>
            <MobileCardHeader>
              <MobileCardTitle className="flex items-center text-red-600">
                <TrendingDownIcon className="mr-2 h-5 w-5" />
                최저 성과 섹터 TOP 3
              </MobileCardTitle>
            </MobileCardHeader>
            <MobileCardContent>
              <div className="space-y-4">
                {bottomSectors.map((group, index) => (
                  <Link 
                    key={group.groupName} 
                    href={`/sector/${group.groupName}`}
                    className="block hover:bg-muted/50 rounded-lg p-4 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${group.colorClass} flex items-center justify-center text-white font-bold text-sm`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold">{group.groupName}</div>
                          <div className="text-sm text-muted-foreground">
                            {group.coinCount}개 코인
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600 flex items-center">
                          <ArrowDownIcon className="h-4 w-4 mr-1" />
                          {group.avgChangeRate.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          하락: {group.negativeCount}개
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </MobileCardContent>
          </MobileCard>
        </div>

        {/* 전체 섹터 목록 */}
        <MobileCard>
          <MobileCardHeader>
            <MobileCardTitle>전체 섹터 성장률</MobileCardTitle>
          </MobileCardHeader>
          <MobileCardContent>
            <div className="grid gap-4">
              {sectorAnalysis.map((group) => (
                <Link 
                  key={group.groupName} 
                  href={`/sector/${group.groupName}`}
                  className="block border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${group.colorClass} flex items-center justify-center text-white font-bold`}>
                        {group.groupName?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{group.groupName}</div>
                        <div className="text-sm text-muted-foreground">
                          {group.sectors.join(', ')} • {group.coinCount}개 코인
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold flex items-center ${
                        group.avgChangeRate >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {group.avgChangeRate >= 0 ? (
                          <ArrowUpIcon className="h-5 w-5 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-5 w-5 mr-1" />
                        )}
                        {group.avgChangeRate >= 0 ? '+' : ''}{group.avgChangeRate.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex space-x-4">
                      <span className="text-green-600">
                        상승 {group.positiveCount}개
                      </span>
                      <span className="text-red-600">
                        하락 {group.negativeCount}개
                      </span>
                    </div>
                    <div>
                      최고: <span className={group.maxChangeRate >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {group.maxChangeRate >= 0 ? '+' : ''}{group.maxChangeRate.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {group.topCoin && (
                    <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                      최고 성과: <span className="font-medium">{group.topCoin.korean_name}</span> 
                      <span className={group.topCoin.change_rate >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {' '}({group.topCoin.change_rate >= 0 ? '+' : ''}{group.topCoin.change_rate.toFixed(2)}%)
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </MobileCardContent>
        </MobileCard>

        {/* 푸터 */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>📊 실시간 데이터 • {new Date().toLocaleTimeString('ko-KR')} 업데이트</p>
        </div>
      </div>
    </div>
  );
}
