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
  stats
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageRange = getPageRange();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:py-6 px-3 sm:px-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-t border-gray-200/30 dark:border-gray-700/30">
      {/* 통계 정보 */}
      <div className="mb-3 sm:mb-0">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">{stats.startIndex}</span>
          {' '}-{' '}
          <span className="font-medium">{stats.endIndex}</span>
          {' '}of{' '}
          <span className="font-medium">{stats.total}</span>
          {' '}종목
        </p>
      </div>

      {/* 페이지네이션 버튼들 */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={prevPage}
          disabled={!hasPrevPage}
          className="relative inline-flex items-center px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Previous</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 페이지 번호들 */}
        <div className="flex items-center space-x-1">
          {pageRange.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  className="relative inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`relative inline-flex items-center px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isCurrentPage
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* 다음 페이지 버튼 */}
        <button
          onClick={nextPage}
          disabled={!hasNextPage}
          className="relative inline-flex items-center px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Next</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}