'use client';

import { useState, useEffect } from 'react';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

interface BtcDominanceData {
  dominance: number;
  timestamp: string;
}

export function BtcDominance() {
  const [data, setData] = useState<BtcDominanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBtcDominance = async () => {
    try {
      setError(null);
      const response = await fetch('/api/btc-dominance');
      
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('BTC 도미넌스 fetch 오류:', err);
      setError(err instanceof Error ? err.message : '데이터를 불러올 수 없습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBtcDominance();
    
    // 1시간마다 업데이트
    const interval = setInterval(fetchBtcDominance, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="w-full bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200/50 dark:border-orange-700/30 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-lg">₿</span>
              </div>
              <div className="space-y-2">
                <div className="w-24 h-4 bg-muted rounded animate-pulse"></div>
                <div className="w-16 h-3 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-16 h-8 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200/50 dark:border-red-700/30 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚠️</span>
              </div>
              <div>
                <CardTitle className="text-red-800 dark:text-red-200 text-base">
                  도미넌스 로딩 실패
                </CardTitle>
                <CardDescription className="text-red-600 dark:text-red-300">
                  {error}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={fetchBtcDominance}
            >
              재시도
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="w-full bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 border-orange-200/50 dark:border-orange-700/30 shadow-lg backdrop-blur-sm mb-6">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 아이콘과 제목 */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">₿</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg">
                <div className="w-full h-full bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <CardTitle className="text-lg bg-gradient-to-r from-orange-700 to-amber-600 dark:from-orange-300 dark:to-amber-200 bg-clip-text text-transparent">
                비트코인 도미넌스
              </CardTitle>
              <CardDescription className="text-orange-600 dark:text-orange-300 font-medium">
                전체 암호화폐 시가총액 대비 BTC 비중
              </CardDescription>
            </div>
          </div>

          {/* 오른쪽: 도미넌스 수치와 업데이트 시간 */}
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
              {data.dominance.toFixed(2)}%
            </div>
            <div className="text-xs text-orange-500 dark:text-orange-400 mt-1">
              {new Date(data.timestamp).toLocaleString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })} 업데이트
            </div>
          </div>
        </div>

        {/* 하단: 도미넌스 설명 */}
        <div className="mt-4 pt-3 border-t border-orange-200/50 dark:border-orange-700/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-orange-600 dark:text-orange-300 font-medium">
              💡 도미넌스가 높을수록 비트코인이 시장을 주도
            </span>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                실시간
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}