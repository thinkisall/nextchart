import { NextRequest, NextResponse } from 'next/server';

// 캐시를 위한 변수들
let cachedData: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

export async function GET(request: NextRequest) {
  try {
    // 캐시된 데이터가 유효한 경우 반환
    const now = Date.now();
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    // CoinGecko API 호출
    const response = await fetch('https://api.coingecko.com/api/v3/global', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-Crypto-App/1.0',
      },
      // 네트워크 오류를 대비해 타임아웃 설정
      signal: AbortSignal.timeout(10000), // 10초 타임아웃
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // 필요한 데이터만 추출
    const filteredData = {
      data: {
        market_cap_percentage: {
          btc: data.data.market_cap_percentage.btc,
          eth: data.data.market_cap_percentage.eth,
        },
        active_cryptocurrencies: data.data.active_cryptocurrencies,
        total_market_cap: {
          usd: data.data.total_market_cap.usd,
        },
        total_volume: {
          usd: data.data.total_volume.usd,
        },
      },
    };

    // 캐시 업데이트
    cachedData = filteredData;
    cacheTimestamp = now;

    return NextResponse.json(filteredData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });

  } catch (error) {
    console.error('CoinGecko API Error:', error);
    
    // 캐시된 데이터가 있으면 오래되어도 반환
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch global cryptocurrency data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
