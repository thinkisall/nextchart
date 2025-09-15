import { NextRequest, NextResponse } from 'next/server';

// 메모리 캐시
let cachedData: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30 * 1000; // 30초 캐시

// 빗썸 API 프록시 엔드포인트 (캐싱 적용)
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
        'Cache-Control': 'public, max-age=30, s-maxage=30', // 30초 캐시
      },
    });
  }
  
  try {
    const response = await fetch('https://api.bithumb.com/public/ticker/ALL_KRW', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Bithumb API response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // 응답 크기 최적화 - 불필요한 필드 제거
    if (data && data.data) {
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
      
      console.log('✅ Bithumb API data cached, status:', optimizedData.status);
      
      return NextResponse.json(optimizedData, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Cache-Control': 'public, max-age=30, s-maxage=30', // 30초 캐시
          'Content-Encoding': 'gzip', // gzip 압축 힌트
        },
      });
    }

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Error fetching Bithumb data:', error);
    
    // 캐시된 데이터가 있으면 그것을 반환 (stale-while-revalidate 패턴)
    if (cachedData) {
      console.log('📋 Returning stale cached data due to error');
      return NextResponse.json(cachedData, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300', // 오류시 더 긴 캐시
        },
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch crypto data' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}