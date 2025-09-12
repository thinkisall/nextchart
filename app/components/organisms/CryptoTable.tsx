import { CryptoPrice } from '../../lib/types';
import { CryptoRow } from '../molecules/CryptoRow';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { Pagination } from '../molecules/Pagination';
import { usePagination } from '../../hooks/ui/usePagination';

interface CryptoTableProps {
  cryptos: CryptoPrice[];
  loading: boolean;
  error?: string | null;
  onCryptoClick?: (crypto: CryptoPrice) => void;
  onToggleFavorite?: (symbol: string) => void;
  isFavorite?: (symbol: string) => boolean;
}

export function CryptoTable({ cryptos, loading, error, onCryptoClick, onToggleFavorite, isFavorite }: CryptoTableProps) {
  const {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    getPageRange,
    hasNextPage,
    hasPrevPage,
    stats
  } = usePagination({
    items: cryptos,
    itemsPerPage: 20
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 sm:py-20">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl px-4 sm:px-8 py-3 sm:py-6 shadow-xl border border-white/20 dark:border-gray-700/30">
            <LoadingSpinner size="md" />
            <div>
              <div className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100">시세 데이터 로딩</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">실시간 가격 조회 중...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12 sm:py-20">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 backdrop-blur-xl rounded-xl sm:rounded-2xl px-4 sm:px-8 py-3 sm:py-6 border border-red-200 dark:border-red-800/30 shadow-xl">
            <div className="text-red-600 dark:text-red-400 text-sm sm:text-lg font-semibold mb-1 sm:mb-2 flex items-center justify-center space-x-2">
              <span>⚠️</span>
              <span>시세 데이터 오류</span>
            </div>
            <div className="text-xs sm:text-sm text-red-600/80 dark:text-red-400/80">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (cryptos.length === 0) {
    return (
      <div className="flex justify-center items-center py-12 sm:py-20">
        <div className="text-center">
          <div className="bg-gray-50 dark:bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl px-4 sm:px-8 py-3 sm:py-6 border border-gray-200 dark:border-gray-700/30 shadow-xl">
            <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-lg font-semibold mb-1 sm:mb-2 flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>시세 데이터 없음</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">잠시 후 다시 시도해주세요</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      {/* 모바일 최적화된 헤더 */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-600/30">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-slate-100">실시간 시세</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">실시간 암호화폐 가격</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600 dark:text-slate-400">실시간</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">
                페이지 {currentPage} / {totalPages}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 메인 테이블 컨테이너 */}
      <div className="bg-transparent">
        {/* 데스크톱 테이블 - 태블릿 이상에서만 표시 */}
        <div className="hidden lg:block">
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl">
            <table className="w-full">
              <thead className="sticky-header">
                <tr className="border-b border-slate-200/30 dark:border-slate-700/30">
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">종목</span>
                    </div>
                  </th>
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-right">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">가격</span>
                  </th>
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">24시간 변동</span>
                      <span className="text-xs text-slate-400">↓</span>
                    </div>
                  </th>
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-right">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">거래량</span>
                  </th>
                  <th className="px-4 xl:px-6 py-3 xl:py-4 text-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">관심</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/20 dark:divide-slate-700/20">
                {currentItems.map((crypto, index) => (
                  <CryptoRow
                    key={`desktop-${crypto.symbol}`}
                    crypto={crypto}
                    onClick={() => onCryptoClick?.(crypto)}
                    onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
                    isFavorite={isFavorite?.(crypto.symbol) || false}
                    variant="desktop"
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 태블릿 테이블 - 중간 크기 화면용 */}
        <div className="hidden md:block lg:hidden">
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl">
            <table className="w-full">
              <thead className="sticky-header">
                <tr className="border-b border-slate-200/30 dark:border-slate-700/30">
                  <th className="px-3 py-3 text-left">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">종목</span>
                  </th>
                  <th className="px-3 py-3 text-right">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">가격</span>
                  </th>
                  <th className="px-3 py-3 text-right">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">변동률</span>
                  </th>
                  <th className="px-3 py-3 text-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">♡</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/20 dark:divide-slate-700/20">
                {currentItems.map((crypto, index) => (
                  <CryptoRow
                    key={`tablet-${crypto.symbol}`}
                    crypto={crypto}
                    onClick={() => onCryptoClick?.(crypto)}
                    onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
                    isFavorite={isFavorite?.(crypto.symbol) || false}
                    variant="tablet"
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 모바일 카드 레이아웃 */}
        <div className="md:hidden bg-transparent p-2 sm:p-3 space-y-2">
          {currentItems.map((crypto, index) => (
            <CryptoRow
              key={`mobile-${crypto.symbol}`}
              crypto={crypto}
              onClick={() => onCryptoClick?.(crypto)}
              onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
              isFavorite={isFavorite?.(crypto.symbol) || false}
              variant="mobile"
              index={index}
            />
          ))}
        </div>
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
        nextPage={nextPage}
        prevPage={prevPage}
        getPageRange={getPageRange}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        stats={{
          startIndex: stats.startIndex,
          endIndex: stats.endIndex,
          total: stats.total
        }}
      />
    </div>
  );
}