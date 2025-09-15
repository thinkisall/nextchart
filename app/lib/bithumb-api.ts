import {
  BithumbTickerResponse,
  BithumbTickerData,
  MarketData,
  CryptoPrice,
} from "./types";
import { CRYPTO_KOREAN_NAMES, getCryptoInfo } from "./crypto";

// 안전한 숫자 파싱 함수
function safeParseFloat(value: string | number | undefined | null, fallback: number = 0): number {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(parsed) && isFinite(parsed) ? parsed : fallback;
}

// 안전한 가격 데이터 검증 함수
function validatePriceData(tickerData: BithumbTickerData): boolean {
  const closingPrice = safeParseFloat(tickerData.closing_price);
  const prevPrice = safeParseFloat(tickerData.prev_closing_price);
  
  // 가격이 0보다 큰 경우만 유효
  return closingPrice > 0 || prevPrice > 0;
}

// 바이낸스 알파와 빗썸에서 겹치는 코인들
const BINANCE_ALPHA_COINS = new Set([
  "LINEA",
  "AERO",
  "ATH",
  "AVAIL",
  "ai16z",
  "AVL",
  "B3",
  "BLUE",
  "CARV",
  "DRIFT",
  "EPT",
  "F",
  "FLOCK",
  "G",
  "GOAT",
  "GRASS",
  "H",
  "MEW",
  "MOODENG",
  "NFT",
  "OBT",
  "ORDER",
  "PEFFUR",
  "PEAQ",
  "PLUME",
  "POKT",
  "PROMPT",
  "PROVE",
  "PUMP",
  "PUMPBTC",
  "RESOLV",
  "SAFE",
  "SD",
  "SUNDOG",
  "TAIKO",
  "TOWNS",
  "XTER",
  "ZETA",
  "ZRC",
]);

// 바이낸스에서 거래되는 주요 코인들 (빗썸과 겹치는 코인들)
const BINANCE_COINS = new Set([
  "1INCH",
  "A",
  "AAVE",
  "ACE",
  "ACH",
  "ACX",
  "ADA",
  "AGLD",
  "ALGO",
  "ALICE",
  "ALT",
  "AMP",
  "ANIME",
  "ANKR",
  "APE",
  "API3",
  "APT",
  "AR",
  "ARB",
  "ARDR",
  "ARK",
  "ARKM",
  "ARPA",
  "ASTR",
  "ATOM",
  "AUCTION",
  "AUDIO",
  "AVAX",
  "AWE",
  "AXS",
  "BABY",
  "BAT",
  "BB",
  "BCH",
  "BEL",
  "BERA",
  "BICO",
  "BIGTIME",
  "BIO",
  "BLUR",
  "BMT",
  "BNB",
  "BNT",
  "BONK",
  "BTC",
  "C",
  "C98",
  "CAKE",
  "CELO",
  "CELR",
  "CFX",
  "CHR",
  "CHZ",
  "CKB",
  "COMP",
  "COOKIE",
  "COS",
  "COTI",
  "COW",
  "CRV",
  "CTK",
  "CTSI",
  "CVC",
  "CYBER",
  "D",
  "DOGE",
  "DOT",
  "DYDX",
  "EDU",
  "EGLD",
  "EIGEN",
  "ENA",
  "ENJ",
  "ENS",
  "ERA",
  "ETC",
  "ETH",
  "ETHFI",
  "FET",
  "FIDA",
  "FIL",
  "FLOKI",
  "FLOW",
  "FLUX",
  "FXS",
  "G",
  "GALA",
  "GAS",
  "GLM",
  "GMT",
  "GMX",
  "GNO",
  "GRT",
  "GTC",
  "HAEDAL",
  "HBAR",
  "HFT",
  "HIGH",
  "HIVE",
  "HOME",
  "HOOK",
  "HUMA",
  "HYPER",
  "ICP",
  "ICX",
  "ID",
  "ILV",
  "IMX",
  "INIT",
  "INJ",
  "IO",
  "IOST",
  "IOTA",
  "IOTX",
  "IQ",
  "JASMY",
  "JOE",
  "JST",
  "JTO",
  "JUP",
  "KAIA",
  "KAITO",
  "KAVA",
  "KERNEL",
  "KNC",
  "KSM",
  "LA",
  "LAYER",
  "LDO",
  "LINEA",
  "LINK",
  "LISTA",
  "LPT",
  "LRC",
  "LSK",
  "MAGIC",
  "MANA",
  "MANTA",
  "MASK",
  "MAV",
  "MBL",
  "ME",
  "METIS",
  "MINA",
  "MOVE",
  "MTL",
  "NEAR",
  "NEIRO",
  "NEO",
  "NEWT",
  "NIL",
  "NMR",
  "NXPC",
  "OGN",
  "OM",
  "OMNI",
  "ONDO",
  "ONG",
  "ONT",
  "OP",
  "OPEN",
  "ORCA",
  "OSMO",
  "OXT",
  "PARTI",
  "PONKE",
  "PAXG",
  "PENDLE",
  "PENGU",
  "PEPE",
  "PLUME",
  "POL",
  "POLYX",
  "POWR",
  "PROVE",
  "PUMP",
  "PUNDIX",
  "PYR",
  "PYTH",
  "QKC",
  "QTUM",
  "RAD",
  "RAY",
  "RED",
  "REI",
  "RENDER",
  "REQ",
  "RESOLV",
  "REZ",
  "RLC",
  "RPL",
  "RSR",
  "RVN",
  "S",
  "SAHARA",
  "SAND",
  "SC",
  "SCR",
  "SEI",
  "SFP",
  "SHELL",
  "SHIB",
  "SIGN",
  "SKL",
  "SLF",
  "SNX",
  "SOL",
  "SOLV",
  "SOPH",
  "SPK",
  "STEEM",
  "STG",
  "STORJ",
  "STRAX",
  "STRK",
  "STX",
  "SUI",
  "SUN",
  "SUSHI",
  "SXP",
  "SXT",
  "SYRUP",
  "T",
  "TFUEL",
  "THE",
  "THETA",
  "TIA",
  "TON",
  "TOWNS",
  "TREE",
  "TRUMP",
  "TRX",
  "TURBO",
  "UMA",
  "UNI",
  "USD1",
  "USDC",
  "USDT",
  "VANA",
  "VET",
  "VIRTUAL",
  "VTHO",
  "W",
  "WAXP",
  "WCT",
  "WIF",
  "WLD",
  "WLFI",
  "WOO",
  "XAI",
  "XEC",
  "XLM",
  "XRP",
  "XTZ",
  "XVS",
  "YFI",
  "YGG",
  "ZIL",
  "ZK",
  "ZRO",
  "ZRX",
]);

// 업비트와 빗썸에서 겹치는 코인들
const UPBIT_COINS = new Set([
  "1INCH",
  "A",
  "AAVE",
  "ACS",
  "ADA",
  "AERGO",
  "AERO",
  "AGLD",
  "AHT",
  "AKT",
  "ALGO",
  "ALT",
  "ANIME",
  "ANKR",
  "APE",
  "API3",
  "APT",
  "AQT",
  "ARB",
  "ARDR",
  "ARK",
  "ARKM",
  "ARPA",
  "ASTR",
  "ATH",
  "ATOM",
  "AUCTION",
  "AUDIO",
  "AVAX",
  "AWE",
  "AXS",
  "BABY",
  "BAT",
  "BCH",
  "BEAM",
  "BERA",
  "BFC",
  "BIGTIME",
  "BLAST",
  "BLUR",
  "BNT",
  "BONK",
  "BORA",
  "BOUNTY",
  "BRETT",
  "BSV",
  "BTC",
  "BTT",
  "CARV",
  "CBK",
  "CELO",
  "CHR",
  "CHZ",
  "CKB",
  "COMP",
  "COW",
  "CRO",
  "CRV",
  "CTC",
  "CTSI",
  "CVC",
  "CYBER",
  "DEEP",
  "DKA",
  "DOGE",
  "DOT",
  "DRIFT",
  "EGLD",
  "ELF",
  "ENA",
  "ENJ",
  "ENS",
  "EPT",
  "ERA",
  "ETC",
  "ETH",
  "FCT2",
  "FIL",
  "FLOCK",
  "FLOW",
  "FORT",
  "G",
  "GAME2",
  "GAS",
  "GLM",
  "GMT",
  "GRS",
  "GRT",
  "GTC",
  "HAEDAL",
  "HBAR",
  "HIVE",
  "HP",
  "HUMA",
  "HUNT",
  "HYPER",
  "ICP",
  "ICX",
  "ID",
  "IMX",
  "INJ",
  "IO",
  "IOST",
  "IOTA",
  "IOTX",
  "IP",
  "IQ",
  "JASMY",
  "JST",
  "JTO",
  "JUP",
  "KAITO",
  "KAVA",
  "KERNEL",
  "KNC",
  "LA",
  "LAYER",
  "LINEA",
  "LINK",
  "LPT",
  "LRC",
  "LSK",
  "LWA",
  "MAGIC",
  "MANA",
  "MASK",
  "MBL",
  "ME",
  "MED",
  "META",
  "MEW",
  "MINA",
  "MLK",
  "MNT",
  "MOC",
  "MOCA",
  "MOODENG",
  "MOVE",
  "MTL",
  "MVL",
  "NCT",
  "NEAR",
  "NEO",
  "NEWT",
  "NMR",
  "NXPC",
  "OAS",
  "OBSR",
  "OGN",
  "OM",
  "OMNI",
  "ONDO",
  "ONG",
  "ONT",
  "OP",
  "OPEN",
  "ORBS",
  "ORCA",
  "OXT",
  "PENDLE",
  "PENGU",
  "PEPE",
  "POKT",
  "POL",
  "POLYX",
  "POWR",
  "PROVE",
  "PUFFER",
  "PUMP",
  "PUNDIX",
  "PYTH",
  "QKC",
  "QTUM",
  "RAD",
  "RAY",
  "RED",
  "REI",
  "RENDER",
  "RLC",
  "RSR",
  "RVN",
  "SAFE",
  "SAHARA",
  "SAND",
  "SC",
  "SCR",
  "SEI",
  "SHELL",
  "SHIB",
  "SIGN",
  "SKY",
  "SNT",
  "SNX",
  "SOL",
  "SONIC",
  "SOON",
  "SOPH",
  "SPURS",
  "STEEM",
  "STG",
  "STORJ",
  "STRAX",
  "STX",
  "SUI",
  "SUN",
  "SWELL",
  "SXP",
  "SYRUP",
  "T",
  "TAIKO",
  "TFUEL",
  "THETA",
  "TIA",
  "TOKAMAK",
  "TREE",
  "TRUMP",
  "TRX",
  "TT",
  "UNI",
  "USD1",
  "USDC",
  "USDS",
  "USDT",
  "UXLINK",
  "VANA",
  "VET",
  "VIRTUAL",
  "VTHO",
  "W",
  "WAL",
  "WAVES",
  "WAXP",
  "WCT",
  "WLD",
  "WLFI",
  "XEC",
  "XLM",
  "XRP",
  "XTZ",
  "YGG",
  "ZETA",
  "ZIL",
  "ZRO",
  "ZRX",
]);

const BITHUMB_API_BASE = "/api/crypto";

/**
 * 마켓 정보 조회
 */
export async function getMarkets(): Promise<MarketData[]> {
  try {
    const response = await fetch(BITHUMB_API_BASE);
    const data: BithumbTickerResponse = await response.json();

    if (data.status !== "0000") {
      throw new Error(`API Error: ${data.error || "Unknown error"}`);
    }

    return Object.keys(data.data)
      .filter((key) => key !== "date")
      .map((symbol) => {
        const cryptoInfo = getCryptoInfo(symbol);
        return {
          market: `${symbol}_KRW`,
          korean_name: cryptoInfo.koreanName,
          english_name: symbol,
        };
      });
  } catch (error) {
    return [];
  }
}

/**
 * 전체 암호화폐 시세 조회 (간소화 버전)
 */
export async function getAllTickers(): Promise<CryptoPrice[]> {
  try {
    // 서버 사이드에서는 절대 URL 필요
    const baseUrl =
      typeof window !== "undefined"
        ? "" // 클라이언트 사이드
        : process.env.NEXTAUTH_URL ||
          process.env.VERCEL_URL ||
          "http://localhost:3000"; // 서버 사이드

    const apiUrl = `${baseUrl}/api/crypto`;

    // 타임아웃 설정 (브라우저 호환성 개선)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      try {
        controller.abort();
      } catch (error) {
        console.warn('⚠️ AbortController timeout failed:', error);
      }
    }, 10000);

    console.log('🔗 Fetching from API:', apiUrl);

    let response;
    try {
      response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
        },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout (10 seconds)');
      }
      throw fetchError;
    }

    clearTimeout(timeoutId);
    console.log('📡 Response received:', response.status, response.statusText);

    if (!response.ok) {
      console.error('❌ HTTP Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(
        `HTTP error! status: ${response.status}, statusText: ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    console.log('📋 Content-Type:', contentType);
    
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error('❌ Invalid content type. Response preview:', textResponse.substring(0, 200));
      throw new Error("Invalid response format: expected JSON");
    }

    let data: BithumbTickerResponse;
    try {
      data = await response.json();
      console.log('✅ JSON parsed successfully. Status:', data.status);
    } catch (jsonError) {
      console.error('❌ JSON parse error:', jsonError);
      throw new Error('Failed to parse JSON response');
    }

    if (data.status !== "0000") {
      console.error('❌ API Error:', data.status, data.error);
      throw new Error(`API Error: ${data.error || "Unknown error"}`);
    }

    console.log('✅ Data received successfully, processing...');

    const processedData = Object.entries(data.data)
      .filter(
        ([symbol, ticker]) => symbol !== "date" && typeof ticker === "object"
      )
      .map(([symbol, ticker]) => {
        try {
          const tickerData = ticker as BithumbTickerData;
          
          // 안전한 파싱 사용
          let currentPrice = safeParseFloat(tickerData.closing_price);
          const prevPrice = safeParseFloat(tickerData.prev_closing_price);

          if (currentPrice === 0) {
            currentPrice = prevPrice;
          }

          if (currentPrice <= 0) {
            console.warn(`⚠️ Invalid price for ${symbol}: current=${currentPrice}, prev=${prevPrice}`);
            return null;
          }

          const changeAmount = currentPrice - prevPrice;
          const changeRate =
            prevPrice !== 0 ? (changeAmount / prevPrice) * 100 : 0;

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
            high_price: safeParseFloat(tickerData.max_price, currentPrice),
            low_price: safeParseFloat(tickerData.min_price, currentPrice),
            volume: safeParseFloat(tickerData.acc_trade_value_24H, 0),
            is_positive: changeAmount >= 0,
            sector: cryptoInfo.sector,
            isOnBinance,
            binanceSymbol: isOnBinance ? `${symbol}USDT` : undefined,
            isBinanceAlpha,
            isOnUpbit,
            upbitSymbol: isOnUpbit ? `KRW-${symbol}` : undefined,
          };
        } catch (itemError) {
          console.error(`❌ Error processing ${symbol}:`, itemError);
          return null;
        }
      })
      .filter((crypto) => crypto !== null && crypto!.current_price > 0)
      .sort((a, b) => {
        // 변동률 절댓값 기준으로 정렬 (가장 변동이 큰 순서)
        const aAbsChange = Math.abs(a!.change_rate);
        const bAbsChange = Math.abs(b!.change_rate);
        return bAbsChange - aAbsChange;
      });

    console.log('✅ Processing complete. Returning', processedData.length, 'items');
    return processedData as CryptoPrice[];
  } catch (error) {
    console.error("❌ getAllTickers error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      name: error instanceof Error ? error.name : "Unknown",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return [];
  }
}

/**
 * 특정 심볼의 시세 조회
 */
export async function getTicker(symbol: string): Promise<CryptoPrice> {
  const allTickers = await getAllTickers();
  const ticker = allTickers.find((t) => t.symbol === symbol);

  if (!ticker) {
    throw new Error(`Ticker not found for symbol: ${symbol}`);
  }

  return ticker;
}
