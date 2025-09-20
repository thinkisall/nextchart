'use client';

import { useState, useEffect, useCallback } from 'react';

export interface AltcoinSeasonData {
  points: number;
  season: 'altcoin' | 'bitcoin';
  timestamp: string;
  description: string;
  color: string;
  emoji: string;
}

interface AltcoinSeasonResponse {
  data: AltcoinSeasonData;
  timestamp: string;
  source: string;
  success: boolean;
  fallback?: boolean;
  lastError?: string;
}

export function useAltcoinSeason() {
  const [data, setData] = useState<AltcoinSeasonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const fetchAltcoinSeason = useCallback(async () => {
    try {
      console.log('🔥 Fetching Altcoin Season Index...');
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15초 타임아웃

      const response = await fetch('/api/altcoin-season', {
        headers: {
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result: AltcoinSeasonResponse = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error('응답 데이터가 올바르지 않습니다');
      }
      
      console.log('✅ Altcoin Season Index fetched successfully:', result.data.points, 'points');
      
      setData(result.data);
      setLastUpdated(result.timestamp);
      setIsFallback(result.fallback || false);
      
    } catch (error) {
      console.error('❌ fetchAltcoinSeason failed:', error);
      
      let errorMessage = '알트코인 시즌 지수를 불러올 수 없습니다';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = '요청 시간 초과 - 네트워크를 확인해주세요';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = '서버에 연결할 수 없습니다';
        } else if (error.message.includes('API 키')) {
          errorMessage = 'API 키 설정을 확인해주세요';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAltcoinSeason();
    
    // 1시간마다 업데이트
    const interval = setInterval(() => fetchAltcoinSeason(), 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchAltcoinSeason]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    isFallback,
    refetch: fetchAltcoinSeason,
  };
}
