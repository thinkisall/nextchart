interface SectorHeaderProps {
  activeSectors: number;
}

export function SectorHeader({ activeSectors }: SectorHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/30">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            <span>섹터 분석</span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            섹터별 시장 심리 분석
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {activeSectors}
          </div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            활성 섹터
          </div>
        </div>
      </div>
    </div>
  );
}
