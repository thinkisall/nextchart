"use client";
import { useEffect, useState } from "react";

interface Coin {
  symbol: string;
  name: string;
  isAlpha: boolean;
  color: string;
}

interface RouletteWheelProps {
  isSpinning: boolean;
  coins: Coin[];
  result: Coin | null;
}

export function RouletteWheel({ isSpinning, coins, result }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    if (isSpinning) {
      // 스피닝 애니메이션
      const interval = setInterval(() => {
        setHighlightedIndex(prev => (prev + 1) % coins.length);
      }, 100); // 빠르게 돌아가는 효과

      return () => clearInterval(interval);
    } else if (result) {
      // 결과에 맞는 인덱스 찾기
      const resultIndex = coins.findIndex(coin => coin.symbol === result.symbol);
      setHighlightedIndex(resultIndex);
    }
  }, [isSpinning, result, coins]);

  return (
    <div className="flex flex-col items-center space-y-8">
      
      {/* 룰렛 휠 - 원형 디스플레이 */}
      <div className="relative">
        <div className={`
          w-80 h-80 rounded-full border-8 border-gradient-to-r from-purple-400 to-pink-400 
          bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900
          shadow-2xl relative overflow-hidden
          ${isSpinning ? 'animate-spin' : ''}
        `}>
          
          {/* 중앙 포인터 */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-500 transform translate-y-2" />
          </div>
          
          {/* 코인들을 원형으로 배치 */}
          <div className="absolute inset-4 rounded-full">
            {coins.map((coin, index) => {
              const angle = (360 / coins.length) * index;
              const isHighlighted = highlightedIndex === index;
              
              return (
                <div
                  key={coin.symbol}
                  className={`
                    absolute w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-200 shadow-lg border-2
                    ${isHighlighted 
                      ? 'scale-125 border-yellow-400 bg-yellow-100 dark:bg-yellow-900' 
                      : 'border-white/50 bg-white/80 dark:bg-slate-700/80'
                    }
                  `}
                  style={{
                    transform: `rotate(${angle}deg) translateX(130px) rotate(-${angle}deg)`,
                    backgroundColor: isHighlighted ? coin.color + '40' : undefined,
                  }}
                >
                  <span className={`
                    text-xs font-bold
                    ${isHighlighted ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}
                  `}>
                    {coin.symbol}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* 중앙 로고 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
              <span className="text-2xl text-white font-bold">🎰</span>
            </div>
          </div>
        </div>
      </div>

      {/* 현재 하이라이트된 코인 정보 */}
      <div className="text-center">
        <div className={`
          inline-flex items-center space-x-3 px-6 py-3 rounded-2xl
          transition-all duration-300
          ${isSpinning 
            ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50' 
            : result 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50'
              : 'bg-slate-100 dark:bg-slate-800'
          }
        `}>
          
          {/* 코인 아이콘 */}
          <div 
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
              ${coins[highlightedIndex].isAlpha ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}
            `}
            style={{ backgroundColor: coins[highlightedIndex].color }}
          >
            {coins[highlightedIndex].symbol.slice(0, 2)}
          </div>
          
          {/* 코인 정보 */}
          <div className="text-left">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                {coins[highlightedIndex].name}
              </h3>
              {coins[highlightedIndex].isAlpha && (
                <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full font-bold">
                  ALPHA
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
              {coins[highlightedIndex].symbol}
            </p>
          </div>
        </div>
        
        {/* 상태 메시지 */}
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          {isSpinning ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin inline-block" />
              <span>룰렛이 돌아가고 있습니다...</span>
            </span>
          ) : result ? (
            <span className="text-green-600 dark:text-green-400 font-semibold">
              🎉 오늘의 추천 코인이 결정되었습니다!
            </span>
          ) : (
            "시작 버튼을 눌러 룰렛을 돌려보세요!"
          )}
        </p>
      </div>
    </div>
  );
}