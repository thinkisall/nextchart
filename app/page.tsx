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
import { HeaderAd, InArticleAd, NativeAd, LargeDesktopAd, MobileAd } from "./components/AdSenseV2";
import { useExchangeFilter } from "./hooks/useExchangeFilter";
import { FloatingFeatureButton } from "./features/feature-request";

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

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
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative">
            {/* 모바일 최적화된 상단 네비게이션 */}
            <nav className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-border/50">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs sm:text-sm">D</span>
                </div>
                <span className="text-foreground font-bold text-lg sm:text-xl">
                  <span className="hidden xs:inline">DAMOABOM</span>
                  <span className="xs:hidden">다모아봄</span>
                </span>
              </div>

              <Badge variant="secondary" className="bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                LIVE
              </Badge>
            </nav>

            {/* 모바일 최적화된 히어로 섹션 */}
            <div className="px-3 sm:px-6 py-6 sm:py-8 md:py-12">
              <div className="max-w-7xl mx-auto text-center">
                <div className="space-y-3 sm:space-y-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse mr-1"></span>
                    실시간 업데이트
                  </Badge>

                  <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="text-foreground">
                      실시간
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                      변동률 순위
                    </span>
                  </h1>

                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-sm sm:max-w-lg mx-auto">
                    24시간 변동률 기준으로 코인들의 실시간 순위를 확인하세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 모바일 최적화된 메인 콘텐츠 */}
        <main className="relative">
          <section className="px-3 sm:px-6 py-4 sm:py-6 md:py-8">
            <div className="max-w-sm sm:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto space-y-4 sm:space-y-6">
              {/* 비트코인 도미넌스 */}
              <ClientOnly
                fallback={
                  <Card className="w-full bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200/50 dark:border-orange-700/30 mb-6">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
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
                    </CardContent>
                  </Card>
                }
              >
                <BtcDominance />
              </ClientOnly>

              {/* 헤더 광고 */}
              <HeaderAd />

              {/* 해외 급등주 TOP 10 */}
              <ClientOnly
                  fallback={
                    <Card className="w-full shadow-xl">
                      <CardContent className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <div className="text-muted-foreground text-lg mb-2">🚀</div>
                          <p className="text-muted-foreground">
                            해외 급등주 로딩 중...
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  }
                >
                  <GlobalTopGainers />
                </ClientOnly>

              {/* 인아티클 광고 1 */}
              <InArticleAd />

              {/* 알트코인 시즌 지수 */}
              <ClientOnly
                  fallback={
                    <Card className="w-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg border-green-200 dark:border-green-700/50">
                      <CardContent className="flex items-center justify-center py-4">
                        <div className="text-center">
                          <div className="text-green-400 text-lg mb-2">📊</div>
                          <p className="text-green-600 dark:text-green-400 text-sm">
                            알트코인 시즌 지수 로딩 중...
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  }
                >
                  <AltcoinSeasonIndex />
                </ClientOnly>

              {/* 네이티브 광고 */}
              <NativeAd />

              {/* 거래소별 필터 버튼 */}
              <ClientOnly
                  fallback={
                    <Card className="w-full shadow-xl">
                      <CardContent className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <div className="text-muted-foreground text-lg mb-2">⚙️</div>
                          <p className="text-muted-foreground">
                            필터 로딩 중...
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  }
                >
                  <ExchangeFilterButtons
                    selectedExchange={selectedExchange}
                    onExchangeChange={setSelectedExchange}
                    counts={exchangeCounts}
                  />
                </ClientOnly>

              {/* 대형 데스크톱 광고 + 모바일 광고 */}
              <LargeDesktopAd />
              <MobileAd />

              {/* 변동률 순위 */}
              <ClientOnly
                fallback={
                  <div className="flex items-center justify-center py-20">
                    <Card className="bg-background shadow-2xl border">
                      <CardContent className="px-8 py-12 text-center">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full border-4 border-muted"></div>
                            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-2">
                          시장 데이터 로딩 중
                        </CardTitle>
                        <CardDescription>
                          실시간 시세를 불러오고 있습니다...
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                }
              >
                <UpbitStyleRanking 
                  data={filteredData.length > 0 ? filteredData : primaryData || []} 
                  maxItems={50} 
                />
              </ClientOnly>

              {/* 푸터 영역 인아티클 광고 */}
              <div className="mt-8">
                <InArticleAd />
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