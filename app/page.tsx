import { CryptoMarket } from "./features/crypto/CryptoMarket";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ClientOnly } from "./hooks/useIsClient";
import { HeaderAd, FooterAd } from "./components/AdSenseV2";
import { BitcoinDominance } from "./components/molecules/BitcoinDominance";

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* 모바일 최적화된 헤더 */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-800 dark:via-blue-800 dark:to-slate-800">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent opacity-40"></div>
          <div className="relative container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="text-center">
              {/* 모바일에서 더 작은 제목 */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                  실시간 암호화폐 섹터
                </span>
              </h1>
              <p className="text-sm sm:text-lg lg:text-xl text-blue-100 mb-1 sm:mb-2">
                섹터별 분석 및 시세 제공
              </p>
            </div>
          </div>
        </div>

        {/* 모바일 최적화된 메인 콘텐츠 영역 */}
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 -mt-2 sm:-mt-4 relative z-10">
          {/* Header Advertisement */}
          <HeaderAd />

          {/* Bitcoin Dominance - Global Market Stats */}
          <ClientOnly
            fallback={
              <div className="mb-6 h-32 bg-white/60 dark:bg-gray-800/60 rounded-xl animate-pulse"></div>
            }
          >
            <div className="mb-6">
              <BitcoinDominance />
            </div>
          </ClientOnly>

          <ClientOnly
            fallback={
              <div className="flex items-center justify-center py-12 sm:py-20">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg border border-white/20 dark:border-gray-700/30">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-200">
                      시세 데이터 로딩 중...
                    </span>
                  </div>
                </div>
              </div>
            }
          >
            <CryptoMarket />
          </ClientOnly>

          {/* Footer Advertisement */}
          <FooterAd />
        </div>
      </div>
    </ErrorBoundary>
  );
}
