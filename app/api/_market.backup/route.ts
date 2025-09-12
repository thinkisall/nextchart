import { NextResponse } from 'next/server';

// 빗썸 마켓 코드 조회 API 프록시 엔드포인트
export async function GET() {
  try {
    const response = await fetch('https://api.bithumb.com/v1/market/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Market-Client/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching market codes from Bithumb API:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch market codes',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
