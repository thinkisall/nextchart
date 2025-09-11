interface PriceChangeProps {
  value: number;
  percentage: number;
  isPositive: boolean;
  size?: 'sm' | 'md' | 'lg';
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
    sm: {
      container: 'px-2 py-1',
      percentage: 'text-xs font-bold',
      value: 'text-xs',
      icon: 'text-xs'
    },
    md: {
      container: 'px-3 py-1.5',
      percentage: 'text-sm font-bold',
      value: 'text-xs',
      icon: 'text-sm'
    },
    lg: {
      container: 'px-4 py-2',
      percentage: 'text-base font-bold',
      value: 'text-sm',
      icon: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  if (isPositive) {
    return (
      <div className={`inline-flex flex-col items-end space-y-0.5 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200 dark:border-emerald-700/50 rounded-lg ${classes.container}`}>
        <div className={`flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 ${classes.percentage}`}>
          <span>{symbol}{formatPercentage(percentage)}</span>
          <span className={`${classes.icon}`}>▲</span>
        </div>
        <div className={`text-emerald-600/70 dark:text-emerald-400/70 ${classes.value} tabular-nums`}>
          {symbol}{formatValue(value)}
        </div>
      </div>
    );
  } else {
    return (
      <div className={`inline-flex flex-col items-end space-y-0.5 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border border-red-200 dark:border-red-700/50 rounded-lg ${classes.container}`}>
        <div className={`flex items-center space-x-1 text-red-600 dark:text-red-400 ${classes.percentage}`}>
          <span>{formatPercentage(percentage)}</span>
          <span className={`${classes.icon}`}>▼</span>
        </div>
        <div className={`text-red-600/70 dark:text-red-400/70 ${classes.value} tabular-nums`}>
          {formatValue(value)}
        </div>
      </div>
    );
  }
}