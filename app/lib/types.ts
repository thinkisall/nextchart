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
}

export interface WebSocketMessage {
  type: 'ticker' | 'orderbook' | 'transaction';
  content: any;
}
