import { CryptoPrice } from '../../lib/types';
import { CryptoRowOptimized } from '../molecules/CryptoRowOptimized';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { Pagination } from '../molecules/Pagination';
import { VirtualizedCryptoListV2 } from './VirtualizedCryptoListV2';
import { ErrorDisplay } from '../molecules/ErrorDisplay';
import { usePagination } from '../../hooks/ui/usePagination';

interface CryptoTableOptimizedProps {
  cryptos: CryptoPrice[];
  loading: boolean;
  error?: string | null;
  onCryptoClick?: (crypto: CryptoPrice) => void;
  onToggleFavorite?: (symbol: string) => void;
  isFavorite?: (symbol: string) => boolean;
  useVirtualScrolling?: boolean;
  onRetry?: () => void; // 재시도 함수 추가
}

/**
 * 성능 최적화된 CryptoTable 컴포넌트
 * - Virtual Scrolling V2 적용
 * - 최적화된 컴포넌트 사용
 * - 메모리 사용량 최소화
 */
export function CryptoTableOptimized({ 
  cryptos, 
  loading, 
  error, 
  onCryptoClick, 
  onToggleFavorite, 
  isFavorite, 
  useVirtualScrolling = true, // 기본값을 true로 변경
  onRetry
}: CryptoTableOptimizedProps) {
  
  // 모바일에서는 항상 Virtual Scrolling 사용
  const shouldUseVirtualScrolling = useVirtualScrolling || (typeof window !== 'undefined' && window.innerWidth < 768);
  
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
    isChangingPage,
    stats
  } = usePagination({
    items: cryptos,
    itemsPerPage: shouldUseVirtualScrolling ? 100 : 20 // Virtual Scrolling 시 더 많이 로드
  });

  // 로딩 상태 - 최적화된 디자인
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <div className="mt-4 text-gray-600 dark:text-gray-400">
            실시간 가격 조회 중...
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        onRetry={onRetry}
        isRetrying={loading}
      />
    );
  }

  // 데이터 없음
  if (cryptos.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center text-gray-500 dark:text-gray-400">
          📊 시세 데이터 없음
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent" data-crypto-table>
      {/* 간소화된 헤더 */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 border-b border-blue-500/20">
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-yellow-400 flex items-center justify-center">
                <span className="text-lg font-bold text-white">📈</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">변동률 순위</h2>
                <p className="text-sm text-blue-100">24시간 변동률 기준</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-100 font-semibold">LIVE</span>
              </div>
              
              {!shouldUseVirtualScrolling && (
                <div className="text-sm text-blue-200">
                  {currentPage} / {totalPages}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 메인 테이블 컨테이너 */}
      <div className="bg-transparent">
        {/* 데스크톱 테이블 */}
        <div className="hidden lg:block">
          <div className="bg-white/40 dark:bg-gray-800/40">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/30 bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    순위 & 종목
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    현재가
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    24H 변동률
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    거래량
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    관심
                  </th>
                </tr>
              </thead>
              <tbody>
                {shouldUseVirtualScrolling ? (
                  <tr>
                    <td colSpan={5} className="p-0">
                      <VirtualizedCryptoListV2
                        cryptos={currentItems}
                        onCryptoClick={onCryptoClick}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={isFavorite}
                        variant="desktop"
                      />
                    </td>
                  </tr>
                ) : (
                  currentItems.map((crypto, index) => (
                    <CryptoRowOptimized
                      key={crypto.symbol}
                      crypto={crypto}
                      onClick={() => onCryptoClick?.(crypto)}
                      onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
                      isFavorite={isFavorite?.(crypto.symbol) || false}
                      variant="desktop"
                      index={index + (currentPage - 1) * 20}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 태블릿 테이블 */}
        <div className="hidden md:block lg:hidden">
          <div className="bg-white/40 dark:bg-gray-800/40">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/30 bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    순위 & 종목
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    현재가
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    24H 변동률
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    ⭐
                  </th>
                </tr>
              </thead>
              <tbody>
                {shouldUseVirtualScrolling ? (
                  <tr>
                    <td colSpan={4} className="p-0">
                      <VirtualizedCryptoListV2
                        cryptos={currentItems}
                        onCryptoClick={onCryptoClick}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={isFavorite}
                        variant="tablet"
                      />
                    </td>
                  </tr>
                ) : (
                  currentItems.map((crypto, index) => (
                    <CryptoRowOptimized
                      key={crypto.symbol}
                      crypto={crypto}
                      onClick={() => onCryptoClick?.(crypto)}
                      onToggleFavorite={() => onToggleFavorite?.(crypto.symbol)}
                      isFavorite={isFavorite?.(crypto.symbol) || false}
                      variant="tablet"
                      index={index + (currentPage - 1) * 20}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 모바일 카드 레이아웃 - Virtual Scrolling 기본 적용 */}
        <div className="md:hidden bg-transparent">
          <div className="p-3">
            <VirtualizedCryptoListV2
              cryptos={currentItems}
              onCryptoClick={onCryptoClick}
              onToggleFavorite={onToggleFavorite}
              isFavorite={isFavorite}
              variant="mobile"
            />
          </div>
        </div>
      </div>

      {/* 페이지네이션 - Virtual Scrolling 사용 시 숨김 */}
      {!shouldUseVirtualScrolling && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          nextPage={nextPage}
          prevPage={prevPage}
          getPageRange={getPageRange}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          isChangingPage={isChangingPage}
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