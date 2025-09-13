'use client';

import { useState, useEffect, useRef } from 'react';
import { CryptoPrice, BithumbTickerResponse, BithumbTickerData } from '../lib/types';
import { CRYPTO_KOREAN_NAMES, getCryptoInfo } from '../lib/crypto';

export function useServerSentEvents() {
  const [data, setData] = useState<CryptoPrice[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = () => {
    // 이미 연결되어 있으면 새로 연결하지 않음
    if (eventSourceRef.current && eventSourceRef.current.readyState === EventSource.OPEN) {
      return;
    }

    try {
      // 기존 연결이 있으면 닫기
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const eventSource = new EventSource('/api/stream');
      eventSourceRef.current = eventSource;

      eventSource.onopen = (event) => {
        setIsConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          // 디버깅: 데이터 수신 로그
          console.log('🔄 SSE Data received at:', new Date().toLocaleTimeString());
          
          if (!event.data || event.data.trim() === '') {
            return;
          }
          
          if (event.data.startsWith('<!DOCTYPE') || event.data.startsWith('<html')) {
            setError('서버에서 HTML을 반환했습니다. API 엔드포인트를 확인해주세요.');
            return;
          }
          
          const parsed = JSON.parse(event.data);
          
          // 새로운 형식: getAllTickers에서 직접 반환된 CryptoPrice 배열 처리
          if (Array.isArray(parsed)) {
            console.log('📊 Data array length:', parsed.length);
            
            // 빈 배열이 아닐 때만 업데이트
            if (parsed.length > 0) {
              setData(parsed);
              setLastUpdated(new Date());
              console.log('✅ Data updated with', parsed.length, 'items');
            } else {
              console.log('⚠️ Received empty array, keeping previous data');
            }
            return;
          }
          
          // 구 형식 처리 (BithumbTickerResponse) - 하위 호환성을 위해 유지
          const response: BithumbTickerResponse = parsed;
          
          if (response.error) {
            setError(response.error);
            return;
          }

          if (response.status === '0000' && response.data) {
            const processedData = Object.entries(response.data)
              .filter(([symbol, ticker]) => symbol !== 'date' && typeof ticker === 'object')
              .map(([symbol, ticker]) => {
                const tickerData = ticker as BithumbTickerData;
                let currentPrice = parseFloat(tickerData.closing_price);
                const prevPrice = parseFloat(tickerData.prev_closing_price);
                
                // closing_price가 0이거나 NaN이면 prev_closing_price 사용
                if (!currentPrice || currentPrice === 0) {
                  currentPrice = prevPrice;
                }
                
                // 여전히 유효한 가격이 없으면 건너뛰기
                if (!currentPrice || currentPrice <= 0) {
                  return null;
                }
                
                const changeAmount = currentPrice - prevPrice;
                const changeRate = prevPrice !== 0 ? (changeAmount / prevPrice) * 100 : 0;
                
                const cryptoInfo = getCryptoInfo(symbol);

                return {
                  symbol,
                  korean_name: cryptoInfo.koreanName,
                  english_name: symbol,
                  current_price: currentPrice,
                  change_rate: changeRate,
                  change_amount: changeAmount,
                  high_price: parseFloat(tickerData.max_price) || currentPrice,
                  low_price: parseFloat(tickerData.min_price) || currentPrice,
                  volume: parseFloat(tickerData.units_traded_24H) || 0,
                  is_positive: changeAmount >= 0,
                  sector: cryptoInfo.sector,
                };
              })
              .filter(crypto => crypto !== null && crypto !== undefined && crypto.current_price > 0) // null과 가격이 0인 코인들은 제외
              .sort((a, b) => b!.change_rate - a!.change_rate) as CryptoPrice[]; // 상승률 높은 순으로 정렬

            setData(processedData);
            setLastUpdated(new Date());
          }
        } catch (error) {
          // Error handling - removed console.error for production
          setError('데이터 파싱 오류');
        }
      };

      eventSource.onerror = (error) => {
        // Error handling - removed console.error for production
        setError(`서버 연결 오류 (상태: ${eventSource.readyState})`);
        setIsConnected(false);
        
        // EventSource 자동 재연결 방지를 위해 명시적으로 닫기
        if (eventSourceRef.current && eventSourceRef.current.readyState !== EventSource.CLOSED) {
          eventSourceRef.current.close();
        }
        
        // 3초 후 재연결 시도
        setTimeout(() => {
          if (!eventSourceRef.current || eventSourceRef.current.readyState === EventSource.CLOSED) {
            connect();
          }
        }, 3000);
      };

    } catch (error) {
      // Error handling - removed console.error for production
      setError('SSE 연결 생성 실패');
    }
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    setData([]);
  };

  useEffect(() => {
    // 페이지 로드 시 자동으로 SSE 연결
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return {
    data,
    isConnected,
    error,
    lastUpdated,
    reconnect: connect,
    disconnect
  };
}
