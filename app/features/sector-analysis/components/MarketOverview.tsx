// 시장 개요 컴포넌트
interface MarketOverviewProps {
  performanceSummary: {
    totalSectors: number;
    bullishSectors: number;
    bearishSectors: number;
    neutralSectors: number;
    bestPerformer: any;
    worstPerformer: any;
    avgMarketPerformance: number;
  };
  totalCoins: number;
  className?: string;
}

export function MarketOverview({ performanceSummary, totalCoins, className = '' }: MarketOverviewProps) {
  const {
    totalSectors,
    bullishSectors,
    bearishSectors,
    neutralSectors,
    bestPerformer,
    worstPerformer,
    avgMarketPerformance
  } = performanceSummary;

  // 색상 결정 함수
  const getPerformanceColor = (value: number) => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getPerformanceBackground = (value: number) => {
    if (value > 0) return 'bg-green-100 dark:bg-green-900/30';
    if (value < 0) return 'bg-red-100 dark:bg-red-900/30';
    return 'bg-gray-100 dark:bg-gray-900/30';
  };

  return (
    <div className={`bg-transparent rounded-xl p-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        📊 시장 개요
      </h2>

      {/* 전체 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalSectors}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            총 섹터
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totalCoins}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            총 토큰
          </div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${getPerformanceColor(avgMarketPerformance)}`}>
            {avgMarketPerformance > 0 ? '+' : ''}{avgMarketPerformance.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            평균 성과
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {bullishSectors}/{totalSectors}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            상승 섹터
          </div>
        </div>
      </div>

      {/* 섹터 분포 */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          섹터별 추세 분포
        </h3>
        <div className="flex h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div 
            className="bg-green-500 transition-all duration-500"
            style={{ width: `${(bullishSectors / totalSectors) * 100}%` }}
            title={`상승세: ${bullishSectors}개 섹터`}
          />
          <div 
            className="bg-red-500 transition-all duration-500"
            style={{ width: `${(bearishSectors / totalSectors) * 100}%` }}
            title={`하락세: ${bearishSectors}개 섹터`}
          />
          <div 
            className="bg-gray-400 transition-all duration-500"
            style={{ width: `${(neutralSectors / totalSectors) * 100}%` }}
            title={`중립: ${neutralSectors}개 섹터`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>📈 상승세 {bullishSectors}</span>
          <span>📉 하락세 {bearishSectors}</span>
          <span>⏸️ 중립 {neutralSectors}</span>
        </div>
      </div>

      {/* 최고/최저 성과자 */}
      {bestPerformer?.displayName && worstPerformer?.displayName && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* 최고 성과 섹터 */}
          <div className={`p-4 rounded-lg ${getPerformanceBackground(bestPerformer.avgChange)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                🏆 최고 성과 섹터
              </span>
              <span className="text-lg">📈</span>
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {bestPerformer.displayName}
            </div>
            <div className={`text-lg font-bold ${getPerformanceColor(bestPerformer.avgChange)}`}>
              +{bestPerformer.avgChange.toFixed(2)}%
            </div>
          </div>

          {/* 최저 성과 섹터 */}
          <div className={`p-4 rounded-lg ${getPerformanceBackground(worstPerformer.avgChange)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                📉 최저 성과 섹터
              </span>
              <span className="text-lg">📉</span>
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {worstPerformer.displayName}
            </div>
            <div className={`text-lg font-bold ${getPerformanceColor(worstPerformer.avgChange)}`}>
              {worstPerformer.avgChange.toFixed(2)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
