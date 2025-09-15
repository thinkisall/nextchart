interface PriceChangeProps {
  value: number;
  percentage: number;
  isPositive: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  compact?: boolean; // 모바일용 컴팩트 모드 추가
}

export function PriceChange({ value, percentage, isPositive, size = 'md', compact = false }: PriceChangeProps) {
  const formatValue = (num: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(num));
  };

  const formatPercentage = (num: number) => {
    return `${Math.abs(num).toFixed(2)}%`;
  };

  const symbol = isPositive ? '+' : '';
  
  const sizeClasses = {
    xs: {
      container: 'px-2 py-1',
      percentage: 'text-xs font-bold',
      value: 'text-xs',
      icon: 'text-xs'
    },
    sm: {
      container: 'px-2.5 py-1.5',
      percentage: 'text-sm font-bold',
      value: 'text-xs',
      icon: 'text-sm'
    },
    md: {
      container: 'px-3 py-1.5',
      percentage: 'text-base font-bold',
      value: 'text-sm',
      icon: 'text-base'
    },
    lg: {
      container: 'px-4 py-2',
      percentage: 'text-lg font-bold',
      value: 'text-base',
      icon: 'text-lg'
    }
  };

  const classes = sizeClasses[size];

  // 컴팩트 모드 (모바일용 - 배경 없이 텍스트만)
  if (compact) {
    return (
      <div className={`inline-flex items-center ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
        <span className="text-xs font-bold tracking-tight">
          {isPositive ? '▲' : '▼'} {symbol}{formatPercentage(percentage)}
        </span>
      </div>
    );
  }

  if (isPositive) {
    return (
      <div className={`inline-flex items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl shadow-lg border border-emerald-400/30 ${classes.container}`}>
        <div className={`flex items-center space-x-1.5 ${classes.percentage}`}>
          <span className={`${classes.icon}`}>▲</span>
          <span className="tracking-tight">{symbol}{formatPercentage(percentage)}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className={`inline-flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl shadow-lg border border-red-400/30 ${classes.container}`}>
        <div className={`flex items-center space-x-1.5 ${classes.percentage}`}>
          <span className={`${classes.icon}`}>▼</span>
          <span className="tracking-tight">{formatPercentage(percentage)}</span>
        </div>
      </div>
    );
  }
}