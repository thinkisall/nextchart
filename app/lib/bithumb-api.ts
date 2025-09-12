import { BithumbTickerResponse, BithumbTickerData, MarketData, CryptoPrice } from './types';
import { CRYPTO_KOREAN_NAMES, getCryptoInfo } from './crypto';

// 바이낸스 알파와 빗썸에서 겹치는 코인들
const BINANCE_ALPHA_COINS = new Set([
  'AERO', 'ATH', 'AVAIL', 'AVL', 'B3', 'BIGTIME', 'BLUE', 'BMT', 'C', 'CARV', 
  'COOKIE', 'DRIFT', 'EPT', 'ERA', 'F', 'FLOCK', 'G', 'GOAT', 'GRASS', 'H', 
  'HAEDAL', 'HOME', 'HUMA', 'HYPER', 'LA', 'LINEA', 'MERL', 'MEW', 'MLK', 
  'MOODENG', 'MORPHO', 'NEWT', 'NFT', 'NXPC', 'OBT', 'ONDO', 'OPEN', 'ORDER', 
  'PARTI', 'PEAQ', 'PLUME', 'POKT', 'PROMPT', 'PROVE', 'PUFFER', 'PUMP', 
  'PUMPBTC', 'RESOLV', 'SAFE', 'SAHARA', 'SD', 'SHELL', 'SIGN', 'SOON', 
  'SOPH', 'SPK', 'SUNDOG', 'SXT', 'SYRUP', 'TAIKO', 'TOWNS', 'TREE', 
  'VIRTUAL', 'XTER', 'ZETA', 'ZRC'
]);

// 바이낸스에서 거래되는 주요 코인들 (빗썸과 겹치는 코인들)
const BINANCE_COINS = new Set([
  '1INCH', 'A', 'AAVE', 'ACE', 'ACH', 'ACX', 'ADA', 'AGLD', 'ALGO', 'ALICE', 
  'ALT', 'AMP', 'ANIME', 'ANKR', 'APE', 'API3', 'APT', 'AR', 'ARB', 'ARDR', 
  'ARK', 'ARKM', 'ARPA', 'ASTR', 'ATOM', 'AUCTION', 'AUDIO', 'AVAX', 'AWE', 
  'AXS', 'BABY', 'BAT', 'BB', 'BCH', 'BEL', 'BERA', 'BICO', 'BIGTIME', 'BIO', 
  'BLUR', 'BMT', 'BNB', 'BNT', 'BONK', 'BTC', 'C', 'C98', 'CAKE', 'CELO', 
  'CELR', 'CFX', 'CHR', 'CHZ', 'CKB', 'COMP', 'COOKIE', 'COS', 'COTI', 'COW', 
  'CRV', 'CTK', 'CTSI', 'CVC', 'CYBER', 'D', 'DOGE', 'DOT', 'DYDX', 'EDU', 
  'EGLD', 'EIGEN', 'ENA', 'ENJ', 'ENS', 'ERA', 'ETC', 'ETH', 'ETHFI', 'FET', 
  'FIDA', 'FIL', 'FLOKI', 'FLOW', 'FLUX', 'FXS', 'G', 'GALA', 'GAS', 'GLM', 
  'GMT', 'GMX', 'GNO', 'GRT', 'GTC', 'HAEDAL', 'HBAR', 'HFT', 'HIGH', 'HIVE', 
  'HOME', 'HOOK', 'HUMA', 'HYPER', 'ICP', 'ICX', 'ID', 'ILV', 'IMX', 'INIT', 
  'INJ', 'IO', 'IOST', 'IOTA', 'IOTX', 'IQ', 'JASMY', 'JOE', 'JST', 'JTO', 
  'JUP', 'KAIA', 'KAITO', 'KAVA', 'KERNEL', 'KNC', 'KSM', 'LA', 'LAYER', 
  'LDO', 'LINEA', 'LINK', 'LISTA', 'LPT', 'LRC', 'LSK', 'MAGIC', 'MANA', 
  'MANTA', 'MASK', 'MAV', 'MBL', 'ME', 'METIS', 'MINA', 'MOVE', 'MTL', 
  'NEAR', 'NEIRO', 'NEO', 'NEWT', 'NIL', 'NMR', 'NXPC', 'OGN', 'OM', 'OMNI', 
  'ONDO', 'ONG', 'ONT', 'OP', 'OPEN', 'ORCA', 'OSMO', 'OXT', 'PARTI', 'PAXG', 
  'PENDLE', 'PENGU', 'PEPE', 'PLUME', 'POL', 'POLYX', 'POWR', 'PROVE', 'PUMP', 
  'PUNDIX', 'PYR', 'PYTH', 'QKC', 'QTUM', 'RAD', 'RAY', 'RED', 'REI', 'RENDER', 
  'REQ', 'RESOLV', 'REZ', 'RLC', 'RPL', 'RSR', 'RVN', 'S', 'SAHARA', 'SAND', 
  'SC', 'SCR', 'SEI', 'SFP', 'SHELL', 'SHIB', 'SIGN', 'SKL', 'SLF', 'SNX', 
  'SOL', 'SOLV', 'SOPH', 'SPK', 'STEEM', 'STG', 'STORJ', 'STRAX', 'STRK', 
  'STX', 'SUI', 'SUN', 'SUSHI', 'SXP', 'SXT', 'SYRUP', 'T', 'TFUEL', 'THE', 
  'THETA', 'TIA', 'TON', 'TOWNS', 'TREE', 'TRUMP', 'TRX', 'TURBO', 'UMA', 
  'UNI', 'USD1', 'USDC', 'USDT', 'VANA', 'VET', 'VIRTUAL', 'VTHO', 'W', 
  'WAXP', 'WCT', 'WIF', 'WLD', 'WLFI', 'WOO', 'XAI', 'XEC', 'XLM', 'XRP', 
  'XTZ', 'XVS', 'YFI', 'YGG', 'ZIL', 'ZK', 'ZRO', 'ZRX'
]);

// 업비트와 빗썸에서 겹치는 코인들
const UPBIT_COINS = new Set([
  '1INCH', 'A', 'AAVE', 'ADA', 'AERGO', 'AERO', 'AGLD', 'AHT', 'AKT', 'ALGO', 
  'ALT', 'ANIME', 'ANKR', 'API3', 'APT', 'AQT', 'ARB', 'ARDR', 'ARK', 'ARKM', 
  'ASTR', 'ATH', 'ATOM', 'AUCTION', 'AVAX', 'AWE', 'AXS', 'BAT', 'BCH', 'BEAM', 
  'BERA', 'BIGTIME', 'BLAST', 'BLUR', 'BONK', 'BORA', 'BOUNTY', 'BSV', 'BTC', 
  'BTT', 'CARV', 'CBK', 'CELO', 'CHZ', 'CKB', 'COMP', 'COW', 'CRO', 'CTC', 
  'CVC', 'CYBER', 'DEEP', 'DKA', 'DOGE', 'DOT', 'DRIFT', 'EGLD', 'ELF', 'ENA', 
  'ENS', 'ERA', 'ETC', 'ETH', 'FCT2', 'FIL', 'FLOCK', 'FLOW', 'G', 'GAME2', 
  'GAS', 'GLM', 'GMT', 'GRS', 'GRT', 'HBAR', 'HIVE', 'HP', 'HUNT', 'HYPER', 
  'ICX', 'ID', 'IMX', 'INJ', 'IOST', 'IOTA', 'IP', 'IQ', 'JST', 'JTO', 'JUP', 
  'KAITO', 'KAVA', 'KNC', 'LAYER', 'LINEA', 'LINK', 'LPT', 'LSK', 'MANA', 
  'MASK', 'MBL', 'ME', 'MED', 'META', 'MEW', 'MINA', 'MLK', 'MNT', 'MOC', 
  'MOCA', 'MOODENG', 'MOVE', 'MTL', 'MVL', 'NEAR', 'NEO', 'NEWT', 'NXPC', 
  'OM', 'OMNI', 'ONDO', 'ONG', 'ONT', 'OP', 'OPEN', 'ORBS', 'ORCA', 'PENDLE', 
  'PENGU', 'PEPE', 'POKT', 'POL', 'POLYX', 'POWR', 'PROVE', 'PUMP', 'PUNDIX', 
  'PYTH', 'QKC', 'QTUM', 'RAY', 'RED', 'RENDER', 'RVN', 'SAFE', 'SAHARA', 
  'SAND', 'SC', 'SEI', 'SHIB', 'SIGN', 'SNT', 'SOL', 'SONIC', 'SOPH', 'STEEM', 
  'STG', 'STORJ', 'STRAX', 'STX', 'SUI', 'SXP', 'SYRUP', 'T', 'TAIKO', 'TFUEL', 
  'THETA', 'TIA', 'TOKAMAK', 'TREE', 'TRUMP', 'TRX', 'TT', 'UNI', 'USD1', 
  'USDC', 'USDT', 'UXLINK', 'VANA', 'VET', 'VIRTUAL', 'VTHO', 'W', 'WAL', 
  'WAVES', 'WAXP', 'WCT', 'WLD', 'WLFI', 'XEC', 'XLM', 'XRP', 'XTZ', 'ZETA', 
  'ZIL', 'ZRO', 'ZRX'
]);

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
 * 전체 암호화폐 시세 조회 (간소화 버전)
 */
export async function getAllTickers(): Promise<CryptoPrice[]> {
  try {
    console.log('Fetching from:', BITHUMB_API_BASE);
    
    const response = await fetch(BITHUMB_API_BASE);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Expected JSON but received:', textResponse.substring(0, 200));
      throw new Error('Invalid response format: expected JSON');
    }
    
    const data: BithumbTickerResponse = await response.json();
    
    if (data.status !== '0000') {
      throw new Error(`API Error: ${data.error || 'Unknown error'}`);
    }

    const processedData = Object.entries(data.data)
      .filter(([symbol, ticker]) => symbol !== 'date' && typeof ticker === 'object')
      .map(([symbol, ticker]) => {
        const tickerData = ticker as BithumbTickerData;
        let currentPrice = parseFloat(tickerData.closing_price);
        const prevPrice = parseFloat(tickerData.prev_closing_price);
        
        if (!currentPrice || currentPrice === 0) {
          currentPrice = prevPrice;
        }
        
        if (!currentPrice || currentPrice <= 0) {
          return null;
        }
        
        const changeAmount = currentPrice - prevPrice;
        const changeRate = prevPrice !== 0 ? (changeAmount / prevPrice) * 100 : 0;

        const cryptoInfo = getCryptoInfo(symbol);
        const isOnBinance = BINANCE_COINS.has(symbol);
        const isBinanceAlpha = BINANCE_ALPHA_COINS.has(symbol);
        const isOnUpbit = UPBIT_COINS.has(symbol);
        
        return {
          symbol,
          korean_name: cryptoInfo.koreanName,
          english_name: symbol,
          current_price: currentPrice,
          change_rate: changeRate,
          change_amount: changeAmount,
          high_price: parseFloat(tickerData.max_price) || currentPrice,
          low_price: parseFloat(tickerData.min_price) || currentPrice,
          volume: parseFloat(tickerData.acc_trade_value_24H) || 0,
          is_positive: changeAmount >= 0,
          sector: cryptoInfo.sector,
          isOnBinance,
          binanceSymbol: isOnBinance ? `${symbol}USDT` : undefined,
          isBinanceAlpha,
          isOnUpbit,
          upbitSymbol: isOnUpbit ? `KRW-${symbol}` : undefined,
        };
      })
      .filter(crypto => crypto !== null && crypto!.current_price > 0)
      .sort((a, b) => b!.change_rate - a!.change_rate);
    
    console.log(`✅ Processed ${processedData.length} cryptocurrencies`);
    console.log(`📊 Binance coins: ${processedData.filter(c => c?.isOnBinance).length}`);
    console.log(`⭐ Alpha coins: ${processedData.filter(c => c?.isBinanceAlpha).length}`);
    console.log(`🔵 Upbit coins: ${processedData.filter(c => c?.isOnUpbit).length}`);
    
    return processedData as CryptoPrice[];
  } catch (error) {
    console.error('Error fetching all tickers:', error);
    return [];
  }
}

/**
 * 특정 심볼의 시세 조회
 */
export async function getTicker(symbol: string): Promise<CryptoPrice> {
  const allTickers = await getAllTickers();
  const ticker = allTickers.find(t => t.symbol === symbol);
  
  if (!ticker) {
    throw new Error(`Ticker not found for symbol: ${symbol}`);
  }
  
  return ticker;
}
