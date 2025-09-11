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

  const colorClass = isPositive 
    ? 'text-red-500 dark:text-red-400' 
    : 'text-blue-500 dark:text-blue-400';
  const symbol = isPositive ? '+' : '-';
  const bgClass = isPositive 
    ? 'bg-red-50 dark:bg-red-900/20' 
    : 'bg-blue-50 dark:bg-blue-900/20';

  const sizeClasses = {
    sm: {
      container: 'text-xs',
      value: 'text-xs',
      percentage: 'text-xs',
      padding: 'px-2 py-1'
    },
    md: {
      container: 'text-sm',
      value: 'text-sm',
      percentage: 'text-xs',
      padding: 'px-3 py-1'
    },
    lg: {
      container: 'text-base',
      value: 'text-base',
      percentage: 'text-sm',
      padding: 'px-3 py-2'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`${colorClass} font-semibold ${classes.container}`}>
      <div className={`${classes.value} flex items-center space-x-1`}>
        <span>{symbol}{formatPercentage(percentage)}</span>
        <span className={`inline-block w-0 h-0 ${
          isPositive 
            ? 'border-l-2 border-r-2 border-b-3 border-transparent border-b-red-500' 
            : 'border-l-2 border-r-2 border-t-3 border-transparent border-t-blue-500'
        }`} />
      </div>
      <div className={`${classes.percentage} opacity-75`}>
        {symbol}{formatValue(value)}
      </div>
    </div>
  );
}