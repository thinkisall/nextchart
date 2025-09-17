"use client";

import { CryptoMarket } from "./features/crypto";
import { ExchangePerformanceAnalysis } from "./features/exchange-performance";
import { NewListingsContainer } from "./features/new-listings";
import { FloatingFeatureButton } from "./features/feature-request";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ClientOnly } from "./hooks/useIsClient";
import { HeaderAd, FooterAd } from "./components/AdSenseV2";
import { BitcoinDominance } from "./components/molecules/BitcoinDominance";
import { useCryptoData } from "./features/crypto/hooks/useCryptoData";
import Link from "next/link";

export default function Home() {
  // 실시간 데이터 (SSE + WebSocket + REST API 통합)
  const { primaryData } = useCryptoData();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* 프로페셔널 헤더 & 네비게이션 */}
        <header className="relative bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 overflow-hidden">
          {/* 백그라운드 패턴 */}
          <div className="absolute inset-0 bg-[linear-gradient(30deg,transparent_12%,rgba(59,130,246,0.05)_12.5%,rgba(59,130,246,0.05)_87%,transparent_87.5%)] bg-[length:16px_16px]"></div>

          {/* 글로우 효과 */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative">
            {/* 상단 네비게이션 */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">D</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-bold text-xl">
                    DAMOABOM
                  </span>
                </div>

                <div className="hidden md:flex items-center space-x-6">
                  <a
                    href="#market"
                    className="text-gray-700 dark:text-blue-100 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
                  >
                    시장현황
                  </a>
                  <a
                    href="#exchange"
                    className="text-gray-700 dark:text-blue-100 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
                  >
                    거래소분석
                  </a>
                  <Link
                    href="/coin-roulette"
                    className="text-gray-700 dark:text-blue-100 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
                  >
                    코인룰렛
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-100/80 dark:bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-green-200 dark:border-green-400/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-800 dark:text-green-300 text-xs font-medium">
                    LIVE
                  </span>
                </div>
              </div>
            </nav>

            {/* 히어로 섹션 */}
            <div className="px-4 sm:px-6 py-8 sm:py-12 md:py-16">
              <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
                  {/* 왼쪽: 메인 콘텐츠 */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="inline-flex items-center space-x-2 bg-blue-100/80 dark:bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200 dark:border-blue-400/30">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                        <span className="text-gray-800 dark:text-blue-300 text-sm font-medium">
                          실시간 업데이트
                        </span>
                      </div>

                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        <span className="text-gray-900 dark:text-white">
                          실시간
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent">
                          코인섹터 분석
                        </span>
                      </h1>

                      <p className="text-gray-700 dark:text-blue-100/80 text-lg leading-relaxed max-w-lg">
                        실시간 데이터 기반의 섹터 분석, 거래소 성과 비교,
                        스마트한 투자 인사이트를 제공하는 프로페셔널 플랫폼
                      </p>
                    </div>

                    {/* CTA 버튼들 */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/coin-roulette">
                        <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                          <span className="relative z-10 flex items-center space-x-2">
                            <span>🎰</span>
                            <span>코인 룰렛 체험</span>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                      </Link>

                      <button
                        onClick={() =>
                          document
                            .getElementById("market")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="bg-gray-100/80 dark:bg-white/10 backdrop-blur-sm hover:bg-gray-200/80 dark:hover:bg-white/20 text-gray-800 dark:text-white px-8 py-4 rounded-2xl font-semibold border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30 transition-all duration-300"
                      >
                        시장 분석 보기
                      </button>
                    </div>
                  </div>

                  {/* 오른쪽: 실시간 통계 대시보드 */}
                  <div className="space-y-6">
                    <div className="bg-gray-50/80 dark:bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-gray-200 dark:border-white/20">
                      <h3 className="text-gray-800 dark:text-white font-semibold text-lg mb-4">
                        실시간 마켓 데이터
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-100/50 dark:bg-white/10 rounded-2xl p-4 text-center">
                          <div className="text-2xl font-bold text-gray-800 dark:text-white">
                            200+
                          </div>
                          <div className="text-gray-600 dark:text-blue-200 text-sm">
                            추적 코인
                          </div>
                        </div>
                        <div className="bg-gray-100/50 dark:bg-white/10 rounded-2xl p-4 text-center">
                          <div className="text-2xl font-bold text-gray-800 dark:text-white">
                            3
                          </div>
                          <div className="text-gray-600 dark:text-blue-200 text-sm">
                            주요 거래소
                          </div>
                        </div>
                        <div className="bg-gray-100/50 dark:bg-white/10 rounded-2xl p-4 text-center">
                          <div className="text-2xl font-bold text-gray-800 dark:text-white">
                            10+
                          </div>
                          <div className="text-gray-600 dark:text-blue-200 text-sm">
                            섹터 분류
                          </div>
                        </div>
                        <div className="bg-gray-100/50 dark:bg-white/10 rounded-2xl p-4 text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            실시간
                          </div>
                          <div className="text-gray-600 dark:text-blue-200 text-sm">
                            업데이트
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="relative">
          {/* Header Advertisement */}
          <div className="px-3 sm:px-6 py-2 sm:py-4">
            <HeaderAd />
          </div>

          {/* Bitcoin Dominance - 글로벌 마켓 개요 */}
          <section className="px-3 sm:px-6 py-4 sm:py-6 md:py-8" id="market">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  글로벌 마켓 현황
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  비트코인 도미넌스와 주요 지표를 한눈에 확인하세요
                </p>
              </div>

              <ClientOnly
                fallback={
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 animate-pulse">
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  </div>
                }
              >
                <BitcoinDominance />
              </ClientOnly>
            </div>
          </section>

          {/* 신규상장 알림 섹션 */}
          <section className="px-3 sm:px-6 py-4 sm:py-6 md:py-8">
            <div className="max-w-md sm:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto">
              <ClientOnly
                fallback={
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-pulse">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 h-24 rounded-t-3xl"></div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                }
              >
                <NewListingsContainer maxItems={6} />
              </ClientOnly>
            </div>
          </section>

          {/* 거래소별 성과 분석 */}
          <section
            className="px-6 py-8 bg-gray-50 dark:bg-gray-900/50"
            id="exchange"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  거래소별 성과 분석
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  빗썸, 바이낸스, 업비트의 실시간 성과를 비교 분석합니다
                </p>
              </div>

              <ClientOnly
                fallback={
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 animate-pulse">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="h-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                }
              >
                <ExchangePerformanceAnalysis coins={primaryData} />
              </ClientOnly>
            </div>
          </section>

          {/* 메인 암호화폐 테이블 */}
          <section className="px-3 sm:px-6 py-4 sm:py-6 md:py-8">
            <div className="max-w-md sm:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto">
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  실시간 암호화폐 시세
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  전체 코인의 실시간 가격, 변동률, 거래량을 확인하세요
                </p>
              </div>

              <ClientOnly
                fallback={
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="bg-white dark:bg-gray-800 rounded-3xl px-8 py-12 shadow-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          시장 데이터 로딩 중
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          실시간 시세를 불러오고 있습니다...
                        </p>
                      </div>
                    </div>
                  </div>
                }
              >
                <CryptoMarket />
              </ClientOnly>
            </div>
          </section>

          {/* Footer Advertisement */}
          <div className="px-3 sm:px-6 py-2 sm:py-4">
            <FooterAd />
          </div>
        </main>

        {/* 플로팅 기능 요청 버튼 */}
        <FloatingFeatureButton />
      </div>
    </ErrorBoundary>
  );
}
