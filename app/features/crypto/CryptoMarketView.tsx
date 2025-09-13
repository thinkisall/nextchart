import { CryptoPrice } from '../../lib/types';
import { SectorStats } from '../../components/organisms/SectorStats';
import { CryptoFilter } from '../../components/molecules/CryptoFilter';
import { SquareAd } from '../../components/AdSenseV2';
import { ClientOnly } from '../../hooks/useIsClient';
import { CryptoDataTableSection } from './components/CryptoDataTableSection';
import { CryptoFooter } from './components/CryptoFooter';

interface CryptoMarketViewProps {
  // 데이터
  primaryData: CryptoPrice[];
  finalDisplayData: CryptoPrice[];
  favorites: string[];
  
  // 상태 (에러는 테이블에서만 사용)
  sseError: string | null;
  shouldUseVirtualScrolling: boolean;
  
  // 이벤트 핸들러
  onFilteredDataChange: (filtered: CryptoPrice[]) => void;
  onCryptoClick: (crypto: CryptoPrice) => void;
  onToggleFavorite: (symbol: string) => void;
  isFavorite: (symbol: string) => boolean;
  onRefresh: () => void;
}

/**
 * CryptoMarket UI 렌더링 컴포넌트
 * 순수한 UI 렌더링만 담당하는 프레젠테이션 컴포넌트
 */
export function CryptoMarketView({
  primaryData,
  finalDisplayData,
  favorites,
  sseError,
  shouldUseVirtualScrolling,
  onFilteredDataChange,
  onCryptoClick,
  onToggleFavorite,
  isFavorite
}: CryptoMarketViewProps) {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Sector Analytics */}
      <ClientOnly fallback={
        <div className="h-32 sm:h-40 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>
      }>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
          <SectorStats cryptos={primaryData} />
        </div>
      </ClientOnly>

      {/* Square Ad */}
      <ClientOnly fallback={
        <div className="h-80 w-80 mx-auto bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>
      }>
        <div className="flex justify-center">
          <SquareAd />
        </div>
      </ClientOnly>

      {/* Advanced Filtering */}
      <ClientOnly fallback={
        <div className="h-16 sm:h-20 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>
      }>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
          <CryptoFilter
            cryptos={primaryData}
            onFilteredDataChange={onFilteredDataChange}
            favorites={favorites}
          />
        </div>
      </ClientOnly>

      {/* Main Trading Table */}
      <CryptoDataTableSection
        finalDisplayData={finalDisplayData}
        sseError={sseError}
        onCryptoClick={onCryptoClick}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
        shouldUseVirtualScrolling={shouldUseVirtualScrolling}
      />

      {/* Professional Footer */}
      <CryptoFooter
        finalDisplayDataLength={finalDisplayData.length}
        displayDataLength={primaryData.length}
      />
    </div>
  );
}