interface UpbitBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UpbitBadge({ size = 'sm', className = '' }: UpbitBadgeProps) {
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
        bg-gradient-to-r from-blue-500 to-indigo-600 
        text-white font-bold rounded-lg 
        shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105
        ${className}
      `}
      title="업비트에서도 거래 가능"
    >
      UP
    </span>
  );
}
