import { ClientOnly } from '../../../hooks/useIsClient';

interface MarketStatsData {
  totalAssets: number;
  positiveCount: number;
  negativeCount: number;
}

interface MarketStatusPanelProps {
  sseConnected: boolean;
  sseError: string | null;
  marketStats: MarketStatsData;
}

/**
 * 시장 상태 패널 컴포넌트
 * 연결 상태, 시장 통계, 에러 상태를 표시
 */
export function MarketStatusPanel({ 
  sseConnected, 
  sseError, 
  marketStats 
}: MarketStatusPanelProps) {
  return (
    <ClientOnly fallback={
      <div className="h-16 sm:h-20 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>
    }>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            {/* Connection Status */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${sseConnected ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {sseConnected && (
                      <div className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full animate-ping opacity-40"></div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                    {sseConnected ? '실시간 시세 연결됨' : '연결 중...'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    실시간 스트림 • 1초 간격 업데이트
                  </div>
                </div>
              </div>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:flex lg:items-center lg:space-x-6">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {marketStats.totalAssets}
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  총 자산
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {marketStats.positiveCount}
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  상승
                </div>
              </div>
              <div className="text-center col-span-2 sm:col-span-1">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 dark:text-red-400">
                  {marketStats.negativeCount}
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  하락
                </div>
              </div>
            </div>

            {/* Error Display */}
            {sseError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 sm:px-4 py-2 mt-2 lg:mt-0">
                <span className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">
                  {sseError}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}