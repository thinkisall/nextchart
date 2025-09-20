'use client';

import { ExchangeFilter } from '../../lib/types';

interface ExchangeFilterButtonProps {
  exchange: ExchangeFilter;
  isActive: boolean;
  onClick: () => void;
}

export function ExchangeFilterButton({ 
  exchange, 
  isActive, 
  onClick 
}: ExchangeFilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center space-x-2 px-4 py-2.5 rounded-xl 
        font-medium text-sm transition-all duration-200 
        border-2 min-h-[44px] touch-manipulation
        ${isActive 
          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 dark:shadow-blue-900/30' 
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
        }
        active:scale-95
      `}
    >
      <span className="text-lg">{exchange.icon}</span>
      <span className="font-semibold">{exchange.name}</span>
      {exchange.count !== undefined && (
        <span className={`
          px-2 py-0.5 rounded-full text-xs font-bold
          ${isActive 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }
        `}>
          {exchange.count}
        </span>
      )}
    </button>
  );
}
