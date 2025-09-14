interface UPusdtBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UPusdtBadge({ size = 'sm', className = '' }: UPusdtBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const subSize = {
    sm: '0.65em',
    md: '0.7em', 
    lg: '0.75em',
  };

  return (
    <span 
      className={`
        inline-flex items-center
        ${sizeClasses[size]}
        bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 
        text-white font-bold rounded-lg 
        shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105
        ring-1 ring-blue-400/30
        ${className}
      `}
      title="업비트 USDT 마켓에서도 거래 가능"
    >
      UP<sub style={{ fontSize: subSize[size], marginLeft: '1px' }}>usdt</sub>
    </span>
  );
}
