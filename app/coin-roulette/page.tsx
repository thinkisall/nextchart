'use client';

import { ErrorBoundary } from "../components/ErrorBoundary";
import { CoinRoulette } from "../features/coin-roulette";
import Link from "next/link";

export default function CoinRoulettePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900">
        
        {/* 헤더 */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12 sm:py-16 text-center">
              
              {/* 뒤로가기 버튼 */}
              <div className="mb-8 text-left">
                <Link 
                  href="/"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm 
                    rounded-xl text-white hover:bg-white/20 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>홈으로 돌아가기</span>
                </Link>
              </div>

              {/* 페이지 타이틀 */}
              <div className="mb-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                    🎰 코인 룰렛
                  </span>
                </h1>
                
                <div className="mt-4 max-w-2xl mx-auto">
                  <p className="text-lg sm:text-xl text-purple-100 leading-relaxed">
                    바이낸스 & 알파 코인 중에서 
                    <span className="text-yellow-200 font-semibold"> 랜덤으로 </span> 
                    코인을 뽑아보세요!
                  </p>
                </div>
              </div>

              {/* 특징 카드들 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-white font-semibold">바이낸스 코인</div>
                  <div className="text-purple-200 text-sm">메인 거래소 코인</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-white font-semibold">알파 코인</div>
                  <div className="text-purple-200 text-sm">신규 상장 코인</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-3xl mb-2">🎲</div>
                  <div className="text-white font-semibold">완전 랜덤</div>
                  <div className="text-purple-200 text-sm">모든 코인 포함</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
          <div className="max-w-4xl mx-auto">
            
            {/* 룰렛 컴포넌트 */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30 dark:border-gray-700/30">
              <CoinRoulette />
            </div>

            {/* 안내 메시지 */}
            <div className="mt-8 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="text-blue-600 dark:text-blue-400 mb-2">
                  💡 <strong>팁:</strong>
                </div>
                <div className="text-blue-700 dark:text-blue-300 text-sm">
                  각 카테고리별로 다른 코인들이 나와요. 알파 코인은 더 레어하니 도전해보세요!
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
