'use client';

import { hasUpbitUsdtPair, getUpbitUsdtSymbol } from '../lib/exchanges';
import { UPusdtBadge } from '../components/atoms/UPusdtBadge';

export default function TestUPusdtPage() {
  // 테스트할 빗썸 심볼들
  const testSymbols = [
    'BTC_KRW', 'ETH_KRW', 'PEPE_KRW', 'DOGE_KRW', 
    'SOL_KRW', 'ADA_KRW', 'XRP_KRW', 'BONK_KRW'
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          업비트 USDT 매핑 테스트
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            매핑 테스트 결과
          </h2>
          
          <div className="space-y-3">
            {testSymbols.map((symbol) => {
              const hasUsdt = hasUpbitUsdtPair(symbol);
              const usdtSymbol = getUpbitUsdtSymbol(symbol);
              
              return (
                <div key={symbol} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="font-mono text-gray-900 dark:text-white">
                    {symbol}
                  </span>
                  <div className="flex items-center space-x-2">
                    {hasUsdt ? (
                      <>
                        <span className="text-green-600 dark:text-green-400">✓ 매핑됨</span>
                        <UPusdtBadge size="sm" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          → {usdtSymbol}
                        </span>
                      </>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">✗ 매핑 없음</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            전체 매핑 통계
          </h2>
          <div className="text-gray-600 dark:text-gray-300">
            <p>총 매핑된 코인 수: {require('../lib/exchanges/upbit-usdt-coins').UPBIT_USDT_COINS.size}개</p>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            UPusdt 배지 테스트
          </h2>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-gray-700 dark:text-gray-300">Small:</span>
            <UPusdtBadge size="sm" />
            <span className="text-gray-700 dark:text-gray-300">Medium:</span>
            <UPusdtBadge size="md" />
            <span className="text-gray-700 dark:text-gray-300">Large:</span>
            <UPusdtBadge size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
