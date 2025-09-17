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
      1: { emoji: '🥇', color: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' },
      2: { emoji: '🥈', color: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800' },
      3: { emoji: '🥉', color: 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' },
    };
    
    const badge = badges[rank as keyof typeof badges];
    if (!badge) {
      return (
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full px-3 py-1 shadow-lg">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">#{rank}</span>
        </div>
      );
    }
    
    return (
      <div className={`${badge.color} rounded-full px-3 py-1 shadow-lg`}>
        <span className="text-sm font-bold">{badge.emoji} #{rank}</span>
      </div>
    );
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      
      {/* 헤더 배경 그라데이션 */}
      <div className={`bg-gradient-to-br ${theme.bg} px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center text-sm sm:text-lg md:text-xl lg:text-2xl flex-shrink-0 shadow-lg">
              {exchange.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`font-bold text-sm sm:text-base md:text-lg lg:text-xl ${theme.text} truncate`}>
                {exchange.displayName}
              </h3>
              <p className={`${theme.text} opacity-80 text-xs sm:text-sm`}>
                {exchange.totalCoins}개 코인
              </p>
            </div>
          </div>
          
          <div className="ml-1 sm:ml-2">
            {getRankBadge()}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-3 sm:p-4 md:p-6">
        {/* 주요 지표 */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-blue-200 dark:border-blue-700/30">
            <div className="text-center">
              <div className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 ${getChangeStyle()}`}>
                {ExchangePerformanceService.formatPercentage(exchange.averageChange)}
              </div>
              <div className="text-xs sm:text-xs md:text-xs text-blue-600 dark:text-blue-400 font-medium">평균 변동률</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-green-200 dark:border-green-700/30">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {exchange.positivePercentage.toFixed(1)}%
              </div>
              <div className="text-xs sm:text-xs md:text-xs text-green-600 dark:text-green-400 font-medium">상승 비율</div>
            </div>
          </div>
        </div>

        {/* 상승/하락 코인 수 - 프로그레스 바 스타일 */}
        <div className="mb-4 sm:mb-5 md:mb-6">
          <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
              <span>상승 {exchange.positiveCoins}개</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></span>
              <span>하락 {exchange.negativeCoins}개</span>
            </span>
          </div>
          <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500" 
                style={{ width: `${(exchange.positiveCoins / exchange.totalCoins) * 100}%` }}
              />
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500" 
                style={{ width: `${(exchange.negativeCoins / exchange.totalCoins) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 상위 성과자 */}
        {showTopCoins && exchange.topGainers.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <span className="text-sm sm:text-base md:text-lg">🚀</span>
              <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">상위 성과자</h4>
            </div>
            <div className="space-y-1 sm:space-y-2">
              {exchange.topGainers.slice(0, 2).map((coin, index) => (
                <div key={coin.symbol} className="flex items-center justify-between p-1.5 sm:p-2 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-xs sm:text-xs font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {coin.symbol.replace('_KRW', '')}
                    </span>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 rounded-md sm:rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1">
                    <span className="text-red-600 dark:text-red-400 text-xs sm:text-xs font-bold">
                      +{coin.change_rate.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 호버 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
});

ExchangeCard.displayName = 'ExchangeCard';
