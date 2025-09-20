import { NextResponse } from 'next/server';

// CoinGecko API 응답 타입
interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  price_change_24h: number;
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

// GET 요청을 처리하는 API 라우트 핸들러
export async function GET() {
  const isDev = process.env.NODE_ENV === 'development';
  
  // CoinGecko API 사용 (무료이고 제한이 적음)
  const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h';
  
  try {
    console.log('🔥 Fetching from CoinGecko API:', API_URL);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15초 타임아웃
    
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('❌ CoinGecko API response not ok:', response.status, response.statusText);
      throw new Error(`CoinGecko API 오류: ${response.status} ${response.statusText}`);
    }

    const markets: CoinGeckoMarket[] = await response.json();
    console.log('✅ CoinGecko API response received, total coins:', markets.length);

    // 상승률이 양수인 코인들만 필터링하고 상위 10개 선택
    const topGainers = markets
      .filter(coin => coin.price_change_percentage_24h > 0)
      .slice(0, 10)
      .map((coin, index) => ({
        symbol: `${coin.symbol.toUpperCase()}USDT`,
        baseAsset: coin.symbol.toUpperCase(),
        priceChangePercent: coin.price_change_percentage_24h,
        lastPrice: coin.current_price,
        volume: coin.total_volume,
        quoteVolume: coin.total_volume * coin.current_price,
        rank: index + 1,
      }));
    
    console.log('✅ Successfully processed top 10 gainers from CoinGecko');
    
    return NextResponse.json({
      data: topGainers,
      timestamp: new Date().toISOString(),
      source: 'CoinGecko API',
      success: true,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
    
  } catch (error) {
    console.error('❌ CoinGecko API Error:', error);
    
    // CoinGecko 실패시 실제 암호화폐 기반 더미 데이터 사용
    const REALISTIC_FALLBACK: BinanceTopGainer[] = [
      { symbol: 'BTCUSDT', baseAsset: 'BTC', priceChangePercent: 4.2, lastPrice: 67500, volume: 18000, quoteVolume: 1215000000, rank: 1 },
      { symbol: 'ETHUSDT', baseAsset: 'ETH', priceChangePercent: 6.8, lastPrice: 3250, volume: 52000, quoteVolume: 169000000, rank: 2 },
      { symbol: 'SOLUSDT', baseAsset: 'SOL', priceChangePercent: 12.3, lastPrice: 148, volume: 145000, quoteVolume: 21460000, rank: 3 },
      { symbol: 'ADAUSDT', baseAsset: 'ADA', priceChangePercent: 8.7, lastPrice: 0.46, volume: 920000, quoteVolume: 423200, rank: 4 },
      { symbol: 'AVAXUSDT', baseAsset: 'AVAX', priceChangePercent: 15.2, lastPrice: 29.5, volume: 380000, quoteVolume: 11210000, rank: 5 },
      { symbol: 'DOGEUSDT', baseAsset: 'DOGE', priceChangePercent: 7.1, lastPrice: 0.125, volume: 2400000, quoteVolume: 300000, rank: 6 },
      { symbol: 'LINKUSDT', baseAsset: 'LINK', priceChangePercent: 5.9, lastPrice: 16.2, volume: 170000, quoteVolume: 2754000, rank: 7 },
      { symbol: 'XRPUSDT', baseAsset: 'XRP', priceChangePercent: 3.4, lastPrice: 0.59, volume: 850000, quoteVolume: 501500, rank: 8 },
      { symbol: 'DOTUSDT', baseAsset: 'DOT', priceChangePercent: 9.1, lastPrice: 6.5, volume: 310000, quoteVolume: 2015000, rank: 9 },
      { symbol: 'MATICUSDT', baseAsset: 'MATIC', priceChangePercent: 4.6, lastPrice: 0.82, volume: 580000, quoteVolume: 475600, rank: 10 },
    ];
    
    return NextResponse.json({
      data: REALISTIC_FALLBACK,
      timestamp: new Date().toISOString(),
      source: 'Fallback Data (실시간 API 일시 불가)',
      success: true,
      fallback: true,
      lastError: error instanceof Error ? error.message : 'API 연결 실패',
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    });
  }
}
