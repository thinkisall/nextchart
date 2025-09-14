// 섹터 그리드 컴포넌트
import { SectorAnalysis } from '../services/SectorAnalysisService';
import { SectorCard } from './SectorCard';

interface SectorGridProps {
  analyses: SectorAnalysis[];
  onSectorClick?: (analysis: SectorAnalysis) => void;
  className?: string;
}

export function SectorGrid({ analyses, onSectorClick, className = '' }: SectorGridProps) {
  if (analyses.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">섹터 분석 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {analyses.map((analysis) => (
        <SectorCard
          key={analysis.name}
          analysis={analysis}
          onClick={() => onSectorClick?.(analysis)}
          className="h-full"
        />
      ))}
    </div>
  );
}

// 섹터 필터 컴포넌트
interface SectorFilterProps {
  analyses: SectorAnalysis[];
  selectedMomentum: 'all' | 'bullish' | 'bearish' | 'neutral';
  onMomentumChange: (momentum: 'all' | 'bullish' | 'bearish' | 'neutral') => void;
  sortBy: 'marketCap' | 'change' | 'volume' | 'count';
  onSortChange: (sort: 'marketCap' | 'change' | 'volume' | 'count') => void;
}

export function SectorFilter({
  analyses,
  selectedMomentum,
  onMomentumChange,
  sortBy,
  onSortChange
}: SectorFilterProps) {
  const momentumCounts = {
    all: analyses.length,
    bullish: analyses.filter(a => a.momentum === 'bullish').length,
    bearish: analyses.filter(a => a.momentum === 'bearish').length,
    neutral: analyses.filter(a => a.momentum === 'neutral').length
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur border border-white/10 dark:border-gray-700/30 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* 모멘텀 필터 */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            추세 필터:
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(momentumCounts).map(([momentum, count]) => (
              <button
                key={momentum}
                onClick={() => onMomentumChange(momentum as any)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${selectedMomentum === momentum
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {momentum === 'all' ? '전체' : 
                 momentum === 'bullish' ? '상승세 📈' :
                 momentum === 'bearish' ? '하락세 📉' : '중립 ⏸️'} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            정렬:
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm
                     text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="marketCap">시가총액</option>
            <option value="change">변동률</option>
            <option value="volume">거래량</option>
            <option value="count">토큰 수</option>
          </select>
        </div>
      </div>
    </div>
  );
}
