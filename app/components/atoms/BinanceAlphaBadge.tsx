interface BinanceAlphaBadgeProps {
  className?: string;
}

export function BinanceAlphaBadge({ className = '' }: BinanceAlphaBadgeProps) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm ${className}`}>
      <span className="text-[10px] font-bold">α</span>
      <span className="ml-0.5 text-[9px] font-semibold">ALPHA</span>
    </span>
  );
}

// 더 간단한 버전
export function SimpleAlphaBadge({ className = '' }: BinanceAlphaBadgeProps) {
  return (
    <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-bold bg-yellow-400 text-black ${className}`}>
      α
    </span>
  );
}

// 아이콘 스타일 버전
export function AlphaIcon({ className = '' }: BinanceAlphaBadgeProps) {
  return (
    <span 
      className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white ${className}`}
      title="바이낸스 알파 코인"
    >
      α
    </span>
  );
}
