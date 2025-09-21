/**
 * CoinGecko API 서비스
 * 트렌딩 데이터 및 기타 마켓 정보를 가져옵니다.
 */

// 프로덕션에서는 내부 API 사용, 개발에서는 직접 호출 가능
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : '/api';

// API 요청 유틸리티 함수
async function apiRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Accept': 'application/json',
    },
    // 캐싱 설정 (5분)
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * 트렌딩 데이터 조회
 * 최근 24시간 가장 인기 있는 코인, NFT, 카테고리 정보
 */
export async function getTrendingData() {
  try {
    const response = await apiRequest<{
      success: boolean;
      data: CoinGeckoTrendingResponse | null;
      error?: string;
      timestamp: string;
    }>('/trending');
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
        timestamp: response.timestamp
      };
    } else {
      return {
        success: false,
        error: response.error || 'Failed to fetch trending data',
        data: null,
        timestamp: response.timestamp
      };
    }
  } catch (error) {
    console.error('Failed to fetch trending data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * 글로벌 마켓 데이터 조회
 */
export async function getGlobalMarketData() {
  try {
    const data = await apiRequest<CoinGeckoGlobalResponse>('/global');
    return {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch global market data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
      timestamp: new Date().toISOString()
    };
  }
}
/**
 * CoinGecko API 응답 타입 정의
 */

// 트렌딩 코인 타입
export interface TrendingCoin {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
}

// 트렌딩 NFT 타입
export interface TrendingNFT {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  nft_contract_id: number;
  native_currency_symbol: string;
  floor_price_in_native_currency: number;
  floor_price_24h_percentage_change: number;
}

// 트렌딩 카테고리 타입
export interface TrendingCategory {
  id: number;
  name: string;
  market_cap_1h_change: number;
  slug: string;
  coins_count: number;
  data: {
    market_cap: number;
    market_cap_btc: number;
    total_volume: number;
    total_volume_btc: number;
    market_cap_change_percentage_24h: {
      [currency: string]: number;
    };
    spark_line: string;
  };
}

// CoinGecko 트렌딩 API 응답
export interface CoinGeckoTrendingResponse {
  coins: {
    item: TrendingCoin;
  }[];
  nfts: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    nft_contract_id: number;
    native_currency_symbol: string;
    floor_price_in_native_currency: number;
    floor_price_24h_percentage_change: number;
  }[];
  categories: {
    id: number;
    name: string;
    market_cap_1h_change: number;
    slug: string;
    coins_count: number;
    data: {
      market_cap: number;
      market_cap_btc: number;
      total_volume: number;
      total_volume_btc: number;
      market_cap_change_percentage_24h: {
        [currency: string]: number;
      };
      spark_line: string;
    };
  }[];
}

// 글로벌 마켓 데이터 타입
export interface CoinGeckoGlobalResponse {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: {
      [currency: string]: number;
    };
    total_volume: {
      [currency: string]: number;
    };
    market_cap_percentage: {
      [currency: string]: number;
    };
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

// 처리된 트렌딩 데이터 타입
export interface ProcessedTrendingData {
  trendingCoins: TrendingCoin[];
  trendingNFTs: TrendingNFT[];
  trendingCategories: TrendingCategory[];
  lastUpdated: string;
}

// API 응답 래퍼 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  timestamp: string;
}
