'use client';

import { useRef } from 'react';
import { CryptoPrice } from '../../../lib/types';
import { UpbitStyleRanking } from '../../../components/organisms/UpbitStyleRanking';
import { ClientOnly } from '../../../hooks/useIsClient';

interface CryptoDataTableSectionProps {
  finalDisplayData: CryptoPrice[];
  sseError: string | null;
  onCryptoClick: (crypto: CryptoPrice) => void;
  onToggleFavorite: (symbol: string) => void;
  isFavorite: (symbol: string) => boolean;
  shouldUseVirtualScrolling: boolean;
  onRefresh?: () => void; // 새로고침 함수 추가
}

/**
 * 암호화폐 데이터 테이블 섹션 컴포넌트
 * 메인 거래 테이블과 로딩 상태를 담당
 */
export function CryptoDataTableSection({
  finalDisplayData,
  sseError,
  onCryptoClick,
  onToggleFavorite,
  isFavorite,
  shouldUseVirtualScrolling,
  onRefresh
}: CryptoDataTableSectionProps) {
  const isLoading = false; // SSE는 로딩 상태가 없음
  const tableRef = useRef<HTMLDivElement>(null);

  return (
    <ClientOnly fallback={
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30 shadow-xl h-80 sm:h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-2 sm:mb-4"></div>
          <div className="text-sm sm:text-lg font-medium text-gray-600 dark:text-gray-300">
            시세 데이터 로딩 중...
          </div>
        </div>
      </div>
    }>
      <div ref={tableRef} className="max-w-md sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto" data-crypto-ranking>
        <UpbitStyleRanking
          data={finalDisplayData || []}
          maxItems={50}
          onItemClick={onCryptoClick}
        />
      </div>
    </ClientOnly>
  );
}