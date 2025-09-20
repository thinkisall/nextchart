import { NextResponse } from 'next/server';

// 바이낸스 API에서 받은 티커 데이터의 타입을 정의합니다.
interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
}

// 클라이언트에 보낼 데이터 타입
export interface BinanceTopGainer {
  symbol: string;
  baseAsset: string;
  priceChangePercent: number;
  lastPrice: number;
  volume: number;
  quoteVolume: number;
  rank: number;
}

// GET 요청을 처리하는 API 라우트 핸들러
export async function GET() {
  // 바이낸스의 24시간 가격 변동 통계 API 엔드포인트
  const API_URL = 'https://api.binance.com/api/v3/ticker/24hr';
  
  try {
    // API 호출 (Next.js의 확장된 fetch 사용)
    const response = await fetch(API_URL, {
      // 5분마다 데이터를 새로고침하도록 캐시 설정
      next: {
        revalidate: 300, // 300초 (5분)
      },
    });

    if (!response.ok) {
      // API 응답이 실패한 경우 에러를 발생시킵니다.
      throw new Error(`바이낸스 API 오류: ${response.statusText}`);
    }

    // JSON 형태로 데이터를 파싱합니다.
    const tickers: BinanceTicker[] = await response.json();

    // 1. USDT 마켓 필터링: USDT로 거래되는 페어만 대상으로 합니다.
    // 2. 최소 거래량 필터링: 너무 작은 거래량 제외
    // 3. 데이터 정렬: priceChangePercent를 숫자형으로 변환하여 내림차순으로 정렬합니다.
    const filteredAndSorted = tickers
      .filter(ticker => {
        const isUSDTPair = ticker.symbol.endsWith('USDT');
        const volume = parseFloat(ticker.quoteVolume);
        const changePercent = parseFloat(ticker.priceChangePercent);
        
        // USDT 페어이고, 거래량이 100만 USDT 이상이며, 변동률이 양수인 것만
        return isUSDTPair && volume >= 1000000 && changePercent > 0;
      })
      .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent));

    // 4. 상위 10개 추출 및 데이터 가공
    const top10Gainers: BinanceTopGainer[] = filteredAndSorted
      .slice(0, 10)
      .map((ticker, index) => {
        // USDT 제거하여 기본 자산명 추출
        const baseAsset = ticker.symbol.replace('USDT', '');
        
        return {
          symbol: ticker.symbol,
          baseAsset,
          priceChangePercent: parseFloat(ticker.priceChangePercent),
          lastPrice: parseFloat(ticker.lastPrice),
          volume: parseFloat(ticker.volume),
          quoteVolume: parseFloat(ticker.quoteVolume),
          rank: index + 1,
        };
      });
    
    // 최종 결과를 JSON 형태로 반환합니다.
    return NextResponse.json({
      data: top10Gainers,
      timestamp: new Date().toISOString(),
      source: 'Binance API',
    });
    
  } catch (error) {
    console.error('Binance API Error:', error);
    const errorMessage = error instanceof Error ? error.message : '바이낸스 데이터를 불러올 수 없습니다.';
    // 에러 발생 시 500 상태 코드와 함께 에러 메시지를 반환합니다.
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
