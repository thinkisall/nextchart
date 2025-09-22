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
    shortLabel: 'ALL',
    icon: '🌐',
    activeColor: 'from-blue-600 to-blue-700',
  },
  bithumb: {
    label: '빗썸',
    shortLabel: 'BTH',
    icon: '₿',
    activeColor: 'from-orange-600 to-red-700',
  },
  upbit: {
    label: '업비트',
    shortLabel: 'UP',
    icon: <UpbitBadge size="sm" />,
    activeColor: 'from-blue-600 to-indigo-700',
  },
  upbitUsdt: {
    label: '업비트USDT',
    shortLabel: 'UP₮',
    icon: <UPusdtBadge size="sm" />,
    activeColor: 'from-emerald-600 to-teal-700',
  },
  binance: {
    label: '바이낸스',
    shortLabel: 'BN',
    icon: <BinanceBadge size="sm" />,
    activeColor: 'from-amber-500 to-yellow-600',
  },
  binanceAlpha: {
    label: '바이낸스알파',
    shortLabel: 'BN⍺',
    icon: <BinanceAlphaBadge />,
    activeColor: 'from-purple-600 to-violet-700',
  },
} as const;

export function ExchangeFilterButtons({ 
  selectedExchange, 
  onExchangeChange, 
  counts 
}: ExchangeFilterButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeConfig = exchangeConfig[selectedExchange];
  const activeCount = counts?.[selectedExchange] || 0;
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">📊</span>
            <CardTitle className="text-base">거래소 필터</CardTitle>
          </div>
          
          <Button
            variant={isExpanded ? "default" : "outline"}
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1"
          >
            <span className="hidden xs:inline text-xs">
              {isExpanded ? '접기' : '전체'}
            </span>
            <span className="xs:hidden text-xs">
              {isExpanded ? '접기' : '선택'}
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
        
        {/* 선택된 거래소 + 다른 거래소들 미리보기 */}
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
          {/* 선택된 거래소 */}
          <div className={`
            flex items-center justify-between px-3 py-2 rounded-lg 
            bg-gradient-to-r ${activeConfig.activeColor} text-white shadow-md min-w-[80px] flex-shrink-0
          `}>
            <div className="flex items-center space-x-1.5">
              <div className="w-4 h-4 flex items-center justify-center">
                {typeof activeConfig.icon === 'string' ? (
                  <span className="text-xs">{activeConfig.icon}</span>
                ) : (
                  <div className="scale-75">{activeConfig.icon}</div>
                )}
              </div>
              <span className="text-xs font-medium text-white">
                {activeConfig.shortLabel}
              </span>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              {activeCount > 999 ? `${Math.floor(activeCount/1000)}k` : activeCount}
            </Badge>
          </div>
          
          {/* 다른 거래소들 미리보기 - 모든 거래소 표시 */}
          {(Object.keys(exchangeConfig) as Array<keyof typeof exchangeConfig>)
            .filter(exchange => exchange !== selectedExchange)
            .map((exchange) => {
              const config = exchangeConfig[exchange];
              const count = counts?.[exchange] || 0;
              
              return (
                <Button
                  key={exchange}
                  variant="outline"
                  size="sm"
                  onClick={() => onExchangeChange(exchange)}
                  className="flex items-center space-x-1.5 min-w-[60px] flex-shrink-0 h-8"
                >
                  <div className="w-3 h-3 flex items-center justify-center">
                    {typeof config.icon === 'string' ? (
                      <span className="text-xs">{config.icon}</span>
                    ) : (
                      <div className="scale-50">{config.icon}</div>
                    )}
                  </div>
                  <span className="text-xs truncate">
                    {config.shortLabel}
                  </span>
                  <Badge variant="secondary" className="text-xs px-1 py-0.5">
                    {count > 999 ? `${Math.floor(count/1000)}k` : count}
                  </Badge>
                </Button>
              );
            })}
        </div>
      </CardHeader>

      {/* 확장된 내용 */}
      {isExpanded && (
        <>
          <Separator />
          <CardContent className="pt-3">
            {/* 전체 거래소 그리드 - 모바일 최적화 */}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {(Object.keys(exchangeConfig) as Array<keyof typeof exchangeConfig>).map((exchange) => {
                const config = exchangeConfig[exchange];
                const isActive = selectedExchange === exchange;
                const count = counts?.[exchange] || 0;
                
                return (
                  <Button
                    key={exchange}
                    variant={isActive ? "default" : "outline"}
                    onClick={() => onExchangeChange(exchange)}
                    className={`
                      group relative overflow-hidden h-auto p-3 transition-all duration-200 hover:scale-105
                      ${isActive 
                        ? `bg-gradient-to-br ${config.activeColor} text-white shadow-md border-2 border-transparent hover:opacity-90` 
                        : 'hover:bg-accent'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center space-y-1.5">
                      {/* 아이콘 */}
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${isActive 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-accent'
                        }
                      `}>
                        {typeof config.icon === 'string' ? (
                          <span className="text-base">{config.icon}</span>
                        ) : (
                          <div className="scale-90">{config.icon}</div>
                        )}
                      </div>
                      
                      {/* 라벨 */}
                      <div className="text-center w-full">
                        <div className={`
                          font-bold text-xs truncate
                          ${isActive ? 'text-white' : ''}
                        `}>
                          <span className="hidden sm:block">{config.label}</span>
                          <span className="sm:hidden">{config.shortLabel}</span>
                        </div>
                        <Badge 
                          variant={isActive ? "secondary" : "outline"}
                          className={`
                            text-xs mt-1
                            ${isActive 
                              ? 'bg-white/20 text-white border-white/20' 
                              : ''
                            }
                          `}
                        >
                          {count > 999 ? `${(count/1000).toFixed(1)}k` : count.toLocaleString()}
                        </Badge>
                      </div>
                      
                      {/* 활성 상태 인디케이터 */}
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-lg flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
            
            <Separator className="my-3" />
            
            {/* 푸터 정보 */}
            <CardDescription className="text-center text-xs">
              거래소별 코인 필터링
            </CardDescription>
          </CardContent>
        </>
      )}
    </Card>
  );
}