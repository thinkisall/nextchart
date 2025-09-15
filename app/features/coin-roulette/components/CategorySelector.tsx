import { memo } from 'react';
import type { CoinCategory } from '../types';

interface CategorySelectorProps {
  category: CoinCategory;
  onCategoryChange: (category: CoinCategory) => void;
  disabled?: boolean;
}

/**
 * 코인 카테고리 선택 컴포넌트
 * 바이낸스, 알파, 전체 선택 가능
 */
export const CategorySelector = memo<CategorySelectorProps>(({ 
  category, 
  onCategoryChange, 
  disabled = false 
}) => {
  const categories = [
    { 
      value: 'all' as CoinCategory, 
      label: '전체', 
      icon: '🎲', 
      description: '바이낸스 + 알파 코인',
      color: 'from-blue-500 to-purple-500'
    },
    { 
      value: 'binance' as CoinCategory, 
      label: '바이낸스', 
      icon: '📈', 
      description: '메인 거래소 코인',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      value: 'alpha' as CoinCategory, 
      label: '알파', 
      icon: '🔥', 
      description: '신규 상장 코인',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          코인 카테고리 선택
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          어떤 종류의 코인을 뽑으시겠어요?
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const isSelected = category === cat.value;
          
          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              disabled={disabled}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 
                ${isSelected
                  ? `bg-gradient-to-br ${cat.color} text-white border-white/30 shadow-lg transform scale-105`
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102 cursor-pointer'}
              `}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className="font-semibold mb-1">{cat.label}</div>
                <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                  {cat.description}
                </div>
              </div>
              
              {/* 선택 표시 */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

CategorySelector.displayName = 'CategorySelector';
