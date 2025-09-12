'use client';

import { useState, useEffect, useRef } from 'react';
import { CryptoPrice } from '../lib/types';
import { CRYPTO_KOREAN_NAMES } from '../lib/crypto';

interface UpbitWebSocketConfig {
  symbols: string[];
}

export function useUpbitWebSocket(config: UpbitWebSocketConfig) {
  const [data, setData] = useState<CryptoPrice[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const connect = () => {
    try {
      // ?�비??WebSocket (???�정??
      const ws = new WebSocket('wss://api.upbit.com/websocket/v1');
      wsRef.current = ws;

      ws.onopen = () => {setIsConnected(true);
        setError(null);
        setReconnectAttempts(0);

        // ?�비??구독 메시지 (빗썸 ?�볼???�비???�식?�로 변??
        const upbitSymbols = config.symbols.map(symbol => 
          symbol.replace('_KRW', '-KRW').replace('KRW-', 'KRW-')
        );

        const subscribeMessage = [
          { ticket: 'unique_ticket' },
          { type: 'ticker', codes: upbitSymbols }
        ];
        
        ws.send(JSON.stringify(subscribeMessage));
      };

      ws.onmessage = (event) => {
        try {
          const buffer = event.data;
          const reader = new FileReader();
          
          reader.onload = () => {
            try {
              const text = reader.result as string;
              const message = JSON.parse(text);
              
              if (message.type === 'ticker') {
                // 업비트 데이터를 빗썸 형식으로 변환
                const symbol = message.code.replace('KRW-', '');
                const currentPrice = message.trade_price;
                const changeAmount = message.change_price;
                const changeRate = message.change_rate * 100;

                const cryptoPrice: CryptoPrice = {
                  symbol,
                  korean_name: CRYPTO_KOREAN_NAMES[symbol] || symbol,
                  english_name: symbol,
                  current_price: currentPrice,
                  change_rate: changeRate,
                  change_amount: changeAmount,
                  high_price: message.high_price,
                  low_price: message.low_price,
                  volume: message.acc_trade_volume_24h,
                  is_positive: message.change === 'RISE',
                };

                setData(prevData => {
                  const existingIndex = prevData.findIndex(
                    item => item.symbol === cryptoPrice.symbol
                  );
                  
                  if (existingIndex >= 0) {
                    const newData = [...prevData];
                    newData[existingIndex] = cryptoPrice;
                    return newData;
                  } else {
                    return [...prevData, cryptoPrice];
                  }
                });
              }
            } catch (parseError) {
              console.error('Error parsing WebSocket message:', parseError);
            }
          };
          
          reader.readAsText(buffer);
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.onclose = () => {setIsConnected(false);
        
        if (reconnectAttempts < 5) {
          setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, 3000 * (reconnectAttempts + 1));
        }
      };

      ws.onerror = (error) => {
        console.error('Upbit WebSocket error:', error);
        setError('WebSocket ?�결 ?�패');
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setError('WebSocket ?�결 ?�성 ?�패');
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setData([]);
  };

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  return {
    data,
    isConnected,
    error,
    reconnect: connect,
    disconnect
  };
}
