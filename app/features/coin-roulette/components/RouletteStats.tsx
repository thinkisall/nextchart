import { memo } from 'react';

interface RouletteStatsProps {
  stats: {
    totalSpins: number;
    alphaCount: number;
    binanceCount: number;
    alphaPercentage: string;
    mostPicked: [string, number][];
  };
  onClearHistory?: () => void;
}

/**
 * 룰렛 통계 표시 컴포넌트
 * 뽑기 기록과 통계 정보를 표시
 */
export const RouletteStats = memo<RouletteStatsProps>(({ 
  stats, 
  onClearHistory 
}) => {
  if (stats.totalSpins === 0) {
    return (
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">📊</div>
          <div>아직 뽑기 기록이 없습니다</div>
          <div className="text-sm mt-1">첫 번째 코인을 뽑아보세요!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2">
          <span>📊</span>
          <span>뽑기 통계</span>
        </h3>
        {onClearHistory && (
          <button
            onClick={onClearHistory}
            className="text-xs px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 
              rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
          >
            기록 삭제
          </button>
        )}
      </div>

      {/* 전체 통계 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalSpins}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">총 뽑기 횟수</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.alphaPercentage}%
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">알파 코인 비율</div>
        </div>
      </div>

      {/* 카테고리별 통계 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-1">
            <span>📈</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">바이낸스</span>
          </div>
          <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
            {stats.binanceCount}
          </div>
        </div>
        
        <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-1">
            <span>🔥</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">알파</span>
          </div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {stats.alphaCount}
          </div>
        </div>
      </div>

      {/* 인기 코인 TOP 3 */}
      {stats.mostPicked.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-1">
            <span>🏆</span>
            <span>가장 많이 뽑힌 코인</span>
          </h4>
          <div className="space-y-2">
            {stats.mostPicked.slice(0, 3).map(([coin, count], index) => (
              <div key={coin} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                  <span className="font-mono font-medium text-gray-800 dark:text-gray-200">
                    {coin}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {count}회
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

RouletteStats.displayName = 'RouletteStats';
