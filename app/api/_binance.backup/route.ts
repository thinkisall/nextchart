import { NextRequest, NextResponse } from 'next/server';

// 바이?�스 API ?�록??export async function GET() {
  try {const response = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-App'
      },
      // ?�버 ?�이?�에?�는 CORS 문제가 ?�음
    });

    if (!response.ok) {
      console.error('Binance API error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();// CORS ?�더 추�??�여 브라?��??�서 ?�근 가?�하?�록 ?�정
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

// CORS preflight ?�청 처리
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
