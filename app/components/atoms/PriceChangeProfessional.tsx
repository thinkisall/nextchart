interface PriceChangeProps {
  value: number;
  percentage: number;
  isPositive: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showValue?: boolean;
  variant?: 'default' | 'minimal' | 'professional';
}

export function PriceChangeProfessional({ 
  value, 
  percentage, 
  isPositive, 
  size = 'md', 
  showValue = false, 
  variant = 'professional' 
}: PriceChangeProps) {
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
      icon: 'w-2 h-2'
    },
    sm: {
      container: 'px-3 py-1.5',
      percentage: 'text-sm font-bold',
      value: 'text-xs',
      icon: 'w-2.5 h-2.5'
    },
    md: {
      container: 'px-3 py-2',
      percentage: 'text-base font-bold',
      value: 'text-sm',
      icon: 'w-3 h-3'
    },
    lg: {
      container: 'px-4 py-2.5',
      percentage: 'text-lg font-bold',
      value: 'text-base',
      icon: 'w-3.5 h-3.5'
    },
    xl: {
      container: 'px-5 py-3',
      percentage: 'text-xl font-bold',
      value: 'text-lg',
      icon: 'w-4 h-4'
    }
  };

  const classes = sizeClasses[size];

  // 프로페셔널 변형 - 세련된 디자인
  if (variant === 'professional') {
    const baseStyle = `
      inline-flex items-center justify-center rounded-2xl backdrop-blur-sm
      transition-all duration-300 hover:scale-105 shadow-lg border
      ${classes.container}
    `;

    if (isPositive) {
      return (
        <div className={`${baseStyle} 
          bg-gradient-to-br from-emerald-500/90 via-green-500/90 to-emerald-600/90 
          text-white border-emerald-400/50 shadow-emerald-200/30
          hover:shadow-emerald-300/40 hover:from-emerald-600/90 hover:to-emerald-700/90
        `}>
          <div className="flex items-center space-x-2">
            <div className={`${classes.icon} rounded-full bg-white/20 flex items-center justify-center`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M7 14l5-5 5 5z"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className={`${classes.percentage} leading-none tabular-nums`}>
                {symbol}{formatPercentage(percentage)}
              </span>
              {showValue && (
                <span className={`${classes.value} opacity-90 leading-none tabular-nums`}>
                  {symbol}{formatValue(value)}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`${baseStyle}
          bg-gradient-to-br from-red-500/90 via-rose-500/90 to-red-600/90 
          text-white border-red-400/50 shadow-red-200/30
          hover:shadow-red-300/40 hover:from-red-600/90 hover:to-red-700/90
        `}>
          <div className="flex items-center space-x-2">
            <div className={`${classes.icon} rounded-full bg-white/20 flex items-center justify-center`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className={`${classes.percentage} leading-none tabular-nums`}>
                {formatPercentage(percentage)}
              </span>
              {showValue && (
                <span className={`${classes.value} opacity-90 leading-none tabular-nums`}>
                  {formatValue(value)}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  // 미니멀 변형 - 심플한 디자인
  if (variant === 'minimal') {
    const textColor = isPositive 
      ? 'text-emerald-600 dark:text-emerald-400' 
      : 'text-red-600 dark:text-red-400';
    
    return (
      <div className={`inline-flex items-center space-x-1 ${classes.container}`}>
        <span className={`${textColor} ${classes.percentage} tabular-nums`}>
          {symbol}{formatPercentage(percentage)}
        </span>
        {showValue && (
          <span className={`${textColor} ${classes.value} opacity-70 tabular-nums`}>
            ({symbol}{formatValue(value)})
          </span>
        )}
      </div>
    );
  }

  // 기본 변형 - 기존 스타일 개선
  const baseStyle = `
    inline-flex items-center justify-center rounded-xl shadow-md border
    transition-all duration-200 hover:shadow-lg ${classes.container}
  `;

  if (isPositive) {
    return (
      <div className={`${baseStyle} 
        bg-gradient-to-br from-emerald-500 to-green-600 
        text-white border-emerald-400/30
      `}>
        <div className={`flex items-center space-x-1.5 ${classes.percentage}`}>
          <span>▲</span>
          <span className="tabular-nums">{symbol}{formatPercentage(percentage)}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className={`${baseStyle}
        bg-gradient-to-br from-red-500 to-pink-600 
        text-white border-red-400/30
      `}>
        <div className={`flex items-center space-x-1.5 ${classes.percentage}`}>
          <span>▼</span>
          <span className="tabular-nums">{formatPercentage(percentage)}</span>
        </div>
      </div>
    );
  }
}