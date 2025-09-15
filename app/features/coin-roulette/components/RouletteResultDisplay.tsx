import { memo } from 'react';
import { CoinRouletteService } from '../services/coinRouletteService';
import type { RouletteResult } from '../types';

interface RouletteResultDisplayProps {
  result: RouletteResult | null;
  className?: string;
}

/**
 * 룰렛 결과 표시 컴포넌트
 * 선택된 코인 정보와 스타일링
 */
export const RouletteResultDisplay = memo<RouletteResultDisplayProps>(({ 
  result, 
  className = '' 
}) => {
  if (!result) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">
          🎲 버튼을 눌러 코인을 뽑아보세요!
        </div>
      </div>
    );
  }

  const { coin } = result;
  const displayText = CoinRouletteService.formatCoinDisplay(coin);
  
  const getResultStyle = () => {
    if (coin.isAlpha) {
      return `bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white
        shadow-lg shadow-purple-500/30 border-2 border-purple-300 dark:border-purple-700`;
    } else {
      return `bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 text-white
        shadow-lg shadow-blue-500/30 border-2 border-blue-300 dark:border-blue-700`;
    }
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="mb-4">
        <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          🎉 당첨된 코인은...
        </div>
      </div>
      
      {/* 메인 결과 카드 */}
      <div className={`inline-block px-8 py-6 rounded-3xl ${getResultStyle()} 
        transform transition-all duration-300 hover:scale-105`}>
        
        {/* 코인 심볼 */}
        <div className="text-4xl font-bold mb-2">
          {coin.symbol}
        </div>
        
        {/* 카테고리 표시 */}
        <div className="text-sm opacity-90 mb-3">
          {coin.isAlpha ? '🔥 알파 코인' : '📈 바이낸스 코인'}
        </div>
        
        {/* 추가 정보 */}
        <div className="text-xs opacity-75">
          {new Date(result.timestamp).toLocaleTimeString('ko-KR')}
        </div>
      </div>
      
      {/* 축하 메시지 */}
      <div className="mt-6">
        <div className="text-2xl mb-2">
          {coin.isAlpha ? '🚀' : '💰'}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {coin.isAlpha 
            ? '레어한 알파 코인을 뽑으셨네요!' 
            : '안정적인 바이낸스 코인입니다!'
          }
        </div>
      </div>
    </div>
  );
});

RouletteResultDisplay.displayName = 'RouletteResultDisplay';
