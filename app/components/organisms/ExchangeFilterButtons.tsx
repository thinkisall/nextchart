'use client';

import { useState } from 'react';
import { BinanceBadge } from '../atoms/BinanceBadge';
import { BinanceAlphaBadge } from '../atoms/BinanceAlphaBadge';
import { UpbitBadge } from '../atoms/UpbitBadge';
import { UPusdtBadge } from '../atoms/UPusdtBadge';
import type { ExchangeType } from '../../features/exchange-performance/types';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';

// Mobile components
import { 
  MobileCard, 
  MobileCardContent, 
  MobileCardHeader, 
  MobileCardTitle,
  MobileButton 
} from '../mobile';

interface ExchangeFilterButtonsProps {
  selectedExchange: ExchangeType | 'all';
  onExchangeChange: (exchange: ExchangeType | 'all') => void;
  counts?: {
    all: number;
    bithumb: number;
    upbit: number;
    upbitUsdt: number;
    binance: number;
    binanceAlpha: number;
  };
}

const exchangeConfig = {
  all: {
    label: '전체',
    icon: '🌐',
    color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
    darkColor: 'dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'
  },
  bithumb: {
    label: '빗썸',
    icon: '🟠',
    color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
    darkColor: 'dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-800/30'
  },
  upbit: {
    label: '업비트',
    icon: <UpbitBadge />,
    color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    darkColor: 'dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-800/30'
  },
  upbitUsdt: {
    label: '업비트 USDT',
    icon: <UPusdtBadge />,
    color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    darkColor: 'dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-800/30'
  },
  binance: {
    label: '바이낸스',
    icon: <BinanceBadge />,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
    darkColor: 'dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700 dark:hover:bg-yellow-800/30'
  },
  binanceAlpha: {
    label: '바이낸스 알파',
    icon: <BinanceAlphaBadge />,
    color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    darkColor: 'dark:bg-green-900/30 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-800/30'
  }
};

export function ExchangeFilterButtons({ selectedExchange, onExchangeChange, counts }: ExchangeFilterButtonsProps) {
  return (
    <MobileCard>
      <MobileCardHeader>
        <MobileCardTitle>거래소별 필터</MobileCardTitle>
      </MobileCardHeader>
      
      <MobileCardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {Object.entries(exchangeConfig).map(([key, config]) => {
            const isSelected = selectedExchange === key;
            const count = counts?.[key as keyof typeof counts] || 0;
            
            return (
              <MobileButton
                key={key}
                variant={isSelected ? "primary" : "outline"}
                size="sm"
                onClick={() => onExchangeChange(key as ExchangeType | 'all')}
                className={`
                  flex flex-col items-center gap-1 p-3 h-auto min-h-[60px]
                  ${isSelected ? '' : `${config.color} ${config.darkColor}`}
                  transition-all duration-200
                `}
              >
                {/* 아이콘 */}
                <div className="flex items-center justify-center">
                  {typeof config.icon === 'string' ? (
                    <span className="text-lg">{config.icon}</span>
                  ) : (
                    config.icon
                  )}
                </div>
                
                {/* 라벨 */}
                <span className="text-xs font-medium truncate">
                  {config.label}
                </span>
                
                {/* 카운트 */}
                {count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-1 py-0 h-4 min-w-[16px]"
                  >
                    {count}
                  </Badge>
                )}
              </MobileButton>
            );
          })}
        </div>
        
        {/* 선택된 거래소 정보 */}
        {selectedExchange !== 'all' && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                선택된 거래소: {exchangeConfig[selectedExchange as keyof typeof exchangeConfig].label}
              </span>
              <Badge variant="outline">
                {counts?.[selectedExchange as keyof typeof counts] || 0}개 코인
              </Badge>
            </div>
          </div>
        )}
      </MobileCardContent>
    </MobileCard>
  );
}
