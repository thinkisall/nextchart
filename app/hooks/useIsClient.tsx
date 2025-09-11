'use client';

import { useState, useEffect } from 'react';

/**
 * SSR hydration 문제를 해결하기 위한 클라이언트 전용 컴포넌트 훅
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 더블 체크로 안전성 확보
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  return isClient;
}

/**
 * 클라이언트에서만 렌더링되는 래퍼 컴포넌트
 * hydration 오류를 방지하기 위해 사용
 */
interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 마운트되지 않았을 때는 fallback 렌더링
  if (!hasMounted) {
    return <>{fallback}</>;
  }

  // 마운트된 후에만 children 렌더링
  return <>{children}</>;
}