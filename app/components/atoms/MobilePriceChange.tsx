interface MobilePriceChangeProps {
  percentage: number;
  isPositive: boolean;
  size?: 'xs' | 'sm' | 'md';
}

export function MobilePriceChange({ percentage, isPositive, size = 'sm' }: MobilePriceChangeProps) {
  const formatPercentage = (num: number) => {
    return `${isPositive ? '+' : ''}${num.toFixed(2)}%`;
  };

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base'
  };

  return (
    <div className={`
      flex items-center font-bold tracking-tight
      ${isPositive 
        ? 'text-emerald-600 dark:text-emerald-400' 
        : 'text-red-600 dark:text-red-400'
      }
      ${sizeClasses[size]}
    `}>
      <span className="mr-1">
        {isPositive ? '▲' : '▼'}
      </span>
      <span>
        {formatPercentage(percentage)}
      </span>
    </div>
  );
}