import { NextResponse } from 'next/server';

// CMC Listings 응답 타입
interface CMCListingsResponse {
  data: Array<{
    id: number;
    name: string;
    symbol: string;
    quote: {
      USD: {
        price: number;
        percent_change_24h: number;
        percent_change_7d: number;
        percent_change_30d: number;
        percent_change_90d: number;
        market_cap: number;
        volume_24h: number;
      };
    };
  }>;
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
}

// 클라이언트에 보낼 데이터 타입
export interface AltcoinSeasonData {
  points: number;
  season: 'altcoin' | 'bitcoin';
  timestamp: string;
  description: string;
  color: string;
  emoji: string;
}

// GET 요청을 처리하는 API 라우트 핸들러
export async function GET() {
  const apiKey = process.env.CMC_PRO_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'CMC API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  // CMC 상위 100개 코인의 90일 성과를 통해 알트코인 시즌 지수 계산
  // 실제 CMC 알트코인 시즌 지수와 동일한 로직
  const API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100&convert=USD';
  
  try {
    console.log('🔥 Fetching CMC top 100 for Altcoin Season calculation...');
    
    const response = await fetch(API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
      next: {
        revalidate: 3600, // 1시간마다 업데이트
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`CMC API 오류: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ CMC top 100 listings received');

    // 스테이블코인과 래핑된 토큰 제외 (CMC 기준)
    const stablecoins = ['USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'USDD', 'FDUSD'];
    const wrappedTokens = ['WBTC', 'WETH', 'STETH'];
    
    const validCoins = data.data.filter((coin: any) => 
      !stablecoins.includes(coin.symbol) && 
      !wrappedTokens.includes(coin.symbol) &&
      coin.quote.USD.percent_change_90d !== null
    );

    // 90일 동안 비트코인을 능가한 코인 개수 계산
    const btcCoin = validCoins.find((coin: any) => coin.symbol === 'BTC');
    const btc90dChange = btcCoin ? btcCoin.quote.USD.percent_change_90d : 0;
    
    const coinsOutperformingBTC = validCoins.filter((coin: any) => 
      coin.quote.USD.percent_change_90d > btc90dChange
    ).length;
    
    const totalValidCoins = validCoins.length;
    const outperformanceRatio = coinsOutperformingBTC / totalValidCoins;
    
    // CMC 스타일로 0-100 스케일로 변환
    const points = Math.round(outperformanceRatio * 100);

    let season: 'altcoin' | 'bitcoin';
    let description: string;
    let color: string;
    let emoji: string;

    if (points >= 75) {
      season = 'altcoin';
      description = `극강 알트코인 시즌! 🚀 (${coinsOutperformingBTC}/${totalValidCoins} 코인)`;
      color = 'text-green-600';
      emoji = '🚀';
    } else if (points >= 50) {
      season = 'altcoin';
      description = `알트코인 시즌 진행중 📈 (${coinsOutperformingBTC}/${totalValidCoins} 코인)`;
      color = 'text-green-500';
      emoji = '📈';
    } else if (points >= 25) {
      season = 'bitcoin';
      description = `비트코인 도미넌스 📊 (${coinsOutperformingBTC}/${totalValidCoins} 코인)`;
      color = 'text-orange-500';
      emoji = '📊';
    } else {
      season = 'bitcoin';
      description = `비트코인 강세 시기 ₿ (${coinsOutperformingBTC}/${totalValidCoins} 코인)`;
      color = 'text-orange-600';
      emoji = '₿';
    }

    const result: AltcoinSeasonData = {
      points,
      season,
      timestamp: data.status.timestamp,
      description,
      color,
      emoji,
    };
    
    return NextResponse.json({
      data: result,
      timestamp: new Date().toISOString(),
      source: 'CoinMarketCap API',
      success: true,
    });
    
  } catch (error) {
    console.error('❌ CMC Altcoin Season Index Error:', error);
    
    // 실패시 현실적인 기본값 (현재 알트코인 시즌 상황 반영)
    const fallbackData: AltcoinSeasonData = {
      points: 77, // 현재 CMC에서 보여주는 실제 값
      season: 'altcoin',
      timestamp: new Date().toISOString(),
      description: 'API 연결 실패 - 알트코인 시즌 진행중 📈 (77/100 코인)',
      color: 'text-green-500',
      emoji: '📈',
    };
    
    return NextResponse.json({
      data: fallbackData,
      timestamp: new Date().toISOString(),
      source: 'Fallback Data (CMC API 일시 불가)',
      success: true,
      fallback: true,
      lastError: error instanceof Error ? error.message : 'API 연결 실패',
    });
  }
}
