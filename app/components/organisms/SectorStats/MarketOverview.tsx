interface MarketOverviewProps {
  totalAssets: number;
  totalPositive: number;
  totalNegative: number;
  positivePercentage: string;
}

export function MarketOverview({
  totalAssets,
  totalPositive,
  totalNegative,
  positivePercentage,
}: MarketOverviewProps) {
  return (
    <div className="p-4 sm:p-6 border-b border-gray-200/20 dark:border-gray-700/30">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
          <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalAssets}
          </div>
          <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
            총 자산
          </div>
        </div>
        
        <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalPositive}
          </div>
          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
            상승
          </div>
        </div>
        
        <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 rounded-xl border border-red-200/50 dark:border-red-800/30">
          <div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
            {totalNegative}
          </div>
          <div className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide">
            하락
          </div>
        </div>
        
        <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl border border-purple-200/50 dark:border-purple-800/30">
          <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
            {positivePercentage}%
          </div>
          <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
            강세 비율
          </div>
        </div>
      </div>
    </div>
  );
}
