import { CryptoPrice } from '../../lib/types';
import { CryptoRow } from '../molecules/CryptoRow';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { Pagination } from '../molecules/Pagination';
import { VirtualizedCryptoList } from './VirtualizedCryptoList';
import { usePagination } from '../../hooks/ui/usePagination';

interface CryptoTableProps {
  cryptos: CryptoPrice[];
  loading: boolean;
  error?: string | null;
  onCryptoClick?: (crypto: CryptoPrice) => void;
  onToggleFavorite?: (symbol: string) => void;
  isFavorite?: (symbol: string) => boolean;
  useVirtualScrolling?: boolean; // Virtual Scrolling 옵션 추가
}

export function CryptoTable({ 
  cryptos, 
  loading, 
  error, 
  onCryptoClick, 
  onToggleFavorite, 
  isFavorite, 
  useVirtualScrolling = false 
}: CryptoTableProps) {
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
    itemsPerPage: useVirtualScrolling ? 50 : 20 // Virtual Scrolling 시 50개씩 표시
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 sm:py-24">
        <div className="text-center">
          <div className="inline-flex flex-col items-center space-y-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl px-8 sm:px-12 py-8 sm:py-12 shadow-2xl border border-white/30 dark:border-gray-700/30">
            <div className="relative">
              <LoadingSpinner size="lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">시세 데이터 로딩</div>
              <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">실시간 가격 조회 중...</div>
              <div className="flex items-center justify-center space-x-1 mt-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-16 sm:py-24">
        <div className="text-center">
          <div className="inline-flex flex-col items-center space-y-6 bg-red-50/90 dark:bg-red-900/20 backdrop-blur-xl rounded-3xl px-8 sm:px-12 py-8 sm:py-12 border-2 border-red-200/50 dark:border-red-800/30 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl text-white">⚠️</span>
            </div>
            <div className="text-center space-y-3">
              <div className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center justify-center space-x-2">
                <span>시세 데이터 오류</span>
              </div>
              <div className="text-sm sm:text-base text-red-600/80 dark:text-red-400/80 font-medium bg-red-100/50 dark:bg-red-900/30 px-4 py-2 rounded-xl">
                {error}
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cryptos.length === 0) {
    return (
      <div className="flex justify-center items-center py-16 sm:py-24">
        <div className="text-center">
          <div className="inline-flex flex-col items-center space-y-6 bg-gray-50/90 dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl px-8 sm:px-12 py-8 sm:py-12 border-2 border-gray-200/50 dark:border-gray-700/30 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl text-white">📊</span>
            </div>
            <div className="text-center space-y-3">
              <div className="text-xl font-bold text-gray-600 dark:text-gray-300 flex items-center justify-center space-x-2">
                <span>시세 데이터 없음</span>
              </div>
              <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">잠시 후 다시 시도해주세요</div>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                새로고침
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      {/* 모바일 최적화된 헤더 */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 border-b border-blue-500/20">
        <div className="px-4 sm:px-6 py-5 sm:py-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">🏆</span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">실시간 순위</h2>
                  <p className="text-sm sm:text-base text-blue-100 font-medium">24시간 변동률 기준</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end space-x-6">
              <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-2 rounded-xl border border-green-400/30">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-sm text-green-100 font-bold tracking-wide">LIVE</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                <span className="text-sm text-blue-200 font-bold">페이지</span>
                <span className="text-base font-bold text-white">{currentPage}</span>
                <span className="text-sm text-blue-300">/</span>
                <span className="text-base font-bold text-blue-100">{totalPages}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 테이블 컨테이너 */}
      <div className="bg-transparent">
        {/* 데스크톱 테이블 - 태블릿 이상에서만 표시 */}
        <div className="hidden lg:block">
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl">
            <table className="w-full">
              <thead className="sticky-header">
                <tr className="border-b border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">🏆 순위 & 종목</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">💰 현재가</span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">📈 24시간 변동</span>
                      <span className="text-xs text-blue-500">↓</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">📊 거래량</span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">⭐ 관심</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/20 dark:divide-gray-700/20">
                {currentItems.map((crypto, index) => (
                  <CryptoRow
                    key={`desktop-${crypto.symbol}`}
                    crypto={crypto}
                    onClick={() => onCryptoClick?.(crypto)}
                    onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
                    isFavorite={isFavorite?.(crypto.symbol) || false}
                    variant="desktop"
                    index={index + (currentPage - 1) * 20}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 태블릿 테이블 - 중간 크기 화면용 */}
        <div className="hidden md:block lg:hidden">
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl">
            <table className="w-full">
              <thead className="sticky-header">
                <tr className="border-b border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                  <th className="px-4 py-4 text-left">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">🏆 순위 & 종목</span>
                  </th>
                  <th className="px-4 py-4 text-right">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">💰 현재가</span>
                  </th>
                  <th className="px-4 py-4 text-right">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">📈 변동률</span>
                  </th>
                  <th className="px-4 py-4 text-center">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">⭐</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/20 dark:divide-gray-700/20">
                {currentItems.map((crypto, index) => (
                  <CryptoRow
                    key={`tablet-${crypto.symbol}`}
                    crypto={crypto}
                    onClick={() => onCryptoClick?.(crypto)}
                    onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
                    isFavorite={isFavorite?.(crypto.symbol) || false}
                    variant="tablet"
                    index={index + (currentPage - 1) * 20}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 모바일 카드 레이아웃 */}
        <div className="md:hidden bg-transparent">
          {useVirtualScrolling ? (
            // Virtual Scrolling 사용
            <div className="p-4">
              <VirtualizedCryptoList
                cryptos={currentItems}
                onCryptoClick={onCryptoClick}
                onToggleFavorite={onToggleFavorite}
                isFavorite={isFavorite}
                variant="mobile"
              />
            </div>
          ) : (
            // 일반 렌더링
            <div className="p-4 space-y-3">
              {currentItems.map((crypto, index) => (
                <CryptoRow
                  key={`mobile-${crypto.symbol}`}
                  crypto={crypto}
                  onClick={() => onCryptoClick?.(crypto)}
                  onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
                  isFavorite={isFavorite?.(crypto.symbol) || false}
                  variant="mobile"
                  index={index + (currentPage - 1) * 20}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 페이지네이션 - Virtual Scrolling 사용 시 숨김 */}
      {!useVirtualScrolling && (
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
      )}
    </div>
  );
}