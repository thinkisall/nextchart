// 빗썸 API 응답 타입 정의
export interface BithumbTickerData {
  opening_price: string;
  closing_price: string;
  min_price: string;
  max_price: string;
  units_traded: string;
  acc_trade_value: string;
  prev_closing_price: string;
  units_traded_24H: string;
  acc_trade_value_24H: string;
  fluctate_24H: string;
  fluctate_rate_24H: string;
  date: string;
}

export interface BithumbTickerResponse {
  status: string;
  data: {
    [symbol: string]: BithumbTickerData | string;
    date: string;
  };
  error?: string;
}

export interface MarketData {
  market: string;
  korean_name: string;
  english_name: string;
  market_warning?: string;
}

export interface CryptoPrice {
  symbol: string;
  korean_name: string;
  english_name: string;
  current_price: number;
  change_rate: number;
  change_amount: number;
  high_price: number;
  low_price: number;
  volume: number;
  is_positive: boolean;
  sector?: string;
  // 바이낸스 관련 정보
  isOnBinance?: boolean;
  binanceSymbol?: string;
  isBinanceAlpha?: boolean;  // 바이낸스 알파 코인 여부
  // 업비트 관련 정보
  isOnUpbit?: boolean;
  upbitSymbol?: string;
}

export interface WebSocketMessage {
  type: 'ticker' | 'orderbook' | 'transaction';
  content: any;
}

// 바이낸스 API 타입 정의
export interface BinanceSymbolInfo {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
  baseAssetPrecision: number;
  quoteAssetPrecision: number;
  orderTypes: string[];
  icebergAllowed: boolean;
  ocoAllowed: boolean;
  quoteOrderQtyMarketAllowed: boolean;
  allowTrailingStop: boolean;
  cancelReplaceAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters: any[];
  permissions: string[];
  permissionSets: string[][];
  defaultSelfTradePreventionMode: string;
  allowedSelfTradePreventionModes: string[];
}

export interface BinanceExchangeInfo {
  timezone: string;
  serverTime: number;
  rateLimits: any[];
  exchangeFilters: any[];
  symbols: BinanceSymbolInfo[];
}

// 거래소 필터링 타입
export type ExchangeType = 'ALL' | 'BITHUMB' | 'UPBIT' | 'BINANCE' | 'BINANCE_ALPHA';

export interface ExchangeFilter {
  id: ExchangeType;
  name: string;
  icon: string;
  count?: number;
}
