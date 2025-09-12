import { BithumbTickerResponse, BithumbTickerData, MarketData, CryptoPrice } from './types';
import { CRYPTO_KOREAN_NAMES, getCryptoInfo } from './crypto';
import { findCommonCoins } from './binance-api';

// 빗썸 API 기본 URL - 환경별로 다른 URL 사용
const getApiBase = () => {
  // 서버 사이드에서는 절대 URL 필요
  if (typeof window === 'undefined') {
    // 프로덕션 환경에서는 실제 도메인 사용
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   `http://localhost:${process.env.PORT || 3000}`;
    return `${baseUrl}/api/crypto`;
  }
  // 클라이언트 사이드에서는 상대 URL 사용 가능
  return '/api/crypto';
};

const BITHUMB_API_BASE = getApiBase();

/**
 * 마켓 코드 조회 - 거래 가능한 모든 코인 목록
 */
export async function getMarketCodes(): Promise<MarketData[]> {
  try {
    const response = await fetch(BITHUMB_API_BASE);
    const data: BithumbTickerResponse = await response.json();
    
    if (data.status !== '0000') {
      throw new Error('Failed to fetch market data');
    }

    return Object.keys(data.data)
      .filter(key => key !== 'date')
      .map(symbol => {
        const cryptoInfo = getCryptoInfo(symbol);
        return {
          market: `${symbol}_KRW`,
          korean_name: cryptoInfo.koreanName,
          english_name: symbol,
        };
      });
  } catch (error) {
    console.error('Error fetching market codes:', error);
    return [];
  }
}

/**
 * 전체 암호화폐 시세 조회 (바이낸스 정보 포함)
 */
export async function getAllTickers(): Promise<CryptoPrice[]> {
  try {
    console.log('Fetching from:', BITHUMB_API_BASE);
    
    const response = await fetch(BITHUMB_API_BASE);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    console.log('Response content-type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Expected JSON but got:', textResponse.substring(0, 200));
      throw new Error(`Expected JSON response but got ${contentType}. Response: ${textResponse.substring(0, 100)}`);
    }
    
    const data: BithumbTickerResponse = await response.json();
    
    if (data.status !== '0000') {
      throw new Error('Failed to fetch ticker data');
    }

    // 빗썸 심볼 목록 추출
    const bithumbSymbols = Object.keys(data.data).filter(key => key !== 'date');
    
    // 바이낸스와 공통으로 거래되는 코인 정보 가져오기
    let commonCoinsMap: Map<string, string> = new Map();
    try {
      const bithumbSymbolsWithKRW = bithumbSymbols.map(symbol => `${symbol}_KRW`);
      console.log('🔍 Checking common coins for symbols:', bithumbSymbolsWithKRW.slice(0, 10));
      commonCoinsMap = await findCommonCoins(bithumbSymbolsWithKRW);
      console.log('📊 Common coins result:', commonCoinsMap.size, 'found');
      console.log('📋 First 10 common coins:', Array.from(commonCoinsMap.entries()).slice(0, 10));
    } catch (error) {
      console.error('❌ Error fetching Binance common coins, proceeding without Binance data:', error);
    }

    const processedData = Object.entries(data.data)
      .filter(([symbol, ticker]) => symbol !== 'date' && typeof ticker === 'object')
      .map(([symbol, ticker]) => {
        const tickerData = ticker as BithumbTickerData;
        let currentPrice = parseFloat(tickerData.closing_price);
        const prevPrice = parseFloat(tickerData.prev_closing_price);
        
        // closing_price가 0이거나 NaN이면 prev_closing_price 사용
        if (!currentPrice || currentPrice === 0) {
          currentPrice = prevPrice;
        }
        
        // 여전히 유효한 가격이 없으면 건너뛰기
        if (!currentPrice || currentPrice <= 0) {
          return null;
        }
        
        const changeAmount = currentPrice - prevPrice;
        const changeRate = prevPrice !== 0 ? (changeAmount / prevPrice) * 100 : 0;

        const cryptoInfo = getCryptoInfo(symbol);
        const symbolWithKRW = `${symbol}_KRW`;
        const isOnBinance = commonCoinsMap.has(symbolWithKRW);
        const binanceSymbol = commonCoinsMap.get(symbolWithKRW);
        
        return {
          symbol,
          korean_name: cryptoInfo.koreanName,
          english_name: symbol,
          current_price: currentPrice,
          change_rate: changeRate,
          change_amount: changeAmount,
          high_price: parseFloat(tickerData.max_price) || currentPrice,
          low_price: parseFloat(tickerData.min_price) || currentPrice,
          volume: parseFloat(tickerData.acc_trade_value_24H) || 0, // 24시간 거래금액
          is_positive: changeAmount >= 0,
          sector: cryptoInfo.sector,
          // 바이낸스 정보 추가
          isOnBinance,
          binanceSymbol,
        };
      })
      .filter(crypto => crypto !== null && crypto!.current_price > 0) // null과 가격이 0인 코인들은 제외
      .sort((a, b) => b!.change_rate - a!.change_rate); // 상승률 높은 순으로 정렬
    
    return processedData as CryptoPrice[];
  } catch (error) {
    console.error('Error fetching all tickers:', error);
    return [];
  }
}

/**
 * 특정 코인 시세 조회
 */
export async function getTicker(symbol: string): Promise<CryptoPrice | null> {
  try {
    const response = await fetch(`${BITHUMB_API_BASE}/ticker/${symbol}_KRW`);
    const data = await response.json();
    
    if (data.status !== '0000') {
      throw new Error(`Failed to fetch ticker for ${symbol}`);
    }

    const ticker = data.data;
    const currentPrice = parseFloat(ticker.closing_price);
    const prevPrice = parseFloat(ticker.prev_closing_price);
    const changeAmount = currentPrice - prevPrice;
    const changeRate = (changeAmount / prevPrice) * 100;

    return {
      symbol,
      korean_name: CRYPTO_KOREAN_NAMES[symbol] || symbol,
      english_name: symbol,
      current_price: currentPrice,
      change_rate: changeRate,
      change_amount: changeAmount,
      high_price: parseFloat(ticker.max_price),
      low_price: parseFloat(ticker.min_price),
      volume: parseFloat(ticker.acc_trade_value_24H), // 일관성을 위해 거래금액 사용
      is_positive: changeAmount >= 0,
    };
  } catch (error) {
    console.error(`Error fetching ticker for ${symbol}:`, error);
    return null;
  }
}
