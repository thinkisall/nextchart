interface RankingHeaderProps {
  title?: string;
  subtitle?: string;
  isLive?: boolean;
  totalCount?: number;
}

export function RankingHeader({ 
  title = "변동률 순위", 
  subtitle = "24시간 변동률 기준",
  isLive = true,
  totalCount
}: RankingHeaderProps) {
  return (
    <div className="
      bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
      px-4 py-6 
      border-b border-slate-600/30
    ">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 타이틀 영역 */}
        <div className="flex items-center space-x-3">
          <div className="
            w-10 h-10 
            bg-gradient-to-br from-orange-400 to-red-500
            rounded-xl flex items-center justify-center
            shadow-lg
          ">
            <span className="text-white text-xl">📈</span>
          </div>
          
          <div>
            <h1 className="text-lg font-bold text-white">
              {title}
            </h1>
            <p className="text-sm text-slate-300">
              {subtitle}
            </p>
          </div>
        </div>

        {/* 오른쪽: 상태 표시 */}
        <div className="flex items-center space-x-3">
          {isLive && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300 text-sm font-medium">
                LIVE
              </span>
            </div>
          )}
          
          {totalCount && (
            <div className="text-slate-300 text-sm">
              {totalCount} / {totalCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}