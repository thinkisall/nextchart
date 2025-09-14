// 섹터 상세 정보 컴포넌트
'use client';

import { CryptoPrice } from '../../../lib/types';
import { SectorAnalysis } from '../services/SectorAnalysisService';

interface SectorDetailProps {
  analysis: SectorAnalysis;
  onClose?: () => void;
  onCoinClick?: (coin: CryptoPrice) => void;
}

export function SectorDetail({ analysis, onClose, onCoinClick }: SectorDetailProps) {
  const {
    displayName,
    description,
    count,
    totalMarketCap,
    totalVolume,
    avgChange,
    positiveCount,
    negativeCount,
    marketShare,
    volatility,
    momentum,
    topPerformers,
    topLosers,
    coins
  } = analysis;

  // 숫자 포맷팅
  const formatNumber = (num: number): string => {
    if (isNaN(num) || !isFinite(num)) return "0";
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
  };

  // 색상 유틸리티
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getMomentumColor = () => {
    switch (momentum) {
      case 'bullish': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'bearish': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{displayName}</h2>
            <p className="text-blue-100 mb-4">{description}</p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMomentumColor()}`}>
              {momentum === 'bullish' ? '📈 상승세' : 
               momentum === 'bearish' ? '📉 하락세' : '⏸️ 중립'}
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 주요 지표 */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">토큰 수</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              ${formatNumber(totalMarketCap)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">시가총액</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className={`text-xl font-bold ${getChangeColor(avgChange)}`}>
              {avgChange > 0 ? '+' : ''}{avgChange.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">평균 변동률</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {marketShare.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">시장 점유율</div>
          </div>
        </div>

        {/* 전체 토큰 목록 (간략) */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            💰 섹터 내 모든 토큰 ({coins.length}개)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {coins
              .sort((a, b) => (b.change_rate || 0) - (a.change_rate || 0))
              .map((coin) => (
                <div
                  key={coin.symbol}
                  onClick={() => onCoinClick?.(coin)}
                  className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="text-xs font-medium text-gray-900 dark:text-white text-center">
                    {coin.symbol}
                  </div>
                  <div className={`text-xs text-center mt-1 ${getChangeColor(coin.change_rate || 0)}`}>
                    {(coin.change_rate || 0) > 0 ? '+' : ''}{(coin.change_rate || 0).toFixed(1)}%
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
