'use client';

import { useState, useEffect, useCallback } from 'react';
import type { NewListingsResponse, Listing } from '../types';

export function useNewListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 신규상장 데이터 요청...');
      
      const response = await fetch('/api/new-listings', {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: 서버 응답 오류`);
      }
      
      const data: NewListingsResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setListings(data.listings || []);
      setLastUpdated(new Date(data.lastUpdated));
      
      console.log(`✅ 신규상장 알림 ${data.count}개 로드 완료`);
      
    } catch (err) {
      console.error('❌ 신규상장 데이터 로드 실패:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
    
    // 5분마다 자동 갱신
    const interval = setInterval(fetchListings, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchListings]);

  return {
    listings,
    loading,
    error,
    lastUpdated,
    refetch: fetchListings
  };
}
