import { memo } from 'react';
import type { RouletteAnimation } from '../types';

interface RouletteWheelProps {
  animation: RouletteAnimation;
  onAnimationEnd?: () => void;
}

/**
 * 룰렛 휠 애니메이션 컴포넌트
 * 시각적 피드백을 위한 스피닝 휠
 */
export const RouletteWheel = memo<RouletteWheelProps>(({ 
  animation, 
  onAnimationEnd 
}) => {
  const getAnimationClass = () => {
    switch (animation.currentPhase) {
      case 'spinning':
        return 'animate-spin';
      case 'slowing':
        return 'animate-pulse';
      case 'stopped':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  const getWheelContent = () => {
    const coins = ['🪙', '💰', '🎯', '⭐', '🔥', '💎', '🚀', '📈'];
    return coins.map((coin, index) => (
      <div
        key={index}
        className={`absolute w-8 h-8 flex items-center justify-center text-lg
          ${animation.currentPhase === 'stopped' ? 'animate-pulse' : ''}
        `}
        style={{
          transform: `rotate(${index * 45}deg) translateY(-60px) rotate(-${index * 45}deg)`,
        }}
      >
        {coin}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 메인 룰렛 휠 */}
      <div className="relative">
        <div 
          className={`w-32 h-32 rounded-full border-8 border-gradient-to-br from-purple-400 via-pink-500 to-red-500 
            bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 
            dark:from-purple-900 dark:via-pink-900 dark:to-red-900
            shadow-2xl relative ${getAnimationClass()}
            ${animation.isSpinning ? 'duration-1000' : 'duration-300'}
          `}
          style={{
            animationDuration: animation.isSpinning ? `${animation.duration}ms` : undefined,
          }}
        >
          {/* 중앙 아이콘 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl">
              {animation.currentPhase === 'stopped' ? '🎉' : '🎰'}
            </div>
          </div>
          
          {/* 바깥쪽 코인들 */}
          {getWheelContent()}
        </div>

        {/* 포인터 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-yellow-500">
          </div>
        </div>
      </div>

      {/* 상태 텍스트 */}
      <div className="text-center">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {animation.currentPhase === 'idle' && '준비됨'}
          {animation.currentPhase === 'spinning' && '뽑는 중...'}
          {animation.currentPhase === 'slowing' && '거의 다 왔어요!'}
          {animation.currentPhase === 'stopped' && '완료!'}
        </div>
      </div>
    </div>
  );
});

RouletteWheel.displayName = 'RouletteWheel';
