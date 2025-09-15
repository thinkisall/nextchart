'use client';

import { useState, useMemo } from 'react';
import { CryptoPrice } from '../../lib/types';
import { ClientOnly } from '../../hooks/useIsClient';
import { BinanceBadge } from '../atoms/BinanceBadge';
import { AlphaIcon } from '../atoms/BinanceAlphaBadge';
import { UpbitBadge } from '../atoms/UpbitBadge';
import { UPusdtBadge } from '../atoms/UPusdtBadge';
import { hasUpbitUsdtPair } from '../../lib/exchanges';

interface UpbitStyleRankingProps {
  data: CryptoPrice[];
  maxItems?: number;
  onItemClick?: (item: CryptoPrice) => void;
}

export function UpbitStyleRanking({ 
  data, 
  maxItems = 20, 
  onItemClick 
}: UpbitStyleRankingProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // 안전한 정렬 처리
  const sortedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    
    return data
      .filter(item => item && typeof item.change_rate === 'number')
      .sort((a, b) => (b.change_rate || 0) - (a.change_rate || 0))
      .slice(0, maxItems);
  }, [data, maxItems]);

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

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📈</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">변동률 순위</h1>
                <p className="text-sm text-slate-300">24시간 변동률 기준</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">대기중</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-gray-400 text-lg mb-2">📊</div>
            <p className="text-gray-500 dark:text-gray-400">
              데이터를 불러오는 중입니다...
            </p>
          </div>
        </div>
      </div>
    );
  }
  const getRankBadge = (rank: number) => {
    const getRankStyle = (rank: number) => {
      if (rank <= 3) {
        return {
          bg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
          text: 'text-white',
          border: 'border-yellow-300/50'
        };
      } else if (rank <= 5) {
        return {
          bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
          text: 'text-white',
          border: 'border-purple-400/50'
        };
      } else {
        return {
          bg: 'bg-gradient-to-br from-slate-600 to-gray-700',
          text: 'text-white',
          border: 'border-slate-500/50'
        };
      }
    };

    const style = getRankStyle(rank);
    return (
      <div className={`
        ${style.bg} ${style.text} ${style.border} 
        w-8 h-8 flex items-center justify-center 
        rounded-xl font-bold border shadow-lg
        transition-all duration-200 hover:scale-105
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
    <div className="bg-white dark:bg-gray-800 rounded-t-3xl overflow-hidden shadow-xl">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📈</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">변동률 순위</h1>
              <p className="text-sm text-slate-300">24시간 변동률 기준</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-300 text-sm font-medium">LIVE</span>
            </div>
            <div className="text-slate-300 text-sm">{sortedData.length} / {sortedData.length}</div>
          </div>
        </div>
      </div>
      
      {/* 리스트 */}
      <div className="max-h-[70vh] overflow-y-auto">
        {sortedData.map((item, index) => (
          <div 
            key={item.symbol}
            className="
              flex items-center justify-between 
              bg-white dark:bg-gray-800 
              hover:bg-gray-50 dark:hover:bg-gray-750
              border-b border-gray-100 dark:border-gray-700
              px-4 py-4
              transition-colors duration-200
              cursor-pointer
              active:bg-gray-100 dark:active:bg-gray-700
            "
            onClick={() => onItemClick?.(item)}
          >
            {/* 왼쪽: 순위 + 코인 정보 */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {getRankBadge(index + 1)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="font-bold text-gray-900 dark:text-white text-base truncate">
                    {item.korean_name}
                  </div>
                  {/* 거래소 배지들 */}
                  {item.isBinanceAlpha && <AlphaIcon />}
                  {item.isOnBinance && <BinanceBadge size="sm" />}
                  {item.isOnUpbit && <UpbitBadge size="sm" />}
                  {hasUpbitUsdtPair(item.symbol) && <UPusdtBadge size="sm" />}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {item.symbol}
                </div>
              </div>
            </div>

            {/* 오른쪽: 가격 + 변동률 + 즐겨찾기 */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-bold text-gray-900 dark:text-white text-base">
                  {formatPrice(item.current_price)}
                </div>
                <div className={`
                  flex items-center font-bold tracking-tight text-sm
                  ${item.is_positive 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-red-600 dark:text-red-400'
                  }
                `}>
                  <span className="mr-1">
                    {item.is_positive ? '▲' : '▼'}
                  </span>
                  <span>
                    {item.is_positive ? '+' : ''}{item.change_rate.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteToggle(item.symbol);
                }}
                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-yellow-500 transition-colors duration-200"
              >
                {favorites.has(item.symbol) ? '⭐' : '☆'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
