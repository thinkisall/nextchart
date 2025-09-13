import { SectorCard } from "./SectorCard";

interface SectorGridProps {
  sectors: [string, {
    count: number;
    totalVolume: number;
    avgChange: number;
    positiveCount: number;
  }][];
  onSectorClick: (sector: string) => void;
  formatNumber: (num: number) => string;
}

export function SectorGrid({ sectors, onSectorClick, formatNumber }: SectorGridProps) {
  return (
    <div className="hidden lg:block">
      {/* 고급스러운 헤더 */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-white/80 via-gray-50/80 to-white/80 dark:from-gray-800/80 dark:via-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-2xl">🌟</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 dark:from-white dark:via-purple-100 dark:to-indigo-100 bg-clip-text text-transparent">
                  섹터별 상세 분석
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  각 섹터의 실시간 성과와 트렌드를 심층 분석하여 투자 인사이트를 제공합니다
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {sectors.length}
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  활성 섹터
                </div>
              </div>
              
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  실시간
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 그리드 레이아웃 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
        {sectors.map(([sector, stats], index) => (
          <div 
            key={sector} 
            className="transform transition-all duration-500 hover:scale-[1.02]"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* 순위 표시 */}
            {index < 3 && (
              <div className="relative mb-2">
                <div className={`absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                  'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                }`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
              </div>
            )}
            
            <SectorCard
              sector={sector}
              stats={stats}
              onSectorClick={onSectorClick}
              formatNumber={formatNumber}
            />
            
            {/* 섹터 순위 정보 */}
            <div className="mt-3 text-center">
              <div className="inline-flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30 dark:border-gray-700/30">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  #{index + 1}
                </span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  평균 {stats.avgChange > 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 정보 패널 */}
      <div className="mt-12">
        <div className="bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-indigo-900/10 dark:via-purple-900/10 dark:to-pink-900/10 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl">📈</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">실시간 순위</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                평균 변동률 기준으로 실시간 섹터 순위 제공
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl">🎯</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">동적 정렬</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                실시간 성과에 따라 자동으로 섹터 순위 업데이트
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl">💡</div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">투자 인사이트</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                섹터 트렌드 분석으로 투자 기회 발견
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}