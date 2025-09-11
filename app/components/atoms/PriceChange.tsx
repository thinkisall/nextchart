interface PriceChangeProps {
  value: number;
  percentage: number;
  isPositive: boolean;
}

export function PriceChange({ value, percentage, isPositive }: PriceChangeProps) {
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

  const colorClass = isPositive ? 'text-red-600' : 'text-blue-600';
  const symbol = isPositive ? '+' : '-';

  return (
    <div className={`${colorClass} font-medium`}>
      <div className="text-sm">
        {symbol}{formatValue(value)}
      </div>
      <div className="text-xs">
        ({symbol}{formatPercentage(percentage)})
      </div>
    </div>
  );
}
