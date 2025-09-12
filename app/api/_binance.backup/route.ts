import { NextRequest, NextResponse } from 'next/server';

// Î∞îÏù¥?∏Ïä§ API ?ÑÎ°ù??export async function GET() {
  try {const response = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-App'
      },
      // ?úÎ≤Ñ ?¨Ïù¥?úÏóê?úÎäî CORS Î¨∏Ï†úÍ∞Ä ?ÜÏùå
    });

    if (!response.ok) {
      console.error('Binance API error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();// CORS ?§Îçî Ï∂îÍ??òÏó¨ Î∏åÎùº?∞Ï??êÏÑú ?ëÍ∑º Í∞Ä?•Ìïò?ÑÎ°ù ?§Ï†ï
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

// CORS preflight ?îÏ≤≠ Ï≤òÎ¶¨
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
