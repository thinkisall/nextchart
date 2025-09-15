import { CryptoMarket } from "./features/crypto";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ClientOnly } from "./hooks/useIsClient";
import { HeaderAd, FooterAd } from "./components/AdSenseV2";
import { BitcoinDominance } from "./components/molecules/BitcoinDominance";
import Link from "next/link";

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800">
        
        {/* 프로페셔널한 헤더 디자인 */}
        <div className="relative overflow-hidden">
          {/* 백그라운드 그라데이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-800 dark:via-blue-800 dark:to-indigo-800" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,113,255,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
          
          {/* 미세한 노이즈 텍스처 */}
          <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMjBMNDAgMEg0MFYyMEwyMCAyMFoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]" />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-16 sm:py-20 lg:py-24 text-center">
              
              {/* 메인 타이틀 - 모던하고 전문적 */}
              <div className="mb-8">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 text-sm font-medium tracking-wider uppercase">
                    실시간 업데이트
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    DAMOABOM
                  </span>
                </h1>
                
                <div className="mt-4 max-w-2xl mx-auto">
                  <p className="text-lg sm:text-xl text-blue-100/90 leading-relaxed">
                    전문 트레이더를 위한 실시간 암호화폐 
                    <span className="text-blue-200 font-semibold"> 섹터 분석</span> 및 
                    <span className="text-blue-200 font-semibold"> 시세 모니터링</span> 플랫폼
                  </p>
                </div>
              </div>

              {/* 통계 카드들 - 프로페셔널한 대시보드 느낌 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">200+</div>
                  <div className="text-blue-200 text-sm">추적 코인</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">실시간</div>
                  <div className="text-blue-200 text-sm">데이터 업데이트</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">3개</div>
                  <div className="text-blue-200 text-sm">주요 거래소</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">10+</div>
                  <div className="text-blue-200 text-sm">섹터 분류</div>
                </div>
              </div>

            </div>
          </div>

          {/* 하단 웨이브 효과 */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent" />
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-8">
          
          {/* Header Advertisement */}
          <HeaderAd />

          {/* 오늘의 코인 추천 룰렛 버튼 */}
          <div className="mb-8">
            <Link href="/coin-roulette">
              <div className="group relative bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 rounded-3xl p-6 shadow-2xl border border-white/20 transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                      🎰
                    </div>
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-1">오늘의 코인 추천 룰렛</h3>
                      <p className="text-purple-100 text-sm">바이낸스 & 알파 코인 중 랜덤 추천!</p>
                    </div>
                  </div>
                  <div className="text-white/80 group-hover:text-white transition-colors duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                {/* 반짝이는 효과 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 ease-in-out opacity-0 group-hover:opacity-100" />
              </div>
            </Link>
          </div>

          {/* Bitcoin Dominance - 세련된 글로벌 마켓 통계 */}
          <ClientOnly
            fallback={
              <div className="mb-8 h-40 bg-white/60 dark:bg-gray-800/60 rounded-3xl animate-pulse backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50" />
            }
          >
            <div className="mb-8">
              <BitcoinDominance />
            </div>
          </ClientOnly>

          {/* 메인 암호화폐 리스트 */}
          <ClientOnly
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="relative inline-flex items-center space-x-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl px-8 py-6 shadow-2xl border border-white/30 dark:border-gray-700/30">
                    {/* 로딩 스피너 */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
                      <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        시장 데이터 로딩 중
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        실시간 시세를 불러오고 있습니다...
                      </div>
                    </div>
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