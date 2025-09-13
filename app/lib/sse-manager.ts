import { BithumbTickerResponse, BithumbTickerData, CryptoPrice } from './types';
import { getCryptoInfo } from './crypto';

// 바이낸스 및 업비트 코인 목록 (간소화)
const BINANCE_COINS = new Set([
  "1INCH", "AAVE", "ADA", "ALGO", "ANKR", "ANT", "APE", "API3", "APT", "ARB", "ARKM", "ARPA", "ASTR", "ATA", "ATOM", "AVAX", "AXS", "BAKE", "BAL", "BAND", "BAT", "BCH", "BETA", "BLZ", "BNB", "BNT", "BTC", "BTT", "BURGER", "C98", "CAKE", "CELO", "CFX", "CHR", "CHZ", "CKB", "COMP", "COTI", "CRV", "CTK", "CTSI", "CVC", "DASH", "DENT", "DIA", "DOGE", "DOT", "DYDX", "EDU", "EGLD", "ENJ", "ENS", "EOS", "ETC", "ETH", "FET", "FIL", "FLOW", "FTM", "GALA", "GMT", "GMX", "GRT", "HBAR", "HFT", "HIFI", "HOT", "ICP", "ICX", "IMX", "INJ", "IOST", "IOTA", "JASMY", "JOE", "KAVA", "KLAY", "KNC", "LDO", "LINK", "LPT", "LRC", "LTC", "LUNA", "LUNC", "MAGIC", "MANA", "MASK", "MATIC", "MBL", "MINA", "MKR", "MTL", "NEAR", "NEO", "NFT", "NU", "OGN", "OMG", "ONE", "ONT", "OP", "ORDI", "PENDLE", "PEOPLE", "PEPE", "POLYX", "QTUM", "RAD", "RDNT", "REN", "REP", "RLC", "SAND", "SEI", "SFP", "SHIB", "SKL", "SNX", "SOL", "STEEM", "STG", "STORJ", "STX", "SUI", "SUSHI", "SXP", "THETA", "TIA", "TLM", "TRB", "TRX", "T", "UMA", "UNI", "USTC", "VET", "WAVES", "WLD", "WOO", "XEM", "XLM", "XRP", "XTZ", "YFI", "YGG", "ZEC", "ZEN", "ZIL", "ZRX"
]);

const BINANCE_ALPHA_COINS = new Set([
  "AERO", "ATH", "AVAIL", "ai16z", "AVL", "B3", "BLUE", "CARV", "DRIFT", "EPT", "F", "FLOCK", "G", "GOAT", "GRASS", "H", "MEW", "MLK", "MOODENG", "NFT", "OBT", "ORDER", "PEFFUR", "PEAQ", "PLUME", "POKT", "PROMPT", "PROVE", "PUMP", "PUMPBTC", "RESOLV", "SAFE", "SD", "SUNDOG", "TAIKO", "TOWNS", "XTER", "ZETA", "ZRC"
]);

const UPBIT_COINS = new Set([
  "1INCH", "AAVE", "ADA", "ADX", "AERGO", "AION", "ALGO", "ANKR", "ANT", "APE", "API3", "APT", "ARB", "ARKM", "ARPA", "ASTR", "ATA", "ATOM", "AVAX", "AXS", "BAKE", "BAL", "BAND", "BAT", "BCH", "BLZ", "BNT", "BTC", "BTG", "BTT", "BURGER", "C98", "CAKE", "CBK", "CELO", "CFX", "CHR", "CHZ", "CKB", "COMP", "COTI", "CRV", "CTK", "CTSI", "CVC", "DASH", "DENT", "DIA", "DNT", "DOGE", "DOT", "DYDX", "EDU", "EGLD", "ENJ", "ENS", "EOS", "ETC", "ETH", "ETHW", "FCT2", "FET", "FIL", "FLOW", "FTM", "GALA", "GMT", "GMX", "GRT", "HBAR", "HFT", "HIFI", "HIVE", "HOT", "HPO", "HUM", "ICP", "ICX", "IMX", "INJ", "IOST", "IOTA", "JASMY", "JOE", "JST", "KAVA", "KLAY", "KNC", "KSM", "LDO", "LINK", "LPT", "LRC", "LSK", "LTC", "LUNA", "LUNC", "MAGIC", "MANA", "MASK", "MATIC", "MBL", "MCO2", "META", "MINA", "MKR", "MLK", "MNT", "MOC", "MTL", "MX", "NEAR", "NEO", "NEON", "NFT", "NU", "NMR", "OGN", "OMG", "ONE", "ONT", "OP", "ORDI", "OXT", "PENDLE", "PEOPLE", "PEPE", "POLYX", "POWR", "PXP", "QTUM", "RAD", "RDNT", "REN", "REP", "RLC", "SAND", "SEI", "SFP", "SHIB", "SKL", "SNT", "SNX", "SOL", "SSX", "STEEM", "STG", "STORJ", "STRK", "STX", "SUI", "SUSHI", "SXP", "T", "THETA", "TIA", "TLM", "TONCOIN", "TRB", "TRX", "UMA", "UNI", "USTC", "VET", "WAVES", "WAXP", "WLD", "WOO", "XEC", "XEM", "XLM", "XRP", "XTZ", "YFI", "YGG", "ZEC", "ZEN", "ZIL", "ZRX"
]);

// 직접 빗썸 API 호출 함수
async function fetchBithumbData(): Promise<CryptoPrice[]> {
  try {
    console.log('🚀 Direct fetch from Bithumb API at:', new Date().toLocaleTimeString());
    
    const response = await fetch('https://api.bithumb.com/public/ticker/ALL_KRW', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BithumbTickerResponse = await response.json();
    
    if (data.status !== "0000") {
      throw new Error(`API Error: ${data.error || "Unknown error"}`);
    }

    const processedData = Object.entries(data.data)
      .filter(([symbol, ticker]) => symbol !== "date" && typeof ticker === "object")
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

        // 디버깅: 바이낸스 알파 코인 로그
        if (isBinanceAlpha) {
          console.log(`🔶 Binance Alpha coin detected: ${symbol} (${cryptoInfo.koreanName})`);
        }

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
      .filter((crypto) => crypto !== null && crypto!.current_price > 0)
      .sort((a, b) => b!.change_rate - a!.change_rate);

    console.log('✅ Processed', processedData.length, 'crypto items');
    return processedData as CryptoPrice[];
  } catch (error) {
    console.error('❌ Direct Bithumb fetch error:', error);
    return [];
  }
}

// SSE 연결 관리자
class SSEConnectionManager {
  private connections = new Set<ReadableStreamDefaultController>();
  private cleanupIntervals = new Map<ReadableStreamDefaultController, NodeJS.Timeout>();

  addConnection(controller: ReadableStreamDefaultController) {
    this.connections.add(controller);
  }

  removeConnection(controller: ReadableStreamDefaultController) {
    this.connections.delete(controller);
    const interval = this.cleanupIntervals.get(controller);
    if (interval) {
      clearInterval(interval);
      this.cleanupIntervals.delete(controller);
    }
  }

  addCleanupInterval(controller: ReadableStreamDefaultController, interval: NodeJS.Timeout) {
    this.cleanupIntervals.set(controller, interval);
  }

  broadcast(data: string) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    
    // 연결이 끊어진 컨트롤러들을 추적
    const failedConnections: ReadableStreamDefaultController[] = [];

    this.connections.forEach(controller => {
      try {
        controller.enqueue(encodedData);
      } catch (error) {
        // 연결이 끊어진 컨트롤러 기록
        failedConnections.push(controller);
      }
    });

    // 실패한 연결들 정리
    failedConnections.forEach(controller => {
      this.removeConnection(controller);
    });
  }

  getConnectionCount() {
    return this.connections.size;
  }

  cleanup() {
    this.connections.forEach(controller => {
      try {
        controller.close();
      } catch (error) {
        // 이미 닫힌 연결 무시
      }
    });
    
    this.cleanupIntervals.forEach(interval => {
      clearInterval(interval);
    });
    
    this.connections.clear();
    this.cleanupIntervals.clear();
  }
}

// 전역 SSE 연결 관리자
const sseManager = new SSEConnectionManager();

// 전역 데이터 페칭 (모든 연결에서 공유)
let globalFetchInterval: NodeJS.Timeout | null = null;
let lastFetchTime = 0;
const FETCH_COOLDOWN = 900; // 1초 쿨다운 (빠른 업데이트)

const startGlobalFetching = () => {
  if (globalFetchInterval) return;

  const fetchAndBroadcast = async () => {
    const now = Date.now();
    if (now - lastFetchTime < FETCH_COOLDOWN) return;
    
    try {
      // 직접 빗썸 API 호출 (내부 API 우회)
      const cryptoData = await fetchBithumbData();
      
      lastFetchTime = now;
      
      console.log('📡 Broadcasting data, count:', cryptoData.length, 'connections:', sseManager.getConnectionCount());
      
      // SSE 형식으로 데이터 브로드캐스트
      const sseData = `data: ${JSON.stringify(cryptoData)}\n\n`;
      sseManager.broadcast(sseData);
      
    } catch (error) {
      console.error('❌ Fetch error:', error);
      // Error handling - removed console.error for production
      const errorData = `data: ${JSON.stringify({ 
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })}\n\n`;
      sseManager.broadcast(errorData);
    }
  };

  // 즉시 첫 데이터 전송
  fetchAndBroadcast();
  
  // 1초마다 데이터 업데이트 (실시간성 향상)
  globalFetchInterval = setInterval(fetchAndBroadcast, 1000);
};

const stopGlobalFetching = () => {
  if (globalFetchInterval) {
    clearInterval(globalFetchInterval);
    globalFetchInterval = null;
  }
};

export { sseManager, startGlobalFetching, stopGlobalFetching };
