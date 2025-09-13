'use client';

interface SectorHeaderProps {
  activeSectors: number;
}

export function SectorHeader({ activeSectors }: SectorHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      {/* 배경 그라데이션과 패턴 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-indigo-900/30" />
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      {/* 장식적 요소들 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full transform -translate-x-12 translate-y-12" />
      
      <div className="relative px-6 py-8 sm:px-8 sm:py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white/20 backdrop-blur-sm">
                  <div className="text-2xl text-white">📊</div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent leading-tight">
                  섹터별 시장 분석
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 font-medium">
                  암호화폐 생태계의 섹터별 투자 동향을 한눈에 파악하세요
                </p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {activeSectors}
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  활성 섹터
                </div>
              </div>
              
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600" />
              
              <div className="text-center">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse mb-2"></div>
                <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  실시간
                </div>
              </div>
            </div>
          </div>
          
          {/* 모바일용 통계 */}
          <div className="sm:hidden mt-6 flex items-center justify-between bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 dark:border-gray-700/30">
            <div className="text-center">
              <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {activeSectors}
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                활성 섹터
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                실시간 업데이트
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}