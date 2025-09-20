import { NextRequest, NextResponse } from 'next/server';

// 데이터를 가져오는 비동기 함수
async function getBtcDominance() {
  // .env.local 파일에서 API 키를 안전하게 불러옵니다.
  const apiKey = process.env.CMC_PRO_API_KEY;
  if (!apiKey) {
    throw new Error('CoinMarketCap API 키가 설정되지 않았습니다.');
  }

  // CoinMarketCap 글로벌 메트릭 API 엔드포인트
  const API_URL = 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest';

  try {
    // API 호출
    const response = await fetch(API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
      next: {
        revalidate: 3600, // 1시간 캐시
      },
    });

    // 응답이 성공적이지 않으면 에러 발생
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API 오류: ${errorData.status?.error_message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // 비트코인 도미넌스 값 추출
    const btcDominance: number = data.data.btc_dominance;
    // 마지막 업데이트 시간 추출
    const lastUpdated: string = data.data.last_updated;

    return {
      dominance: btcDominance,
      timestamp: lastUpdated,
    };
  } catch (error) {
    console.error('BTC Dominance API Error:', error);
    
    // 에러 발생 시 에러 메시지를 반환
    if (error instanceof Error) {
      throw new Error(error.message || '데이터를 가져오는 중 알 수 없는 오류가 발생했습니다.');
    }
    throw new Error('데이터를 가져오는 중 알 수 없는 오류가 발생했습니다.');
  }
}

export async function GET(request: NextRequest) {
  try {
    const { dominance, timestamp } = await getBtcDominance();
    
    return NextResponse.json(
      {
        dominance,
        timestamp,
        success: true
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    console.error('API Route Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    
    return NextResponse.json(
      {
        error: errorMessage,
        success: false
      },
      { status: 500 }
    );
  }
}
