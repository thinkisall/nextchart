// React Query (TanStack Query) 훅
// 현재 패키지가 설치되지 않아 주석 처리
// 설치 후 사용: npm install @tanstack/react-query

/*
'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllTickers } from '../lib/bithumb-api';

export function useReactQueryCrypto() {
  return useQuery({
    queryKey: ['crypto-prices'],
    queryFn: getAllTickers,
    refetchInterval: 3000, // 3초마다 자동 리페치
    staleTime: 2000, // 2초간 데이터를 fresh로 간주
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
    refetchOnWindowFocus: true, // 윈도우 포커스 시 리페치
    refetchOnReconnect: true, // 네트워크 재연결 시 리페치
    retry: 3, // 실패 시 3번 재시도
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// 개별 코인용 쿼리
export function useReactQuerySingleCrypto(symbol: string) {
  return useQuery({
    queryKey: ['crypto-price', symbol],
    queryFn: () => fetch(`/api/crypto/${symbol}`).then(res => res.json()),
    refetchInterval: 1000, // 1초마다 업데이트
    enabled: !!symbol,
  });
}
*/

// 임시 더미 함수들 (React Query 없이 사용)
export function useReactQueryCrypto() {
  return {
    data: [],
    isLoading: false,
    error: null,
    refetch: () => {}
  };
}

export function useReactQuerySingleCrypto(symbol: string) {
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: () => {}
  };
}
