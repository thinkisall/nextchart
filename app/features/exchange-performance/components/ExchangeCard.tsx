import { memo } from 'react';
import { ExchangePerformanceService } from '../services/exchangePerformanceService';
import type { ExchangeStats } from '../types';

interface ExchangeCardProps {
  exchange: ExchangeStats;
  rank?: number;
  showTopCoins?: boolean;
}

/**
 * 거래소별 성과 카드 컴포넌트
 * 거래소의 주요 통계와 상위/하위 코인을 표시
 */
export const ExchangeCard = memo<ExchangeCardProps>(({ 
  exchange, 
  rank, 
  showTopCoins = false 
}) => {
  const theme = ExchangePerformanceService.getExchangeTheme(exchange.name as any);
  const isPositive = exchange.averageChange > 0;
  
  const getChangeStyle = () => {
    return isPositive 
      ? 'text-red-600 dark:text-red-400' 
      : 'text-blue-600 dark:text-blue-400';
  };

  const getRankBadge = () => {
    if (!rank) return null;
    
    const badges = {
      1: { emoji: '🥇', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      2: { emoji: '🥈', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' },
      3: { emoji: '🥉', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
    };
    
    const badge = badges[rank as keyof typeof badges];
    if (!badge) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          #{rank}
        </span>
      );
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.emoji} #{rank}
      </span>
    );
  };

  return (
    <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${theme.bg} 
      border ${theme.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
      
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{exchange.icon}</div>
          <div>
            <h3 className={`font-bold text-lg ${theme.text}`}>
              {exchange.displayName}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {exchange.totalCoins}개 코인
            </div>
          </div>
        </div>
        
        {getRankBadge()}
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
          <div className={`text-2xl font-bold ${getChangeStyle()}`}>
            {ExchangePerformanceService.formatPercentage(exchange.averageChange)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">평균 변동률</div>
        </div>
        
        <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {exchange.positivePercentage.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">상승 비율</div>
        </div>
      </div>

      {/* 상승/하락 코인 수 */}
      <div className="flex justify-between text-sm mb-4">
        <span className="text-red-600 dark:text-red-400">
          ▲ {exchange.positiveCoins}개
        </span>
        <span className="text-blue-600 dark:text-blue-400">
          ▼ {exchange.negativeCoins}개
        </span>
      </div>

      {/* 상위/하위 코인 (선택적 표시) */}
      {showTopCoins && (
        <div className="space-y-3">
          {exchange.topGainers.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                🚀 상위 상승
              </div>
              <div className="space-y-1">
                {exchange.topGainers.slice(0, 2).map((coin) => (
                  <div key={coin.symbol} className="flex justify-between text-xs">
                    <span className="font-mono">{coin.symbol.replace('_KRW', '')}</span>
                    <span className="text-red-600 dark:text-red-400 font-semibold">
                      +{coin.change_rate.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ExchangeCard.displayName = 'ExchangeCard';
