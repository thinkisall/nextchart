'use client';

import { useState, useEffect } from 'react';

/**
 * SSR hydration 문제를 해결하기 위한 클라이언트 전용 컴포넌트 훅
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * 클라이언트에서만 렌더링되는 래퍼 컴포넌트
 */
interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
