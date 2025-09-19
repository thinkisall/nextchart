import { NextRequest, NextResponse } from 'next/server';

// 메모리 캐시 (실시간 데이터를 위해 캐시 시간 단축)
let cachedData: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 1000; // 60초 캐시 (Fast Origin Transfer 절약)

// 건강성 체크를 위한 변수 (더 관대하게)
let consecutiveFailures = 0;
const MAX_CONSECUTIVE_FAILURES = 5;

// 재시도 설정
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1초

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
    DOGE: {
      opening_price: "150",
      closing_price: "155", 
      min_price: "148",
      max_price: "157",
      units_traded_24H: "50000000.12345678",
      acc_trade_value_24H: "7750000000",
      fluctate_24H: "5",
      fluctate_rate_24H: "3.33"
    },
    XRP: {
      opening_price: "650",
      closing_price: "670", 
      min_price: "645",
      max_price: "675",
      units_traded_24H: "30000000.12345678",
      acc_trade_value_24H: "20100000000",
      fluctate_24H: "20",
      fluctate_rate_24H: "3.08"
    },
    date: Date.now().toString()
  }
});

// 지연 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 안전한 fetch 함수 (재시도 로직 포함)
async function safeFetchWithRetry(url: string, options: RequestInit = {}, retryCount = 0): Promise<Response> {
  const controller = new AbortController();
  
  // 타임아웃 설정 (더 관대하게)
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 15000); // 15초 타임아웃
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'NextChart/1.0',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...options.headers,
      }
    });
    
    clearTimeout(timeoutId);
    
    // 서버 오류시 재시도
    if (!response.ok && retryCount < MAX_RETRIES) {
      console.log(`🔄 HTTP ${response.status} error, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
      await delay(RETRY_DELAY * (retryCount + 1)); // 지수 백오프
      return safeFetchWithRetry(url, options, retryCount + 1);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // 네트워크 오류시 재시도
    if (retryCount < MAX_RETRIES) {
      console.log(`🔄 Network error, retrying... (${retryCount + 1}/${MAX_RETRIES}):`, error);
      await delay(RETRY_DELAY * (retryCount + 1)); // 지수 백오프
      return safeFetchWithRetry(url, options, retryCount + 1);
    }
    
    throw error;
  }
}

// 빗썸 API 프록시 엔드포인트 (강화된 에러 핸들링)
export async function GET(request: NextRequest) {
  console.log('🔗 /api/crypto called at:', new Date().toLocaleTimeString());
  
  // URL에서 강제 새로고침 파라미터 확인
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get('refresh') === 'true';
  
  // 캐시 확인 (강제 새로고침이 아닌 경우만)
  const now = Date.now();
  if (!forceRefresh && cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📋 Returning cached data');
    return NextResponse.json(cachedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600', // Fast Origin Transfer 절약
        'X-Data-Source': 'cache',
        'X-Cache-Age': ((now - cacheTimestamp) / 1000).toFixed(1),
      },
    });
  }
  
  try {
    console.log('📡 Fetching from Bithumb API with retry logic...');
    
    const response = await safeFetchWithRetry('https://api.bithumb.com/public/ticker/ALL_KRW', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
        'Cache-Control': 'public, max-age=30, s-maxage=30', // 캐시 시간 단축
        'X-Data-Source': 'api',
        'X-Timestamp': now.toString(),
        'X-Fresh-Data': 'true',
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
          'Cache-Control': 'public, max-age=120, stale-while-revalidate=600',
          'X-Data-Source': 'cache-fallback',
          'X-Error-Count': consecutiveFailures.toString(),
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
          'Cache-Control': 'public, max-age=30, s-maxage=30', // 짧은 캐시
          'X-Data-Source': 'mock-fallback',
          'X-Error-Count': consecutiveFailures.toString(),
        },
      });
    }
    
    // 최악의 경우 에러 응답
    return NextResponse.json(
      { 
        error: 'Failed to fetch crypto data after retries',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        retries: MAX_RETRIES,
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
