import { memo } from 'react';
import type { CoinCategory } from '../types';

interface SpinButtonProps {
  onSpin: () => void;
  disabled: boolean;
  category: CoinCategory;
}

/**
 * 룰렛 스핀 버튼 컴포넌트
 * 카테고리별 스타일링과 상태 표시
 */
export const SpinButton = memo<SpinButtonProps>(({ 
  onSpin, 
  disabled, 
  category 
}) => {
  const getButtonStyle = () => {
    const baseStyle = `relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-lg 
      transition-all duration-300 transform hover:scale-105 disabled:scale-100 
      disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl`;
    
    switch (category) {
      case 'alpha':
        return `${baseStyle} bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 
          hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white
          shadow-purple-500/25`;
      case 'binance':
        return `${baseStyle} bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 
          hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white
          shadow-yellow-500/25`;
      default:
        return `${baseStyle} bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
          hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white
          shadow-blue-500/25`;
    }
  };

  const getButtonText = () => {
    if (disabled) return '스핀 중...';
    
    switch (category) {
      case 'alpha':
        return '🔥 알파 코인 뽑기!';
      case 'binance':
        return '📈 바이낸스 코인 뽑기!';
      default:
        return '🎰 랜덤 코인 뽑기!';
    }
  };

  const getSparkleEffect = () => {
    if (disabled) return null;
    
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
        transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 
        ease-in-out opacity-0 group-hover:opacity-100" />
    );
  };

  return (
    <button
      onClick={onSpin}
      disabled={disabled}
      className={`group ${getButtonStyle()}`}
    >
      {/* 스파클 효과 */}
      {getSparkleEffect()}
      
      {/* 버튼 텍스트 */}
      <span className="relative z-10 flex items-center justify-center space-x-2">
        <span>{getButtonText()}</span>
        {disabled && (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
      </span>
      
      {/* 펄스 효과 (비활성화 시) */}
      {disabled && (
        <div className="absolute inset-0 bg-white/10 animate-pulse rounded-2xl" />
      )}
    </button>
  );
});

SpinButton.displayName = 'SpinButton';
