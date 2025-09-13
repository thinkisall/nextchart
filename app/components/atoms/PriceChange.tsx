interface PriceChangeProps {
  value: number;
  percentage: number;
  isPositive: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function PriceChange({ value, percentage, isPositive, size = 'md' }: PriceChangeProps) {
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
      container: 'px-2 py-1.5',
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
      container: 'px-3 py-2',
      percentage: 'text-sm font-bold',
      value: 'text-xs',
      icon: 'text-sm'
    },
    lg: {
      container: 'px-4 py-2.5',
      percentage: 'text-base font-bold',
      value: 'text-sm',
      icon: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  if (isPositive) {
    return (
      <div className={`inline-flex flex-col items-end space-y-1 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${classes.container}`}>
        <div className={`flex items-center space-x-1.5 ${classes.percentage}`}>
          <span className={`${classes.icon} animate-pulse`}>🚀</span>
          <span>{symbol}{formatPercentage(percentage)}</span>
        </div>
        <div className={`text-emerald-100 ${classes.value} tabular-nums font-medium`}>
          {symbol}{formatValue(value)}
        </div>
      </div>
    );
  } else {
    return (
      <div className={`inline-flex flex-col items-end space-y-1 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${classes.container}`}>
        <div className={`flex items-center space-x-1.5 ${classes.percentage}`}>
          <span className={`${classes.icon} animate-pulse`}>📉</span>
          <span>{formatPercentage(percentage)}</span>
        </div>
        <div className={`text-red-100 ${classes.value} tabular-nums font-medium`}>
          {formatValue(value)}
        </div>
      </div>
    );
  }
}