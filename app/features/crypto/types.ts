// 암호화폐 feature 전용 타입 정의
export interface MarketStatsData {
  totalAssets: number;
  positiveCount: number;
  negativeCount: number;
}

export interface ConnectionStatus {
  sseConnected: boolean;
  wsConnected: boolean;
  sseError: string | null;
  wsError: string | null;
}

export interface CryptoMarketState {
  isClient: boolean;
  lastUpdated: Date | null;
  filteredData: any[];
}

// 이벤트 핸들러 타입들
export type CryptoClickHandler = (crypto: any) => void;
export type FilterChangeHandler = (filtered: any[]) => void;
export type FavoriteToggleHandler = (symbol: string) => void;
export type FavoriteCheckHandler = (symbol: string) => boolean;