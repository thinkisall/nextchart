'use client';

import { useMemo } from 'react';
import { ExchangeFilterButton } from '../atoms/ExchangeFilterButton';
import { CryptoPrice, ExchangeType, ExchangeFilter } from '../../lib/types';

interface ExchangeFilterSectionProps {
  data: CryptoPrice[];
  selectedExchange: ExchangeType;
  onExchangeChange: (exchange: ExchangeType) => void;
}

export function ExchangeFilterSection({
  data,
  selectedExchange,
  onExchangeChange
}: ExchangeFilterSectionProps) {
  
  // 거래소별 코인 개수 계산
  const exchangeFilters = useMemo((): ExchangeFilter[] => {
    const exchanges: ExchangeFilter[] = [
      {
        id: 'ALL',
        name: '전체',
        icon: '🌐',
        count: data.length
      },
      {
        id: 'BITHUMB',
        name: '빗썸',
        icon: '🟠',
        count: data.length // 빗썸이 기본 데이터 소스
      },
      {
        id: 'UPBIT',
        name: '업비트',
        icon: '🔵',
        count: data.filter(coin => coin.isOnUpbit).length
      },
      {
        id: 'BINANCE',
        name: '바이낸스',
        icon: '🟡',
        count: data.filter(coin => coin.isOnBinance).length
      },
      {
        id: 'BINANCE_ALPHA',
        name: '바이낸스 알파',
        icon: '⭐',
        count: data.filter(coin => coin.isBinanceAlpha).length
      }
    ];

    return exchanges.filter(exchange => (exchange.count || 0) > 0);
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          거래소별 순위
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          거래소를 선택하여 해당 거래소에 상장된 코인들의 순위를 확인하세요
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {exchangeFilters.map((exchange) => (
          <ExchangeFilterButton
            key={exchange.id}
            exchange={exchange}
            isActive={selectedExchange === exchange.id}
            onClick={() => onExchangeChange(exchange.id)}
          />
        ))}
      </div>
      
      {/* 선택된 거래소 정보 */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {exchangeFilters.find(e => e.id === selectedExchange)?.icon}
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {exchangeFilters.find(e => e.id === selectedExchange)?.name}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {exchangeFilters.find(e => e.id === selectedExchange)?.count}개 코인
          </div>
        </div>
      </div>
    </div>
  );
}
