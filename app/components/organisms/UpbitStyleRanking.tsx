'use client';

import { useState, useMemo } from 'react';
import { CryptoPrice } from '../../lib/types';
import { ClientOnly } from '../../hooks/useIsClient';
import { BinanceBadge } from '../atoms/BinanceBadge';
import { AlphaIcon } from '../atoms/BinanceAlphaBadge';
import { UpbitBadge } from '../atoms/UpbitBadge';
import { UPusdtBadge } from '../atoms/UPusdtBadge';
import { NetworkBadge } from '../atoms/NetworkBadge';
import { SectorBadge } from '../atoms/SectorBadge';
import { CoinDetailModal } from './CoinDetailModal';
import { hasUpbitUsdtPair } from '../../lib/exchanges';
import { CRYPTO_SECTORS } from '../../lib/crypto/sectors';
import { CRYPTO_KOREAN_NAMES } from '../../lib/crypto/korean-names';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';

// 모바일 최적화 컴포넌트 import
import { 
  MobileCard,
  MobileCardHeader,
  MobileCardTitle,
  MobileCardContent,
  MobileTable,
  MobileTableBody,
  MobileTableRow,
  MobileTableCell,
  MobilePagination,
  MobileLoading,
  MobileListSkeleton
} from '../../../components/mobile';

interface UpbitStyleRankingProps {
  data: CryptoPrice[];
  maxItems?: number;
  onItemClick?: (item: CryptoPrice) => void;
}

// 모바일 최적화된 암호화폐 행 컴포넌트
const MobileCryptoRow = ({ 
  item, 
  rank, 
  onClick 
}: { 
  item: CryptoPrice; 
  rank: number; 
  onClick?: () => void;
}) => {
  const changeColor = item.is_positive ? 'text-red-500' : 'text-blue-500';
  const sector = CRYPTO_SECTORS[item.symbol] || null;
  
  // 한글 이름 매핑
  const coinSymbol = item.symbol.replace('_KRW', '').replace('_USDT', '');
  const koreanName = item.korean_name || CRYPTO_KOREAN_NAMES[coinSymbol] || coinSymbol;

  return (
    <MobileTableRow onClick={onClick} className="cursor-pointer">
      {/* 순위와 코인 정보 */}
      <MobileTableCell>
        <div className="flex items-center space-x-3">
          {/* 순위 */}
          <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold">{rank}</span>
          </div>
          
          {/* 코인 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <div className="flex flex-col">
                <h3 className="font-semibold text-sm truncate">
                  {koreanName}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {coinSymbol}
                </span>
              </div>
              
              {/* 배지들 */}
              <div className="flex space-x-1">
                {/* 거래소 배지 */}
                {item.exchange === 'upbit' && <UpbitBadge />}
                {item.exchange === 'upbit_usdt' && <UPusdtBadge />}
                {item.exchange === 'bithumb' && (
                  <Badge variant="outline" className="text-xs px-1 py-0 bg-orange-100 text-orange-700 border-orange-200">
                    빗썸
                  </Badge>
                )}
                {item.exchange === 'binance' && <BinanceBadge />}
                {item.exchange === 'binance_alpha' && <AlphaIcon />}
                
                {/* 다른 거래소 지원 여부 배지 */}
                {item.isOnBinance && item.exchange !== 'binance' && (
                  <Badge variant="outline" className="text-xs px-1 py-0 bg-yellow-50 text-yellow-700 border-yellow-200">
                    BN
                  </Badge>
                )}
                {item.isOnUpbit && item.exchange !== 'upbit' && (
                  <Badge variant="outline" className="text-xs px-1 py-0 bg-blue-50 text-blue-700 border-blue-200">
                    UB
                  </Badge>
                )}
                {item.isBinanceAlpha && (
                  <Badge variant="outline" className="text-xs px-1 py-0 bg-green-50 text-green-700 border-green-200">
                    α
                  </Badge>
                )}
              </div>
            </div>
            
            {/* 거래소와 섹터 */}
            <div className="flex items-center space-x-2 mt-1">
              <NetworkBadge 
                symbol={coinSymbol} 
                exchange={item.exchange} 
                size="sm" 
              />
              {sector && <SectorBadge sector={sector} />}
            </div>
          </div>
        </div>
      </MobileTableCell>

      {/* 가격과 변동률 */}
      <MobileTableCell>
        <div className="text-right">
          <div className="font-semibold text-sm">
            {item.current_price?.toLocaleString() || 'N/A'}
            <span className="text-xs text-muted-foreground ml-1">
              {item.symbol.includes('USDT') ? '$' : '₩'}
            </span>
          </div>
          
          <div className={`text-sm font-medium ${changeColor}`}>
            {item.is_positive ? '+' : ''}{item.change_rate?.toFixed(2) || '0.00'}%
          </div>
          
          <div className="text-xs text-muted-foreground">
            {item.is_positive ? '+' : ''}{item.change_amount?.toLocaleString() || 'N/A'}
          </div>
        </div>
      </MobileTableCell>
    </MobileTableRow>
  );
};

export function UpbitStyleRanking({ data = [], maxItems = 50, onItemClick }: UpbitStyleRankingProps) {
  const [selectedCoin, setSelectedCoin] = useState<CryptoPrice | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // 모바일에서 한 페이지당 아이템 수 줄임

  // 데이터 정렬 및 필터링
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return [...data]
      .filter(item => item.change_rate !== undefined && item.change_rate !== null)
      .sort((a, b) => (b.change_rate || 0) - (a.change_rate || 0))
      .slice(0, maxItems);
  }, [data, maxItems]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleCoinClick = (coin: CryptoPrice) => {
    setSelectedCoin(coin);
    onItemClick?.(coin);
  };

  // 로딩 상태
  if (!data || data.length === 0) {
    return (
      <MobileCard>
        <MobileCardHeader>
          <MobileCardTitle>실시간 변동률 순위</MobileCardTitle>
        </MobileCardHeader>
        <MobileCardContent>
          <MobileListSkeleton items={10} />
        </MobileCardContent>
      </MobileCard>
    );
  }

  // 통계 계산
  const positiveCount = sortedData.filter(item => item.is_positive).length;
  const negativeCount = sortedData.length - positiveCount;

  return (
    <>
      <MobileCard className="w-full">
        <MobileCardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <MobileCardTitle>실시간 변동률 순위</MobileCardTitle>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  상승 {positiveCount}개
                </Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  하락 {negativeCount}개
                </Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                총 {sortedData.length}개 코인
              </div>
              <div className="text-xs text-muted-foreground">
                24시간 기준
              </div>
            </div>
          </div>
        </MobileCardHeader>

        <MobileCardContent>
          <MobileTable>
            <MobileTableBody>
              {currentData.map((item, index) => (
                <MobileCryptoRow
                  key={`${item.symbol}-${item.exchange}`}
                  item={item}
                  rank={startIndex + index + 1}
                  onClick={() => handleCoinClick(item)}
                />
              ))}
            </MobileTableBody>
          </MobileTable>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-6">
              <MobilePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* 데이터 정보 */}
          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              실시간 데이터 • {new Date().toLocaleTimeString('ko-KR')} 업데이트
            </p>
          </div>
        </MobileCardContent>
      </MobileCard>

      {/* 코인 상세 모달 */}
      {selectedCoin && (
        <CoinDetailModal
          coin={selectedCoin}
          isOpen={!!selectedCoin}
          onClose={() => setSelectedCoin(null)}
        />
      )}
    </>
  );
}
