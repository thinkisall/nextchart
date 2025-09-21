"use client";

import { useState, useMemo } from 'react';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { useCryptoData } from '../../../features/crypto/hooks/useCryptoData';

// shadcn/ui imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';

interface ChartGridProps {
  className?: string;
}

export function ChartGrid({ className = "" }: ChartGridProps) {
  const { primaryData } = useCryptoData();

  // 실시간 데이터를 기반으로 차트 데이터 생성
  const chartData = useMemo(() => {
    if (!primaryData || primaryData.length === 0) {
      return null;
    }

    // 상위 10개 코인 선별 (거래량 기준)
    const topCoins = primaryData
      .sort((a, b) => (b.volume || 0) - (a.volume || 0))
      .slice(0, 10);

    // 거래소별 분류
    const exchanges = ['upbit', 'bithumb', 'binance', 'upbitUsdt'];
    const exchangeData = exchanges.map(exchange => {
      const coins = primaryData.filter(coin => {
        switch(exchange) {
          case 'upbit':
            return coin.isOnUpbit && !coin.symbol.includes('USDT');
          case 'bithumb':
            return coin.isOnBithumb;
          case 'binance':
            return coin.isOnBinance;
          case 'upbitUsdt':
            return coin.isOnUpbit && coin.symbol.includes('USDT');
          default:
            return false;
        }
      });
      
      const totalVolume = coins.reduce((sum, coin) => sum + (coin.volume || 0), 0);
      return {
        exchange: exchange === 'upbitUsdt' ? '업비트USDT' : 
                 exchange === 'upbit' ? '업비트' :
                 exchange === 'bithumb' ? '빗썸' : '바이낸스',
        volume: Math.round(totalVolume / 100000000) // 억원 단위
      };
    });

    // 변동률 기준 상위/하위 분석
    const positiveCoins = primaryData.filter(coin => coin.change_rate > 0);
    const negativeCoins = primaryData.filter(coin => coin.change_rate < 0);

    // 시가총액 분포 (상위 5개)
    const marketCapData = topCoins.slice(0, 5).map(coin => ({
      name: coin.korean_name || coin.symbol,
      value: Math.round((coin.market_cap || 0) / 1000000000) // 조원 단위
    }));

    return {
      topCoins,
      exchangeData,
      marketStats: {
        positive: positiveCoins.length,
        negative: negativeCoins.length,
        totalVolume: Math.round(primaryData.reduce((sum, coin) => sum + (coin.volume || 0), 0) / 100000000),
        avgChange: primaryData.reduce((sum, coin) => sum + coin.change_rate, 0) / primaryData.length
      },
      marketCapData
    };
  }, [primaryData]);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card>
          <CardContent className="px-8 py-12 text-center">
            <div className="text-muted-foreground text-lg mb-2">📊</div>
            <p className="text-muted-foreground">실시간 데이터 로딩 중...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 실시간 라인 차트 데이터 (가격 기반)
  const lineChartData = {
    labels: chartData.topCoins.slice(0, 6).map(coin => coin.korean_name || coin.symbol),
    datasets: [
      {
        label: '현재 가격 (원)',
        data: chartData.topCoins.slice(0, 6).map(coin => coin.current_price),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  // 거래소별 거래량 차트 데이터
  const barChartData = {
    labels: chartData.exchangeData.map(item => item.exchange),
    datasets: [
      {
        label: '24시간 거래량 (억원)',
        data: chartData.exchangeData.map(item => item.volume),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)', 
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // 시가총액 분포 차트 데이터
  const pieChartData = {
    labels: chartData.marketCapData.map(item => item.name),
    datasets: [
      {
        data: chartData.marketCapData.map(item => item.value),
        backgroundColor: [
          '#FF6384',
          '#36A2EB', 
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56', 
          '#4BC0C0',
          '#9966FF',
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 실시간 요약 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 거래량</CardTitle>
            <Badge variant="secondary">24h</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{chartData.marketStats.totalVolume.toLocaleString()}억</div>
            <p className="text-xs text-muted-foreground">
              <span className={chartData.marketStats.avgChange > 0 ? "text-green-600" : "text-red-600"}>
                {chartData.marketStats.avgChange > 0 ? '+' : ''}{chartData.marketStats.avgChange.toFixed(2)}%
              </span> 평균 변동률
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">상승 종목</CardTitle>
            <Badge variant="secondary">실시간</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{chartData.marketStats.positive}</div>
            <p className="text-xs text-muted-foreground">
              전체 {primaryData.length}개 중 <span className="text-green-600">{Math.round((chartData.marketStats.positive / primaryData.length) * 100)}%</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">하락 종목</CardTitle>
            <Badge variant="secondary">실시간</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{chartData.marketStats.negative}</div>
            <p className="text-xs text-muted-foreground">
              전체 {primaryData.length}개 중 <span className="text-red-600">{Math.round((chartData.marketStats.negative / primaryData.length) * 100)}%</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">시장 상태</CardTitle>
            <Badge variant="secondary">LIVE</Badge>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              chartData.marketStats.positive > chartData.marketStats.negative ? 'text-green-600' : 'text-red-600'
            }`}>
              {chartData.marketStats.positive > chartData.marketStats.negative ? '강세' : '약세'}
            </div>
            <p className="text-xs text-muted-foreground">
              {chartData.marketStats.positive > chartData.marketStats.negative ? '상승' : '하락'} 우세
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 실시간 차트 탭 */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="overview">📈 실시간</TabsTrigger>
            <TabsTrigger value="line">📊 가격</TabsTrigger>
            <TabsTrigger value="bar">📊 거래량</TabsTrigger>
            <TabsTrigger value="pie">🥧 시가총액</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              🔴 LIVE
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* 실시간 개요 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart
              title="실시간 코인 가격"
              description="상위 6개 코인 현재 가격"
              data={lineChartData}
              showBadge={true}
              badgeText="LIVE"
            />
            <BarChart
              title="거래소별 거래량"
              description="24시간 실제 거래량 비교"
              data={barChartData}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>실시간 시장 동향</CardTitle>
                  <CardDescription>
                    현재 시각: {new Date().toLocaleString()} 기준
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-600">상승 종목</div>
                      <div className="text-muted-foreground">
                        {chartData.marketStats.positive}개 ({Math.round((chartData.marketStats.positive / primaryData.length) * 100)}%)
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-red-600">하락 종목</div>
                      <div className="text-muted-foreground">
                        {chartData.marketStats.negative}개 ({Math.round((chartData.marketStats.negative / primaryData.length) * 100)}%)
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">평균 변동률</div>
                      <div className={chartData.marketStats.avgChange > 0 ? "text-green-600" : "text-red-600"}>
                        {chartData.marketStats.avgChange > 0 ? '+' : ''}{chartData.marketStats.avgChange.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">총 거래량</div>
                      <div className="text-blue-600">₩{chartData.marketStats.totalVolume.toLocaleString()}억</div>
                    </div>
                  </div>

                  {/* 상위 종목 리스트 */}
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">오늘의 상위 종목</h4>
                    <div className="space-y-2">
                      {chartData.topCoins.slice(0, 5).map((coin, index) => (
                        <div key={coin.symbol} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                            <span className="font-medium">{coin.korean_name || coin.symbol}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₩{coin.current_price.toLocaleString()}</div>
                            <div className={`text-xs ${coin.change_rate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {coin.change_rate > 0 ? '+' : ''}{coin.change_rate.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <PieChart
              title="시가총액 분포"
              description="상위 5개 코인 (실시간)"
              data={pieChartData}
              height={250}
            />
          </div>
        </TabsContent>

        <TabsContent value="line" className="space-y-6">
          <LineChart
            title="실시간 코인 가격"
            description="상위 코인들의 현재 가격 비교"
            data={lineChartData}
            showBadge={true}
            badgeText="실시간"
            height={500}
          />
        </TabsContent>

        <TabsContent value="bar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              title="거래소별 거래량 (세로)"
              description="24시간 실제 거래량"
              data={barChartData}
              orientation="vertical"
              height={400}
            />
            <BarChart
              title="거래소별 거래량 (가로)"
              description="24시간 실제 거래량"
              data={barChartData}
              orientation="horizontal"
              height={400}
            />
          </div>
        </TabsContent>

        <TabsContent value="pie" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChart
              title="시가총액 분포"
              description="상위 암호화폐 시가총액 비율 (실시간)"
              data={pieChartData}
              height={400}
            />
            <Card>
              <CardHeader>
                <CardTitle>시가총액 상세</CardTitle>
                <CardDescription>실시간 시가총액 정보</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chartData.marketCapData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: pieChartData.datasets[0].backgroundColor[index] }}
                        ></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₩{item.value.toLocaleString()}조</div>
                        <div className="text-xs text-muted-foreground">
                          {((item.value / chartData.marketCapData.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}