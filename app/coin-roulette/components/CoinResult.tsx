"use client";
import { useState, useEffect } from "react";

interface Coin {
  symbol: string;
  name: string;
  isAlpha: boolean;
  color: string;
}

interface CoinResultProps {
  coin: Coin;
}

export function CoinResult({ coin }: CoinResultProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // 애니메이션 트리거
    setTimeout(() => setShowAnimation(true), 100);
  }, []);

  return (
    <div className={`
      transform transition-all duration-1000
      ${showAnimation ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}
    `}>
      <div className="bg-gradient-to-br from-white via-green-50 to-emerald-50 dark:from-slate-900 dark:via-green-950 dark:to-emerald-950 backdrop-blur-xl rounded-3xl border border-green-200/50 dark:border-green-800/50 shadow-2xl overflow-hidden">
        
        {/* 헤더 - 축하 메시지 */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 p-6 text-center relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-30" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
              <span>🎉</span>
              <span>당첨!</span>
              <span>🎉</span>
            </h2>
            <p className="text-green-100">오늘의 추천 코인이 결정되었습니다</p>
          </div>
        </div>

        {/* 메인 결과 영역 */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            
            {/* 코인 아이콘 및 기본 정보 */}
            <div className="flex-shrink-0 text-center">
              <div 
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl mb-4 mx-auto"
                style={{ backgroundColor: coin.color }}
              >
                {coin.symbol.slice(0, 2)}
              </div>
              
              {coin.isAlpha && (
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  <span>🔥</span>
                  <span>바이낸스 알파</span>
                </div>
              )}
            </div>

            {/* 코인 상세 정보 */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {coin.name}
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-mono mb-4">
                {coin.symbol}
              </p>
              
              {/* 추천 이유 */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-slate-700/30">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  추천 포인트
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>높은 거래량</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>활발한 커뮤니티</span>
                  </div>
                  {coin.isAlpha && (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <span>신규 상장 코인</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <span>성장 잠재력</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.open(`https://www.binance.com/en/trade/${coin.symbol}_USDT`, '_blank')}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              🚀 바이낸스에서 거래하기
            </button>
            
            <button 
              onClick={() => window.open(`https://coinmarketcap.com/currencies/${coin.name.toLowerCase().replace(/\s+/g, '-')}/`, '_blank')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              📊 차트 보기
            </button>
          </div>

          {/* 경고 메시지 */}
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div className="flex-1">
                <h5 className="font-bold text-yellow-800 dark:text-yellow-200 mb-1">투자 주의사항</h5>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  이 추천은 오락 목적으로만 제공됩니다. 암호화폐 투자는 고위험 투자이며, 
                  투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다. 
                  투자 손실에 대해 책임지지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}