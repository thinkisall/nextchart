interface BinanceBadgeProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function BinanceBadge({ size = 'sm', className = '' }: BinanceBadgeProps) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
  };

  return (
    <span 
      className={`
        inline-flex items-center
        ${sizeClasses[size]}
        bg-gradient-to-r from-yellow-400 to-orange-500 
        text-white font-bold rounded-md 
        shadow-sm hover:shadow-md transition-shadow duration-200
        ${className}
      `}
      title="바이낸스에서도 거래 가능"
    >
      BN
    </span>
  );
}
