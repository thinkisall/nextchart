import { ClientOnly } from '../../../hooks/useIsClient';

interface CryptoFooterProps {
  finalDisplayDataLength: number;
  displayDataLength: number;
}

/**
 * 암호화폐 마켓 푸터 컴포넌트
 * 데이터 소스 정보와 통계를 표시
 */
export function CryptoFooter({ 
  finalDisplayDataLength, 
  displayDataLength 
}: CryptoFooterProps) {
  return (
    <ClientOnly fallback={
      <div className="h-14 sm:h-16 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse backdrop-blur"></div>
    }>
      <div className="bg-gradient-to-r from-white/40 to-white/60 dark:from-gray-800/40 dark:to-gray-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/30">
        <div className="p-4 sm:p-6 text-center">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>데이터 소스: 빗썸 거래소</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>업데이트: 실시간 스트림</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>표시 중: {finalDisplayDataLength} / {displayDataLength} 자산</span>
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              전문 암호화폐 시장 분석 플랫폼 • 24시간 변동률 기준 정렬
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}