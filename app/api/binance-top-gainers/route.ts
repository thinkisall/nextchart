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
    console.log('🔥 Fetching from Binance API:', API_URL);
    
    // 서버사이드에서 바이낸스 API 호출 (CORS 우회)
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Server/1.0',
      },
      // 5분마다 데이터를 새로고침하도록 캐시 설정
      next: {
        revalidate: 300, // 300초 (5분)
      },
    });

    if (!response.ok) {
      console.error('❌ Binance API response not ok:', response.status, response.statusText);
      throw new Error(`바이낸스 API 오류: ${response.status} ${response.statusText}`);
    }

    // JSON 형태로 데이터를 파싱합니다.
    const tickers: BinanceTicker[] = await response.json();
    console.log('✅ Binance API response received, total tickers:', tickers.length);

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

    console.log('✅ Filtered tickers:', filteredAndSorted.length);

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
    
    console.log('✅ Top 10 gainers processed successfully:', top10Gainers.map(g => `${g.baseAsset}: +${g.priceChangePercent.toFixed(1)}%`));
    
    // 최종 결과를 JSON 형태로 반환합니다.
    return NextResponse.json({
      data: top10Gainers,
      timestamp: new Date().toISOString(),
      source: 'Binance API',
      success: true,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
    
  } catch (error) {
    console.error('❌ Binance API Error:', error);
    
    // 구체적인 에러 메시지 제공
    let errorMessage = '바이낸스 데이터를 불러올 수 없습니다.';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage = '바이낸스 서버 응답 시간 초과';
        statusCode = 504;
      } else if (error.message.includes('network')) {
        errorMessage = '네트워크 연결 오류';
        statusCode = 503;
      } else if (error.message.includes('rate limit')) {
        errorMessage = '요청 한도 초과, 잠시 후 다시 시도해주세요';
        statusCode = 429;
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      success: false,
      timestamp: new Date().toISOString(),
    }, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }
}
