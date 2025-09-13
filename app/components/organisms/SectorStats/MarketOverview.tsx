'use client';

interface MarketOverviewProps {
  totalAssets: number;
  totalPositive: number;
  totalNegative: number;
  positivePercentage: number;
}

export function MarketOverview({ 
  totalAssets, 
  totalPositive, 
  totalNegative, 
  positivePercentage 
}: MarketOverviewProps) {
  return (
    <div className="px-6 pb-6 sm:px-8 sm:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* 글래스모피즘 카드 */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl overflow-hidden">
          <div className="relative">
            {/* 내부 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20" />
            
            {/* 장식적 원형 요소 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-400/10 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full transform -translate-x-12 translate-y-12" />
            
            <div className="relative p-6 sm:p-8">
              {/* 모바일 최적화 그리드 */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
                {/* 총 자산 */}
                <div className="text-center group">
                  <div className="mb-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <span className="text-xl sm:text-2xl">💎</span>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
                    {totalAssets.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    총 코인
                  </div>
                </div>

                {/* 상승 종목 */}
                <div className="text-center group">
                  <div className="mb-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <span className="text-xl sm:text-2xl">🚀</span>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-2">
                    {totalPositive.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    상승
                  </div>
                </div>

                {/* 하락 종목 */}
                <div className="text-center group">
                  <div className="mb-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <span className="text-xl sm:text-2xl">📉</span>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent mb-2">
                    {totalNegative.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    하락
                  </div>
                </div>

                {/* 시장 심리 */}
                <div className="text-center group">
                  <div className="mb-3">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 ${
                      positivePercentage >= 50 
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                        : 'bg-gradient-to-br from-red-500 to-rose-600'
                    }`}>
                      <span className="text-xl sm:text-2xl">{positivePercentage >= 50 ? '😊' : '😰'}</span>
                    </div>
                  </div>
                  <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${
                    positivePercentage >= 50
                      ? 'from-emerald-600 to-green-700'
                      : 'from-red-600 to-rose-700'
                  }`}>
                    {positivePercentage.toFixed(1)}%
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    강세 비율
                  </div>
                </div>
              </div>

              {/* 하단 프로그레스 바 */}
              <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">시장 심리</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {positivePercentage >= 60 ? '매우 낙관적' : 
                     positivePercentage >= 50 ? '낙관적' : 
                     positivePercentage >= 40 ? '중립' : '비관적'}
                  </span>
                </div>
                
                <div className="relative">
                  <div className="h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-emerald-200 dark:from-red-800/30 dark:via-yellow-800/30 dark:to-emerald-800/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{ width: `${positivePercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* 중간점 표시 */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-px">
                    <div className="w-px h-3 bg-gray-400 dark:bg-gray-600"></div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transform -translate-x-1/2">50%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}