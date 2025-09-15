"use client";
import { useState, useEffect } from "react";
import { RouletteWheel } from "./RouletteWheel";
import { CoinResult } from "./CoinResult";

// 바이낸스 및 바이낸스 알파 코인 목록 (샘플)
const BINANCE_COINS = [
  { symbol: "BTC", name: "비트코인", isAlpha: false, color: "#f7931a" },
  { symbol: "ETH", name: "이더리움", isAlpha: false, color: "#627eea" },
  { symbol: "BNB", name: "바이낸스 코인", isAlpha: false, color: "#f3ba2f" },
  { symbol: "ADA", name: "카르다노", isAlpha: false, color: "#0033ad" },
  { symbol: "XRP", name: "리플", isAlpha: false, color: "#23292f" },
  { symbol: "SOL", name: "솔라나", isAlpha: false, color: "#9945ff" },
  { symbol: "DOGE", name: "도지코인", isAlpha: false, color: "#c2a633" },
  { symbol: "AVAX", name: "아발란체", isAlpha: false, color: "#e84142" },
  { symbol: "DOT", name: "폴카닷", isAlpha: false, color: "#e6007a" },
  { symbol: "MATIC", name: "폴리곤", isAlpha: false, color: "#8247e5" },
  
  // 바이낸스 알파 코인들
  { symbol: "PEPE", name: "페페", isAlpha: true, color: "#00ff88" },
  { symbol: "FLOKI", name: "플로키", isAlpha: true, color: "#ff6b35" },
  { symbol: "SHIB", name: "시바이누", isAlpha: true, color: "#ffa409" },
  { symbol: "BONK", name: "봉크", isAlpha: true, color: "#ff4081" },
  { symbol: "WIF", name: "위프", isAlpha: true, color: "#00bcd4" },
  { symbol: "POPCAT", name: "팝캣", isAlpha: true, color: "#9c27b0" },
  { symbol: "NEIRO", name: "네이로", isAlpha: true, color: "#4caf50" },
  { symbol: "MOODENG", name: "무뎅", isAlpha: true, color: "#ff5722" },
  { symbol: "GOAT", name: "고트", isAlpha: true, color: "#795548" },
  { symbol: "PNUT", name: "피넛", isAlpha: true, color: "#607d8b" },
];

export function CoinRoulette() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<typeof BINANCE_COINS[0] | null>(null);
  const [showResult, setShowResult] = useState(false);

  const startRoulette = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setResult(null);
    setShowResult(false);
    
    // 3초 후 결과 표시
    setTimeout(() => {
      const randomCoin = BINANCE_COINS[Math.floor(Math.random() * BINANCE_COINS.length)];
      setResult(randomCoin);
      setIsSpinning(false);
      
      // 결과 표시
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    }, 3000);
  };

  const resetRoulette = () => {
    setResult(null);
    setShowResult(false);
    setIsSpinning(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* 메인 룰렛 카드 */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/30 shadow-2xl overflow-hidden">
        
        {/* 카드 헤더 */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">🎰 코인 룰렛</h2>
          <p className="text-purple-100">행운의 코인을 찾아보세요!</p>
        </div>

        {/* 룰렛 휠 영역 */}
        <div className="p-8">
          <RouletteWheel 
            isSpinning={isSpinning}
            coins={BINANCE_COINS}
            result={result}
          />
          
          {/* 컨트롤 버튼들 */}
          <div className="flex justify-center space-x-4 mt-8">
            {!result ? (
              <button
                onClick={startRoulette}
                disabled={isSpinning}
                className={`
                  px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300
                  ${isSpinning
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  }
                `}
              >
                {isSpinning ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>돌리는 중...</span>
                  </div>
                ) : (
                  "🎯 룰렛 시작!"
                )}
              </button>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={startRoulette}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  🔄 다시 돌리기
                </button>
                <button
                  onClick={resetRoulette}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  🗑️ 초기화
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 결과 표시 영역 */}
      {result && showResult && (
        <div className="mt-8">
          <CoinResult coin={result} />
        </div>
      )}

      {/* 설명 카드 */}
      <div className="mt-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
          <span className="mr-2">ℹ️</span>
          룰렛 이용 안내
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">📍 대상 코인</h4>
            <ul className="space-y-1">
              <li>• 바이낸스 메인 코인 ({BINANCE_COINS.filter(c => !c.isAlpha).length}개)</li>
              <li>• 바이낸스 알파 코인 ({BINANCE_COINS.filter(c => c.isAlpha).length}개)</li>
              <li>• 총 {BINANCE_COINS.length}개 코인 중 랜덤 선택</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">⚠️ 주의사항</h4>
            <ul className="space-y-1">
              <li>• 이는 오락용 기능입니다</li>
              <li>• 투자 조언이 아닙니다</li>
              <li>• 자신의 판단으로 투자하세요</li>
              <li>• 손실에 대한 책임지지 않습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}