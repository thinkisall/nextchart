import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * CoinGecko 트렌딩 데이터 API 프록시
 * CORS 문제 해결을 위한 서버사이드 프록시
 */
export async function GET(request: NextRequest) {
  try {
    // CoinGecko API 호출
    const response = await fetch(`${COINGECKO_BASE_URL}/search/trending`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextChart/1.0',
      },
      // 5분 캐싱
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // 성공 응답
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      cached: false
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Trending API error:', error);
    
    // 에러 응답
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch trending data',
      data: null,
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
