"use client";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { ClientOnly } from "./hooks/useIsClient";
import { useCryptoData } from "./features/crypto/hooks/useCryptoData";
import { UpbitStyleRanking } from "./components/organisms/UpbitStyleRanking";
import { ExchangeFilterButtons } from "./components/organisms/ExchangeFilterButtons";
import { BtcDominance } from "./components/organisms/BtcDominance";
import { GlobalTopGainers } from "./components/organisms/GlobalTopGainers";
import { AltcoinSeasonIndex } from "./components/organisms/AltcoinSeasonIndex";
import { GlobalNavigation } from "./components/organisms/GlobalNavigation";
import { WonyottiPositionButton } from "./components/organisms/WonyottiPositionButton";
import { HeaderAd, LargeDesktopAd, MobileAd } from "./components/AdSenseV2";
import { useExchangeFilter } from "./hooks/useExchangeFilter";
import { FloatingFeatureButton } from "./features/feature-request";
import { SectorAnalysisButton } from "./components/atoms/SectorAnalysisButton";
import { MobileSectorAnalysisButton } from "./components/atoms/MobileSectorAnalysisButton";

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

// Mobile optimized imports
import { 
  MobileCard, 
  MobileCardContent, 
  MobileCardHeader, 
  MobileCardTitle,
  MobileCardDescription 
} from "../components/mobile";

export default function Home() {
  // 실시간 데이터 (SSE + WebSocket + REST API 통합)
  const { primaryData } = useCryptoData();
  
  // 거래소별 필터링
  const { 
    selectedExchange, 
    setSelectedExchange, 
    filteredData, 
    exchangeCounts 
  } = useExchangeFilter(primaryData || []);
  return (
    <ErrorBoundary>
      {/* 글로벌 네비게이션 */}
      <GlobalNavigation />
      
      <div className="min-h-screen bg-background pt-16">
        {/* 모바일 최적화된 헤더 & 네비게이션 */}
        <header className="relative bg-gradient-to-br from-background via-muted/50 to-primary/10 overflow-hidden">
          {/* 백그라운드 패턴 */}
          <div className="absolute inset-0 bg-[linear-gradient(30deg,transparent_12%,rgba(59,130,246,0.05)_12.5%,rgba(59,130,246,0.05)_87%,transparent_87.5%)] bg-[length:16px_16px]"></div>

          {/* 글로우 효과 - 모바일에서 축소 */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative">
            {/* 모바일 최적화된 상단 네비게이션 */}
            <nav className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/50">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">D</span>
                </div>
                <span className="text-foreground font-bold text-lg">
                  <span className="hidden sm:inline">DAMOABOM</span>
                  <span className="sm:hidden">다모아봄</span>
                </span>
              </div>

              <Badge variant="secondary" className="bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                LIVE
              </Badge>
            </nav>

            {/* 모바일 최적화된 히어로 섹션 */}
            <div className="px-4 sm:px-6 py-6 sm:py-8 landscape:py-4">
              <div className="max-w-7xl mx-auto text-center">
                <div className="space-y-3 sm:space-y-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse mr-1"></span>
                    실시간 업데이트
                  </Badge>

                  <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight landscape:text-xl">
                    <span className="text-foreground">
                      실시간
                    </span>
                    <br className="sm:hidden" />
                    <span className="bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent ml-2 sm:ml-0">
                      변동률 순위
                    </span>
                  </h1>

                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm sm:max-w-lg mx-auto landscape:text-sm">
                    24시간 변동률 기준으로 코인들의 실시간 순위를 확인하세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 모바일 최적화된 메인 콘텐츠 */}
        <main className="relative">
          <section className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="max-w-sm sm:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto space-y-4 sm:space-y-6">
              
              {/* 비트코인 도미넌스 & 알트코인 시즌 지수 - 모바일 스택 배치 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ClientOnly
                  fallback={
                    <MobileCard className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200/50 dark:border-orange-700/30">
                      <MobileCardContent>
                        <div className="flex items-center justify-between p-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center animate-pulse">
                              <span className="text-white font-bold text-lg">₿</span>
                            </div>
                            <div className="space-y-2">
                              <div className="w-24 h-4 bg-muted rounded animate-pulse"></div>
                              <div className="w-16 h-3 bg-muted rounded animate-pulse"></div>
                            </div>
                          </div>
                          <div className="w-16 h-8 bg-muted rounded animate-pulse"></div>
                        </div>
                      </MobileCardContent>
                    </MobileCard>
                  }
                >
                  <BtcDominance />
                </ClientOnly>

                <ClientOnly
                  fallback={
                    <MobileCard className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700/50">
                      <MobileCardContent className="flex items-center justify-center py-4">
                        <div className="text-center">
                          <div className="text-green-400 text-lg mb-2">📊</div>
                          <p className="text-green-600 dark:text-green-400 text-sm">
                            알트코인 시즌 지수 로딩 중...
                          </p>
                        </div>
                      </MobileCardContent>
                    </MobileCard>
                  }
                >
                  <AltcoinSeasonIndex />
                </ClientOnly>
              </div>

              {/* 헤더 광고 - 모바일에서 숨김 */}
              <div className="hidden md:block">
                <HeaderAd />
              </div>

              {/* 해외 급등주 TOP 10 */}
              <ClientOnly
                fallback={
                  <MobileCard>
                    <MobileCardContent className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="text-muted-foreground text-lg mb-2">🚀</div>
                        <p className="text-muted-foreground">
                          해외 급등주 로딩 중...
                        </p>
                      </div>
                    </MobileCardContent>
                  </MobileCard>
                }
              >
                <GlobalTopGainers />
              </ClientOnly>

              {/* 섹터별 성과 분석 버튼 - 반응형 */}
              <div className="hidden sm:block">
                <SectorAnalysisButton />
              </div>
              <div className="block sm:hidden">
                <MobileSectorAnalysisButton />
              </div>

              {/* 워뇨띠 포지션 버튼 */}
              <WonyottiPositionButton />

              {/* 거래소별 필터 버튼 */}
              <ClientOnly
                fallback={
                  <MobileCard>
                    <MobileCardContent className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="text-muted-foreground text-lg mb-2">⚙️</div>
                        <p className="text-muted-foreground">
                          필터 로딩 중...
                        </p>
                      </div>
                    </MobileCardContent>
                  </MobileCard>
                }
              >
                <ExchangeFilterButtons
                  selectedExchange={selectedExchange}
                  onExchangeChange={setSelectedExchange}
                  counts={exchangeCounts}
                />
              </ClientOnly>

              {/* 모바일 광고 */}
              <div className="block md:hidden">
                <MobileAd />
              </div>

              {/* 대형 데스크톱 광고 */}
              <div className="hidden lg:block">
                <LargeDesktopAd />
              </div>

              {/* 변동률 순위 */}
              <ClientOnly
                fallback={
                  <div className="flex items-center justify-center py-20">
                    <MobileCard className="bg-background shadow-2xl border">
                      <MobileCardContent className="px-8 py-12 text-center">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full border-4 border-muted"></div>
                            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                          </div>
                        </div>
                        <MobileCardTitle className="text-xl mb-2">
                          시장 데이터 로딩 중
                        </MobileCardTitle>
                        <MobileCardDescription>
                          실시간 시세를 불러오고 있습니다...
                        </MobileCardDescription>
                      </MobileCardContent>
                    </MobileCard>
                  </div>
                }
              >
                <UpbitStyleRanking 
                  data={filteredData.length > 0 ? filteredData : primaryData || []} 
                  maxItems={50} 
                />
              </ClientOnly>

              {/* 푸터 영역 */}
              <div className="mt-8 pb-4">
                <div className="text-center text-xs text-muted-foreground">
                  <p>© 2024 다모아봄. 모든 권리 보유.</p>
                  <p className="mt-1">실시간 암호화폐 데이터 제공</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      {/* 플로팅 기능 요청 버튼 */}
      <FloatingFeatureButton />
    </ErrorBoundary>
  );
}
