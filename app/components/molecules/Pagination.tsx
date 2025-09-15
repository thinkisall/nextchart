'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  getPageRange: () => (number | string)[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isChangingPage?: boolean;
  stats: {
    startIndex: number;
    endIndex: number;
    total: number;
  };
}

export function Pagination({
  currentPage,
  totalPages,
  goToPage,
  nextPage,
  prevPage,
  getPageRange,
  hasNextPage,
  hasPrevPage,
  isChangingPage = false,
  stats
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageRange = getPageRange();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between py-6 px-4 sm:px-6 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl border-t border-gray-200/40 dark:border-gray-700/40">
      {/* 통계 정보 */}
      <div className="mb-4 sm:mb-0">
        <div className="flex items-center space-x-2 bg-blue-50/50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
          <span className="text-blue-600 dark:text-blue-400">📊</span>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="text-blue-600 dark:text-blue-400">{stats.startIndex}</span>
            <span className="mx-1 text-gray-400">-</span>
            <span className="text-blue-600 dark:text-blue-400">{stats.endIndex}</span>
            <span className="mx-2 text-gray-400">of</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{stats.total}</span>
            <span className="ml-1 text-gray-500">종목</span>
            {isChangingPage && <span className="ml-2 text-xs text-gray-500 animate-pulse">로딩중...</span>}
          </p>
        </div>
      </div>

      {/* 페이지네이션 버튼들 */}
      <div className="flex items-center space-x-2">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={prevPage}
          disabled={!hasPrevPage || isChangingPage}
          className="relative inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl touch-manipulation"
        >
          <span className="sr-only">Previous</span>
          {isChangingPage ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>

        {/* 페이지 번호들 */}
        <div className="flex items-center space-x-1">
          {pageRange.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  className="relative inline-flex items-center justify-center w-11 h-11 text-lg font-bold text-gray-400 dark:text-gray-500"
                >
                  ⋯
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                disabled={isChangingPage}
                className={`relative inline-flex items-center justify-center w-11 h-11 rounded-2xl text-sm font-bold transition-all shadow-lg hover:shadow-xl touch-manipulation ${
                  isCurrentPage
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-2 border-blue-400 scale-110'
                    : 'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-105'
                } ${isChangingPage ? 'disabled:opacity-60' : ''}`}
              >
                {isChangingPage && isCurrentPage ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  pageNumber
                )}
              </button>
            );
          })}
        </div>

        {/* 다음 페이지 버튼 */}
        <button
          onClick={nextPage}
          disabled={!hasNextPage || isChangingPage}
          className="relative inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl touch-manipulation"
        >
          <span className="sr-only">Next</span>
          {isChangingPage ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}