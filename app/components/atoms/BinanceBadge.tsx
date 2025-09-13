interface BinanceBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function BinanceBadge({ size = 'sm', className = '' }: BinanceBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span 
      className={`
        inline-flex items-center
        ${sizeClasses[size]}
        bg-gradient-to-r from-yellow-400 to-orange-500 
        text-white font-bold rounded-lg 
        shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105
        ${className}
      `}
      title="바이낸스에서도 거래 가능"
    >
      BN
    </span>
  );
}
