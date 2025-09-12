interface UpbitBadgeProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function UpbitBadge({ size = 'sm', className = '' }: UpbitBadgeProps) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
  };

  return (
    <span 
      className={`
        inline-flex items-center
        ${sizeClasses[size]}
        bg-gradient-to-r from-blue-500 to-indigo-600 
        text-white font-bold rounded-md 
        shadow-sm hover:shadow-md transition-shadow duration-200
        ${className}
      `}
      title="업비트에서도 거래 가능"
    >
      UP
    </span>
  );
}
