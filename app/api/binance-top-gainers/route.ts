import { NextResponse } from 'next/server';

// 바이낸스 API에서 받은 티커 데이터의 타입을 정의합니다.
interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
}

// 클라이언트에 보낼 데이터 타입
export interface BinanceTopGainer {
  symbol: string;
  baseAsset: string;
  priceChangePercent: number;
  lastPrice: number;
  volume: number;
  quoteVolume: number;
  rank: number;
}

// 더미 데이터 (API 실패시 사용)
const FALLBACK_DATA: BinanceTopGainer[] = [
  { symbol: 'BTCUSDT', baseAsset: 'BTC', priceChangePercent: 5.2, lastPrice: 67000, volume: 15000, quoteVolume: 1005000000, rank: 1 },
  { symbol: 'ETHUSDT', baseAsset: 'ETH', priceChangePercent: 4.8, lastPrice: 3200, volume: 45000, quoteVolume: 144000000, rank: 2 },
  { symbol: 'SOLUSDT', baseAsset: 'SOL', priceChangePercent: 7.3, lastPrice: 145, volume: 120000, quoteVolume: 17400000, rank: 3 },
  { symbol: 'ADAUSDT', baseAsset: 'ADA', priceChangePercent: 6.1, lastPrice: 0.45, volume: 890000, quoteVolume: 400500, rank: 4 },
  { symbol: 'DOGEUSDT', baseAsset: 'DOGE', priceChangePercent: 9.2, lastPrice: 0.12, volume: 2100000, quoteVolume: 252000, rank: 5 },
  { symbol: 'XRPUSDT', baseAsset: 'XRP', priceChangePercent: 3.7, lastPrice: 0.58, volume: 780000, quoteVolume: 452400, rank: 6 },
  { symbol: 'AVAXUSDT', baseAsset: 'AVAX', priceChangePercent: 8.5, lastPrice: 28, volume: 340000, quoteVolume: 9520000, rank: 7 },
  { symbol: 'LINKUSDT', baseAsset: 'LINK', priceChangePercent: 4.2, lastPrice: 15.8, volume: 150000, quoteVolume: 2370000, rank: 8 },
  { symbol: 'DOTUSDT', baseAsset: 'DOT', priceChangePercent: 5.9, lastPrice: 6.2, volume: 280000, quoteVolume: 1736000, rank: 9 },
  { symbol: 'MATICUSDT', baseAsset: 'MATIC', priceChangePercent: 3.1, lastPrice: 0.78, volume: 520000, quoteVolume: 405600, rank: 10 },
];

// GET 요청을 처리하는 API 라우트 핸들러
export async function GET() {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    console.log('🔧 Development mode - using full API functionality');
  } else {
    console.log('🚀 Production mode - using optimized API calls');
  }
  
  // 바이낸스의 24시간 가격 변동 통계 API 엔드포인트들 (폴백 포함)
  const API_URLS = [
    'https://api.binance.com/api/v3/ticker/24hr',
    'https://api1.binance.com/api/v3/ticker/24hr',
    'https://api2.binance.com/api/v3/ticker/24hr',
    'https://api3.binance.com/api/v3/ticker/24hr',
  ];
  
  let lastError: Error | null = null;
  
  // 여러 API 엔드포인트 시도
  for (const API_URL of API_URLS) {
    try {
      console.log('🔥 Attempting to fetch from:', API_URL);
      
      // 서버사이드에서 바이낸스 API 호출 (CORS 우회)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
      
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 451) {
        console.warn(`⚠️ Legal restriction (451) from ${API_URL}, trying next endpoint...`);
        lastError = new Error(`법적 제한으로 인해 ${API_URL}에 접근할 수 없습니다`);
        continue;
      }

      if (!response.ok) {
        console.warn(`⚠️ API error ${response.status} from ${API_URL}, trying next endpoint...`);
        lastError = new Error(`API 오류: ${response.status} ${response.statusText}`);
        continue;
      }

      // JSON 형태로 데이터를 파싱합니다.
      const tickers: BinanceTicker[] = await response.json();
      console.log('✅ Binance API response received from', API_URL, ', total tickers:', tickers.length);

      // 데이터 처리
      const filteredAndSorted = tickers
        .filter(ticker => {
          const isUSDTPair = ticker.symbol.endsWith('USDT');
          const volume = parseFloat(ticker.quoteVolume);
          const changePercent = parseFloat(ticker.priceChangePercent);
          
          return isUSDTPair && volume >= 1000000 && changePercent > 0;
        })
        .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent));

      const top10Gainers: BinanceTopGainer[] = filteredAndSorted
        .slice(0, 10)
        .map((ticker, index) => {
          const baseAsset = ticker.symbol.replace('USDT', '');
          
          return {
            symbol: ticker.symbol,
            baseAsset,
            priceChangePercent: parseFloat(ticker.priceChangePercent),
            lastPrice: parseFloat(ticker.lastPrice),
            volume: parseFloat(ticker.volume),
            quoteVolume: parseFloat(ticker.quoteVolume),
            rank: index + 1,
          };
        });
      
      console.log('✅ Successfully processed top 10 gainers from', API_URL);
      
      return NextResponse.json({
        data: top10Gainers,
        timestamp: new Date().toISOString(),
        source: `Binance API (${new URL(API_URL).hostname})`,
        success: true,
      }, {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300',
        },
      });
      
    } catch (error) {
      console.warn(`⚠️ Error with ${API_URL}:`, error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          lastError = new Error(`Timeout: ${API_URL} 응답 시간 초과`);
        } else {
          lastError = error;
        }
      } else {
        lastError = new Error(`Unknown error with ${API_URL}`);
      }
      continue;
    }
  }
  
  // 모든 API 엔드포인트 실패시 폴백 데이터 사용
  console.warn('⚠️ All Binance API endpoints failed, using fallback data');
  console.warn('Last error details:', {
    message: lastError?.message,
    name: lastError?.name,
    stack: isDev ? lastError?.stack : undefined,
  });
  
  return NextResponse.json({
    data: FALLBACK_DATA,
    timestamp: new Date().toISOString(),
    source: 'Fallback Data (Binance API unavailable)',
    success: true,
    fallback: true,
    lastError: lastError?.message || 'All API endpoints failed',
  }, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    },
  });
}
