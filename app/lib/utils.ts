/**
 * Tailwind CSS 클래스 이름 합치기 유틸리티
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * 가격 포맷팅 유틸리티 함수들
 */

export const formatKRW = (price: number, options?: { 
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? (price < 1000 ? 2 : 0),
  }).format(price);
};

export const formatPercentage = (percentage: number, decimals: number = 2) => {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(decimals)}%`;
};

export const formatVolume = (volume: number) => {
  if (volume >= 1e12) {
    return `${(volume / 1e12).toFixed(1)}T`;
  } else if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(1)}B`;
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(1)}M`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(1)}K`;
  }
  return volume.toFixed(2);
};

export const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat('ko-KR', options).format(number);
};

/**
 * 시간 포맷팅 유틸리티
 */
export const formatTime = (date: Date, options?: Intl.DateTimeFormatOptions) => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  
  return new Intl.DateTimeFormat('ko-KR', { ...defaultOptions, ...options }).format(date);
};

export const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

/**
 * 색상 유틸리티
 */
export const getPriceChangeColor = (isPositive: boolean) => {
  return isPositive ? 'text-red-600' : 'text-blue-600';
};

export const getPriceChangeBackground = (isPositive: boolean) => {
  return isPositive ? 'bg-red-50' : 'bg-blue-50';
};

/**
 * 디바운스 유틸리티
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
}

/**
 * 소켓 재연결 유틸리티
 */
export const getReconnectDelay = (attempt: number, baseDelay: number = 1000) => {
  return Math.min(baseDelay * Math.pow(2, attempt), 30000); // 최대 30초
};
