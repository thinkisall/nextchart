import { CoinRoulette } from "./components/CoinRoulette";
import { ErrorBoundary } from "../components/ErrorBoundary";
import Link from "next/link";

export default function CoinRoulettePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
        
        {/* 헤더 */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 dark:from-purple-800 dark:via-pink-800 dark:to-blue-800" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(168,85,247,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.15),transparent_50%)]" />
          
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12 sm:py-16 text-center">
              
              {/* 뒤로가기 버튼 */}
              <div className="absolute top-6 left-6">
                <Link href="/">
                  <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-medium hover:bg-white/30 transition-all duration-300 flex items-center space-x-2">
                    <span>←</span>
                    <span>홈으로</span>
                  </button>
                </Link>
              </div>

              {/* 타이틀 */}
              <div className="mb-8">
                <div className="inline-flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-spin" />
                  <span className="text-purple-300 text-sm font-medium tracking-wider uppercase">
                    Daily Coin Pick
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                    🎰 오늘의 코인 추천
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-purple-100/90 leading-relaxed max-w-2xl mx-auto">
                  바이낸스와 바이낸스 알파의 <span className="text-purple-200 font-semibold">숨겨진 보석</span>을 
                  발견해보세요! 🚀
                </p>
              </div>

              {/* 통계 카드 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">🎯</div>
                  <div className="text-purple-200 text-sm">랜덤 선택</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">⚡</div>
                  <div className="text-purple-200 text-sm">즉시 결과</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">🔥</div>
                  <div className="text-purple-200 text-sm">핫한 코인</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-white">💎</div>
                  <div className="text-purple-200 text-sm">숨은 보석</div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-50 dark:from-purple-950 to-transparent" />
        </div>

        {/* 메인 룰렛 영역 */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-8">
          <CoinRoulette />
        </div>
      </div>
    </ErrorBoundary>
  );
}