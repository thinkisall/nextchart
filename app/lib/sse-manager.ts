import { BithumbTickerResponse, BithumbTickerData, CryptoPrice } from "./types";
import { getCryptoInfo } from "./crypto";

// 바이낸스 및 업비트 코인 목록 (간소화)
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

const BINANCE_ALPHA_COINS = new Set([
  "AERO",
  "ATH",
  "AVAIL",
  "ai16z",
  "AVL",
  "AVNT",
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

const UPBIT_COINS = new Set([
  "HOLO",
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

// 직접 빗썸 API 호출 함수
async function fetchBithumbData(): Promise<CryptoPrice[]> {
  try {
    const response = await fetch(
      "https://api.bithumb.com/public/ticker/ALL_KRW",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BithumbTickerResponse = await response.json();

    if (data.status !== "0000") {
      throw new Error(`API Error: ${data.error || "Unknown error"}`);
    }

    const processedData = Object.entries(data.data)
      .filter(
        ([symbol, ticker]) => symbol !== "date" && typeof ticker === "object"
      )
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

    return processedData as CryptoPrice[];
  } catch (error) {
    console.error("❌ Direct Bithumb fetch error:", error);
    return [];
  }
}

// SSE 연결 관리자
class SSEConnectionManager {
  private connections = new Set<ReadableStreamDefaultController>();
  private cleanupIntervals = new Map<
    ReadableStreamDefaultController,
    NodeJS.Timeout
  >();

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

  addCleanupInterval(
    controller: ReadableStreamDefaultController,
    interval: NodeJS.Timeout
  ) {
    this.cleanupIntervals.set(controller, interval);
  }

  broadcast(data: string) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    // 연결이 끊어진 컨트롤러들을 추적
    const failedConnections: ReadableStreamDefaultController[] = [];

    this.connections.forEach((controller) => {
      try {
        controller.enqueue(encodedData);
      } catch (error) {
        // 연결이 끊어진 컨트롤러 기록
        failedConnections.push(controller);
      }
    });

    // 실패한 연결들 정리
    failedConnections.forEach((controller) => {
      this.removeConnection(controller);
    });
  }

  getConnectionCount() {
    return this.connections.size;
  }

  cleanup() {
    this.connections.forEach((controller) => {
      try {
        controller.close();
      } catch (error) {
        // 이미 닫힌 연결 무시
      }
    });

    this.cleanupIntervals.forEach((interval) => {
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

      // SSE 형식으로 데이터 브로드캐스트
      const sseData = `data: ${JSON.stringify(cryptoData)}\n\n`;
      sseManager.broadcast(sseData);
    } catch (error) {
      console.error("❌ Fetch error:", error);
      // Error handling - removed console.error for production
      const errorData = `data: ${JSON.stringify({
        error: "Failed to fetch data",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
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
