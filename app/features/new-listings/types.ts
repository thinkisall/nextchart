export interface CoinInfo {
  name: string;
  symbol: string;
}

export interface Listing {
  title: string;
  categories: string[];
  publishedAt: string;
  url: string;
  coins: CoinInfo[];
}

export interface NewListingsResponse {
  listings: Listing[];
  count: number;
  lastUpdated: string;
  error?: string;
}
