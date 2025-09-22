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

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';

interface UpbitStyleRankingProps {
  data: CryptoPrice[];
  maxItems?: number;
  onItemClick?: (item: CryptoPrice) => void;
}

// 페이지네이션 컴포넌트
const Pagination = ({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const showPages = 10;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 p-4 border-t bg-muted/20">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        처음
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        이전
      </Button>
      
      <div className="flex gap-1">
        {getVisiblePages().map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="w-8 h-8"
          >
            {page}
          </Button>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        다음
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        끝
      </Button>
    </div>
  );
};

export function UpbitStyleRanking({ 
  data, 
  maxItems = 20, 
  onItemClick 
}: UpbitStyleRankingProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<CryptoPrice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 50;

  // 안전한 정렬 처리
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    
    return data
      .filter(item => item && typeof item.change_rate === 'number')
      .sort((a, b) => (b.change_rate || 0) - (a.change_rate || 0));
  }, [data]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // 표시할 데이터 결정
  const displayData = showAll ? sortedData : sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowAllToggle = () => {
    setShowAll(!showAll);
    setCurrentPage(1);
  };

  const handleFavoriteToggle = (symbol: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(symbol)) {
        newFavorites.delete(symbol);
      } else {
        newFavorites.add(symbol);
      }
      return newFavorites;
    });
  };

  const handleCoinClick = (coin: CryptoPrice) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
    // 기존 onItemClick 콜백도 호출 (있는 경우)
    onItemClick?.(coin);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoin(null);
  };

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📈</span>
              </div>
              <div>
                <CardTitle className="text-lg text-white">변동률 순위</CardTitle>
                <CardDescription className="text-slate-300">24시간 변동률 기준</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <Badge variant="secondary" className="bg-gray-600 text-gray-300">대기중</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-muted-foreground text-lg mb-2">📊</div>
            <p className="text-muted-foreground">
              데이터를 불러오는 중입니다...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankBadge = (rank: number) => {
    const getRankStyle = (rank: number) => {
      if (rank <= 3) {
        return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white border-yellow-300/50';
      } else if (rank <= 5) {
        return 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-purple-400/50';
      } else {
        return 'bg-gradient-to-br from-slate-600 to-gray-700 text-white border-slate-500/50';
      }
    };

    return (
      <div className={`
        ${getRankStyle(rank)}
        w-7 h-7 flex items-center justify-center 
        rounded-lg font-bold border shadow-lg
        transition-all duration-200 hover:scale-105 text-sm
      `}>
        {rank}
      </div>
    );
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    } else {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    }
  };

  return (
    <Card className="w-full shadow-xl">
      {/* 헤더 */}
      <CardHeader className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📈</span>
            </div>
            <div>
              <CardTitle className="text-lg text-white">변동률 순위</CardTitle>
              <CardDescription className="text-slate-300">24시간 변동률 기준</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <Badge variant="secondary" className="bg-emerald-600 text-emerald-100">LIVE</Badge>
            </div>
            <Badge variant="outline" className="border-slate-500 text-slate-300">
              {sortedData.length}개
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      {/* 컨트롤 버튼들 */}
      <div className="p-4 border-b flex justify-between items-center bg-muted/30">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            총 {sortedData.length}개
          </Badge>
          {!showAll && (
            <Badge variant="outline">
              페이지 {currentPage} / {totalPages}
            </Badge>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowAllToggle}
        >
          {showAll ? '페이지별 보기 (50개씩)' : '전체 보기'}
        </Button>
      </div>
      
      {/* 리스트 */}
      <CardContent className="p-0">
        <div className="max-h-[70vh] overflow-y-auto">
          {displayData.map((item, index) => {
            const actualRank = showAll ? index + 1 : startIndex + index + 1;
            return (
              <div key={item.symbol}>
                <div 
                  className="
                    flex items-center justify-between 
                    hover:bg-accent
                    p-3
                    transition-colors duration-200
                    cursor-pointer
                    active:bg-accent/80
                  "
                  onClick={() => handleCoinClick(item)}
                >
                  {/* 왼쪽: 순위 + 코인 정보 */}
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {getRankBadge(actualRank)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="mb-1">
                        <div className="font-bold text-foreground text-base truncate mb-1">
                          {item.korean_name}
                        </div>
                        {/* 거래소 배지들을 코인 이름 바로 아래에 배치 */}
                        <div className="flex items-center space-x-1 flex-wrap">
                          {item.isBinanceAlpha && <AlphaIcon />}
                          {item.isOnBinance && <BinanceBadge size="sm" />}
                          {item.isOnUpbit && <UpbitBadge size="sm" />}
                          {hasUpbitUsdtPair(item.symbol) && <UPusdtBadge size="sm" />}
                          <NetworkBadge symbol={item.symbol} size="sm" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-muted-foreground truncate">
                          {item.symbol}
                        </div>
                        {/* 섹터 뱃지를 심볼 옆에 배치 */}
                        <SectorBadge 
                          sector={item.sector || CRYPTO_SECTORS[item.symbol] || '기타'} 
                          size="sm" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽: 가격 + 변동률 + 즐겨찾기 */}
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="font-bold text-foreground text-sm">
                        {formatPrice(item.current_price)}
                      </div>
                      <Badge 
                        variant={item.is_positive ? "default" : "destructive"}
                        className={`
                          text-xs font-bold
                          ${item.is_positive 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-red-600 hover:bg-red-700 text-white'
                          }
                        `}
                      >
                        <span className="mr-1">
                          {item.is_positive ? '▲' : '▼'}
                        </span>
                        <span>
                          {item.is_positive ? '+' : ''}{item.change_rate.toFixed(2)}%
                        </span>
                      </Badge>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 hover:bg-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(item.symbol);
                      }}
                    >
                      {favorites.has(item.symbol) ? '⭐' : '☆'}
                    </Button>
                  </div>
                </div>
                {index < displayData.length - 1 && <Separator />}
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* 페이지네이션 (하단만) */}
      {!showAll && totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* 코인 상세 정보 모달 */}
      <CoinDetailModal 
        coin={selectedCoin}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Card>
  );
}