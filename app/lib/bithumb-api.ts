import {
  BithumbTickerResponse,
  BithumbTickerData,
  MarketData,
  CryptoPrice,
} from "./types";
import { CRYPTO_KOREAN_NAMES, getCryptoInfo } from "./crypto";

// 바이낸스 및 업비트 코인 목록 (전체)
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
  "SUSHI",
  "SXP",
  "SYRUP",
  "T",
  "TAIKO",
  "TFUEL",
  "THE",
  "THETA",
  "TIA",
  "TON",
  "TREE",
  "TRX",
  "TURBO",
  "UMA",
  "UNI",
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
  "WOO",
  "XAI",
  "XEC",
  "XLM",
  "XRP",
  "XTZ",
  "YFI",
  "YGG",
  "ZIL",
  "ZK",
  "ZRO",
  "ZRX",
]);

// 안전한 숫자 파싱 함수
function safeParseFloat(
  value: string | number | undefined | null,
  fallback: number = 0
): number {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = typeof value === "string" ? parseFloat(value) : value;
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
  "PUMP",
  "PUMPBTC",
  "RESOLV",
  "SAFE",
  "SD",
  "SUNDOG",
  "TAIKO",
  "XTER",
  "ZETA",
  "ZRC",
]);

/**
 * 안전한 fetch 함수
 */
async function safeFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 15000); // 15초 타임아웃
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // 네트워크 오류 세분화
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('요청 시간 초과 (15초) - 서버 응답이 지연되고 있습니다');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('네트워크 연결 오류 - 인터넷 연결을 확인해주세요');
      }
    }
    
    throw error;
  }
}

/**
 * 전체 암호화폐 시세 조회 (간소화 버전)
 */
export async function getAllTickers(forceRefresh: boolean = false): Promise<CryptoPrice[]> {
  try {
    // 서버 사이드에서는 절대 URL 필요
    const baseUrl =
      typeof window !== "undefined"
        ? "" // 클라이언트 사이드
        : process.env.NEXTAUTH_URL ||
          process.env.VERCEL_URL ||
          "http://localhost:3000"; // 서버 사이드

    // 강제 새로고침 파라미터 추가
    const refreshParam = forceRefresh ? '?refresh=true' : '';
    const apiUrl = `${baseUrl}/api/crypto${refreshParam}`;
    
    console.log("🔗 Fetching from API:", apiUrl, forceRefresh ? '(forced refresh)' : '');

    const response = await safeFetch(apiUrl, {
      headers: {
        "Cache-Control": forceRefresh ? "no-cache, no-store, must-revalidate" : "no-cache",
        "Pragma": forceRefresh ? "no-cache" : undefined,
        "Expires": forceRefresh ? "0" : undefined,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("📡 Response received:", response.status, response.statusText);

    if (!response.ok) {
      console.error("❌ HTTP Error Details:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      
      // 구체적인 에러 메시지 제공
      let errorMessage = `서버 오류 (${response.status})`;
      if (response.status === 429) {
        errorMessage = "요청 한도 초과 - 잠시 후 다시 시도해주세요";
      } else if (response.status >= 500) {
        errorMessage = "서버 내부 오류 - 잠시 후 다시 시도해주세요";
      } else if (response.status === 404) {
        errorMessage = "API 엔드포인트를 찾을 수 없습니다";
      }
      
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    console.log("📋 Content-Type:", contentType);

    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error(
        "❌ Invalid content type. Response preview:",
        textResponse.substring(0, 200)
      );
      throw new Error("서버에서 잘못된 응답 형식을 반환했습니다");
    }

    let data: BithumbTickerResponse;
    try {
      data = await response.json();
      console.log("✅ JSON parsed successfully. Status:", data.status);
    } catch (jsonError) {
      console.error("❌ JSON parse error:", jsonError);
      throw new Error("서버 응답을 처리할 수 없습니다 - 잠시 후 다시 시도해주세요");
    }

    // API 응답 상태 확인
    if (data.status !== "0000") {
      console.error("❌ API Error:", data.status, data.error);
      const errorMessage = data.error || "알 수 없는 API 오류";
      throw new Error(`API 오류: ${errorMessage}`);
    }

    // 데이터 유효성 검사
    if (!data.data || typeof data.data !== 'object') {
      throw new Error("서버에서 올바르지 않은 데이터를 받았습니다");
    }

    console.log("✅ Data received successfully, processing...");

    const processedData = Object.entries(data.data)
      .filter(
        ([symbol, ticker]) => symbol !== "date" && typeof ticker === "object"
      )
      .map(([symbol, ticker]) => {
        try {
          if (!validatePriceData(ticker as BithumbTickerData)) {
            return null;
          }

          const tickerData = ticker as BithumbTickerData;
          const cryptoInfo = getCryptoInfo(symbol);
          
          const currentPrice = safeParseFloat(tickerData.closing_price);
          const prevPrice = safeParseFloat(tickerData.prev_closing_price || tickerData.opening_price);
          const changeAmount = safeParseFloat(tickerData.fluctate_24H);
          const changeRate = safeParseFloat(tickerData.fluctate_rate_24H);

          return {
            symbol,
            korean_name: CRYPTO_KOREAN_NAMES[symbol] || symbol,
            current_price: currentPrice,
            change_amount: changeAmount,
            change_rate: changeRate,
            is_positive: changeAmount >= 0,
            volume: safeParseFloat(tickerData.acc_trade_value_24H),
            isOnBinance: BINANCE_COINS.has(symbol),
            isOnUpbit: UPBIT_COINS.has(symbol),
            isBinanceAlpha: BINANCE_ALPHA_COINS.has(symbol),
            sector: cryptoInfo.sector,
          } as CryptoPrice;
        } catch (error) {
          console.warn(`⚠️ Error processing ${symbol}:`, error);
          return null;
        }
      })
      .filter((item): item is CryptoPrice => item !== null)
      .sort((a, b) => {
        const aAbsChange = Math.abs(a!.change_rate);
        const bAbsChange = Math.abs(b!.change_rate);
        return bAbsChange - aAbsChange;
      });

    console.log(
      "✅ Processing complete. Returning",
      processedData.length,
      "items"
    );
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
export async function getTicker(symbol: string): Promise<CryptoPrice | null> {
  try {
    const allTickers = await getAllTickers();
    const ticker = allTickers.find((t) => t.symbol === symbol);

    if (!ticker) {
      throw new Error(`Ticker not found for symbol: ${symbol}`);
    }

    return ticker;
  } catch (error) {
    console.error(`❌ getTicker error for ${symbol}:`, error);
    return null;
  }
}
