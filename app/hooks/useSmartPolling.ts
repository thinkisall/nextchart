'use client';

import { useState, useEffect, useRef } from 'react';
import { CryptoPrice } from '../lib/types';
import { getAllTickers } from '../lib/bithumb-api';

interface SmartPollingOptions {
  baseInterval?: number; // 기본 간격 (ms)
  maxInterval?: number;  // 최대 간격 (ms)
  visibilityOptimized?: boolean; // 탭 비활성화 시 간격 증가
  networkOptimized?: boolean;    // 네트워크 상태에 따른 조절
}

export function useSmartPolling(options: SmartPollingOptions = {}) {
  const {
    baseInterval = 5000,
    maxInterval = 30000,
    visibilityOptimized = true,
    networkOptimized = true
  } = options;

  const [data, setData] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interval, setInterval] = useState(baseInterval);
  const [isActive, setIsActive] = useState(true);
  
  const intervalRef = useRef<any>(null);
  const consecutiveErrors = useRef(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getAllTickers();
      setData(result);
      setError(null);
      consecutiveErrors.current = 0;
      
      // 성공 시 간격을 기본값으로 복원
      setInterval(baseInterval);
    } catch (err) {
      consecutiveErrors.current++;
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      // 연속 에러 시 간격 증가 (백오프)
      const newInterval = Math.min(baseInterval * Math.pow(2, consecutiveErrors.current), maxInterval);
      setInterval(newInterval);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 가시성 변경 감지
  useEffect(() => {
    if (!visibilityOptimized) return;

    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsActive(isVisible);
      
      if (isVisible) {
        // 페이지가 다시 활성화되면 즉시 데이터 가져오기
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [visibilityOptimized]);

  // 네트워크 상태 감지
  useEffect(() => {
    if (!networkOptimized) return;

    const handleOnline = () => {
      setError(null);
      fetchData();
    };

    const handleOffline = () => {
      setError('네트워크 연결이 끊어졌습니다');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [networkOptimized]);

  // 스마트 폴링 로직
  useEffect(() => {
    const currentInterval = isActive ? interval : interval * 3; // 비활성 시 3배 느리게
    
    // 초기 데이터 로드
    fetchData();
    
    // 폴링 시작
    // @ts-ignore
    intervalRef.current = setInterval(() => fetchData(), currentInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [interval, isActive]); // fetchData 의존성 제거

  return {
    data,
    loading,
    error,
    currentInterval: interval,
    isActive,
    refetch: fetchData
  };
}
