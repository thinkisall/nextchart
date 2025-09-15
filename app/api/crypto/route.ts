import { NextRequest, NextResponse } from 'next/server';

// 메모리 캐시
let cachedData: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30 * 1000; // 30초 캐시

// 건강성 체크를 위한 변수
let consecutiveFailures = 0;
const MAX_CONSECUTIVE_FAILURES = 3;

// Mock 데이터 (빗썸 API 실패 시 fallback)
const getMockData = () => ({
  status: "0000",
  data: {
    BTC: {
      opening_price: "95000000",
      closing_price: "96500000",
      min_price: "94800000", 
      max_price: "97200000",
      units_traded_24H: "2500.12345678",
      acc_trade_value_24H: "241250000000",
      fluctate_24H: "1500000",
      fluctate_rate_24H: "1.58"
    },
    ETH: {
      opening_price: "3200000",
      closing_price: "3250000", 
      min_price: "3180000",
      max_price: "3280000",
      units_traded_24H: "15000.12345678",
      acc_trade_value_24H: "48750000000",
      fluctate_24H: "50000",
      fluctate_rate_24H: "1.56"
    },
    date: Date.now().toString()
  }
});

// 안전한 fetch 함수
async function safeFetch(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  
  // 타임아웃 설정
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 8000); // 8초 타임아웃
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// 빗썸 API 프록시 엔드포인트 (강화된 에러 핸들링)
export async function GET() {
  console.log('🔗 /api/crypto called at:', new Date().toLocaleTimeString());
  
  // 캐시 확인
  const now = Date.now();
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📋 Returning cached data');
    return NextResponse.json(cachedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    });
  }
  
  try {
    console.log('📡 Fetching from Bithumb API...');
    
    const response = await safeFetch('https://api.bithumb.com/public/ticker/ALL_KRW', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextChart/1.0',
      },
    });

    console.log('📡 Bithumb API response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
    }

    const data = await response.json();
    
    // 데이터 유효성 검사
    if (!data || !data.data) {
      throw new Error('Invalid response format from Bithumb API');
    }
    
    // 응답 크기 최적화
    const optimizedData: any = {
      status: data.status,
      data: {}
    };
    
    // date 필드 유지
    if (data.data.date) {
      optimizedData.data.date = data.data.date;
    }
    
    // 각 코인 데이터에서 필수 필드만 유지
    Object.keys(data.data).forEach(key => {
      if (key !== 'date' && typeof data.data[key] === 'object') {
        optimizedData.data[key] = {
          opening_price: data.data[key].opening_price,
          closing_price: data.data[key].closing_price,
          min_price: data.data[key].min_price,
          max_price: data.data[key].max_price,
          units_traded_24H: data.data[key].units_traded_24H,
          acc_trade_value_24H: data.data[key].acc_trade_value_24H,
          fluctate_24H: data.data[key].fluctate_24H,
          fluctate_rate_24H: data.data[key].fluctate_rate_24H,
        };
      }
    });
    
    // 캐시 업데이트
    cachedData = optimizedData;
    cacheTimestamp = now;
    consecutiveFailures = 0; // 성공 시 실패 카운터 리셋
    
    console.log('✅ Bithumb API data cached successfully, status:', optimizedData.status);
    
    return NextResponse.json(optimizedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    });
    
  } catch (error) {
    consecutiveFailures++;
    
    console.error('❌ Error fetching Bithumb data:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      consecutiveFailures,
      timestamp: new Date().toISOString(),
    });
    
    // 캐시된 데이터가 있고 실패 횟수가 적으면 캐시 반환
    if (cachedData && consecutiveFailures < MAX_CONSECUTIVE_FAILURES) {
      console.log('📋 Returning stale cached data due to error');
      return NextResponse.json(cachedData, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
          'X-Data-Source': 'cache-fallback',
        },
      });
    }
    
    // 연속 실패가 많거나 캐시가 없으면 Mock 데이터 반환
    if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES || !cachedData) {
      console.log('🔄 Returning mock data due to API failure');
      const mockData = getMockData();
      
      return NextResponse.json(mockData, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=10, s-maxage=10', // 짧은 캐시
          'X-Data-Source': 'mock-fallback',
        },
      });
    }
    
    // 최악의 경우 에러 응답
    return NextResponse.json(
      { 
        error: 'Failed to fetch crypto data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        fallbackAvailable: !!cachedData
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

// OPTIONS 메서드 지원 (CORS 프리플라이트)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
