import { NextRequest, NextResponse } from 'next/server';

// 바이낸스 API 프록시
export async function GET() {
  try {
    console.log('Fetching Binance exchange info...');
    
    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-App'
      },
      // 서버 사이드에서는 CORS 문제가 없음
    });

    if (!response.ok) {
      console.error('Binance API error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.symbols?.length || 0} symbols from Binance`);

    // CORS 헤더 추가하여 브라우저에서 접근 가능하도록 설정
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Error proxying Binance API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Binance data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

// CORS preflight 요청 처리
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
