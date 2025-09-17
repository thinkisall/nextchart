'use client';

import { CryptoPrice } from '../../lib/types';
import { SectorAnalysisContainer } from '../sector-analysis';
import { SectorNavigationUtils } from '../sector-analysis/utils/SectorNavigationUtils';
import { SimplifiedFilter } from '../../components/molecules/SimplifiedFilter';
import { SquareAd } from '../../components/AdSenseV2';
import { ClientOnly } from '../../hooks/useIsClient';
import { CryptoDataTableSection } from './components/CryptoDataTableSection';
import { CryptoFooter } from './components/CryptoFooter';
import { SelectedCoinInfo } from './components/SelectedCoinInfo';
import { useRouter } from 'next/navigation';

interface CryptoMarketViewProps {
  // 데이터
  primaryData: CryptoPrice[];
  finalDisplayData: CryptoPrice[];
  favorites: string[];
  
  // 상태
  sseError: string | null;
  shouldUseVirtualScrolling: boolean;
  selectedCoin: CryptoPrice | null;
  
  // 이벤트 핸들러
  onFilteredDataChange: (filtered: CryptoPrice[]) => void;
  onCryptoClick: (crypto: CryptoPrice) => void;
  onToggleFavorite: (symbol: string) => void;
  isFavorite: (symbol: string) => boolean;
  onRefresh: () => void;
  onCloseCoinInfo: () => void;
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
  selectedCoin,
  onFilteredDataChange,
  onCryptoClick,
  onToggleFavorite,
  isFavorite,
  onRefresh,
  onCloseCoinInfo
}: CryptoMarketViewProps) {
  const router = useRouter();
  
  // 섹터 클릭 핸들러 - 상세 페이지로 라우팅
  const handleSectorClick = (analysis: any) => {
    const sectorUrl = SectorNavigationUtils.getSectorPageUrl(analysis);
    router.push(sectorUrl);
  };

  return (
    <div className="w-full max-w-md sm:max-w-2xl lg:max-w-4xl xl:max-w-7xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Sector Analytics */}
      <ClientOnly fallback={
        <div className="h-32 sm:h-40 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>
      }>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl">
          <SectorAnalysisContainer 
            cryptos={primaryData}
            onSectorClick={handleSectorClick}
          />
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
        <div className="h-32 bg-white/60 dark:bg-gray-800/60 rounded-2xl animate-pulse backdrop-blur"></div>
      }>
        <SimplifiedFilter
          cryptos={primaryData}
          onFilteredDataChange={onFilteredDataChange}
          favorites={favorites}
        />
      </ClientOnly>

      {/* Main Trading Table */}
      <CryptoDataTableSection
        finalDisplayData={finalDisplayData}
        sseError={sseError}
        onCryptoClick={onCryptoClick}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
        shouldUseVirtualScrolling={shouldUseVirtualScrolling}
        onRefresh={onRefresh}
      />

      {/* Professional Footer */}
      <CryptoFooter
        finalDisplayDataLength={finalDisplayData.length}
        displayDataLength={primaryData.length}
      />

      {/* Selected Coin Info Panel */}
      <SelectedCoinInfo 
        selectedCoin={selectedCoin} 
        onClose={onCloseCoinInfo} 
      />

    </div>
  );
}