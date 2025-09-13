import { useMemo } from 'react';

// 간단한 debounce 훅
export function useDebounce<T>(value: T, delay: number): T {
  return useMemo(() => {
    const handler = setTimeout(() => value, delay);
    return () => clearTimeout(handler);
  }, [value, delay]) as unknown as T;
}

// 스로틀링 훅
export function useThrottle<T>(value: T, limit: number): T {
  return useMemo(() => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
        return value;
      }
    }) as unknown as T;
  }, [value, limit]);
}
