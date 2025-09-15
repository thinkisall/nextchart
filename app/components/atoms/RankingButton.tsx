import { TrendingUp } from 'lucide-react';

interface RankingButtonProps {
  onClick: () => void;
  topGainer?: string;
  topGainerPercentage?: number;
}

export function RankingButton({ onClick, topGainer, topGainerPercentage }: RankingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        group relative w-full
        bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600
        hover:from-emerald-700 hover:via-green-700 hover:to-teal-700
        rounded-2xl p-4 
        shadow-xl hover:shadow-2xl
        border border-emerald-400/30
        transition-all duration-300 
        hover:scale-[1.02] active:scale-[0.98]
        overflow-hidden
      "
    >
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-in-out opacity-0 group-hover:opacity-100" />
      
      <div className="relative flex items-center justify-between">
        {/* 왼쪽: 아이콘과 텍스트 */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white mb-1">
              변동률 순위
            </h3>
            <p className="text-emerald-100 text-sm">
              {topGainer ? (
                <>
                  <span className="font-semibold">{topGainer}</span>
                  {topGainerPercentage && (
                    <span className="ml-1 text-white">
                      +{topGainerPercentage.toFixed(2)}%
                    </span>
                  )}
                </>
              ) : (
                '실시간 상승률 랭킹 확인'
              )}
            </p>
          </div>
        </div>
        
        {/* 오른쪽: 화살표 */}
        <div className="text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      {/* 순위 배지들 미리보기 */}
      <div className="absolute -top-2 -right-2 flex space-x-1">
        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
          1
        </div>
        <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
          2
        </div>
        <div className="w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
          3
        </div>
      </div>
    </button>
  );
}